<template>
  <form class="task-form" @submit.prevent="selectedTask ? updateTask() : addTask()">
    <label class="label" for="input">Title*</label>
    <input type="text" v-model="curTask.name" />
    <label class="label" for="input">Link</label>
    <input type="text" v-model="curTask.link" />
    <label class="label" for="select">Project</label>
    <select v-model="curTask.project" name="project" id="project" @change="selectTaskProject">
      <option value>Please select a project</option>
      <option v-for="id in Object.keys(prioritiesData)" :key="id" :value="id">
        {{ prioritiesData[id].name }}
      </option>
    </select>
    <label class="label" for="select">Cagetory*</label>
    <select :disabled="curTask.project.length !== 0 && curTask.project !== 'none'" v-model="curTask.category" name="category" id="category">
      <option value>Please select a category</option>
      <option v-for="categoryId in Object.keys(categoriesData)" :key="categoryId" :value="categoryId">
        {{ categoriesData[categoryId].name }}
      </option>
    </select>
    <fieldset class="status">
      <legend>Status</legend>
      <div v-for="option in ['active', 'queued', 'backlog']" :key="option">
        <input
          :id="option"
          type="radio"
          :name="curTask.status"
          :checked="curTask.status === option"
          :value="option"
          @change="curTask.status = $event.target.value"
        />
        <label class="label" :for="option">{{ option === 'queued' ? 'Up Next' : option[0].toUpperCase() + option.substr(1) }}</label><br>
      </div>
    </fieldset>
    <div class="add-task">
      <button type="submit">{{ selectedTask ? 'Update' : 'Add' }}</button>
      <button class="outlined secondary" type="button" @click="onCancel">Cancel</button>
      <button v-if="selectedTask" class="delete" type="button" @click="removeTask">Delete</button>
    </div>
  </form>
</template>

<script>
import { mapState } from 'vuex';

export default {
  props: {
    selectedTask: Object,
    onCancelClick: Function,
  },
  data() {
    if (this.selectedTask && this.selectedTask.name) {
      return {
        curTask: {
          ...this.selectedTask,
          status: this.selectedTask.active ? 'active' : (this.selectedTask.queued ? 'queued' : 'backlog'),
        }
      };
    }
    return {
      curTask: {
        name: '',
        link: '',
        category: '',
        project: '',
        status: this.$nuxt.$route.hash === '#next' ? 'queued' : (this.$nuxt.$route.hash ? this.$nuxt.$route.hash.substr(1) : 'backlog'),
      },
    }
  },
  computed: {
    ...mapState({
      categoriesData: state => state.categories.categoriesData,
      prioritiesData: state => state.projects.prioritiesData,
    }),
  },
  methods: {
    onCancel () {
      this.onCancelClick();
    },
    selectTaskProject (e) {
      const selectedProject = this.prioritiesData[e.target.value];
      if (selectedProject) {
        this.curTask.category = selectedProject.category;
      } else {
        this.curTask.category = '';
      }
    },
    addTask () {
      this.$store.dispatch('tasks/addTask', this.curTask);
      this.curTask = {
        name: '',
        link: '',
        category: '',
        project: '',
        status: 'backlog',
      };
    },
    updateTask () {
      this.$store.dispatch('tasks/updateTask', this.curTask);
      const prevStatus = this.selectedTask.active ? 'active' : (this.selectedTask.queued ? 'queued' : 'backlog');
      if (prevStatus !== this.curTask.status) {
        if (this.curTask.status === 'backlog') {
          this.$store.dispatch('tasks/updateTaskStatus', { id: this.curTask.id, status: prevStatus, value: false });
        } else {
          this.$store.dispatch('tasks/updateTaskStatus', { id: this.curTask.id, status: this.curTask.status, value: true });
        }
      }
    },
    removeTask () {
      if (confirm('Are you sure you want to delete this task?'))
        this.$store.dispatch('tasks/removeTask', this.curTask)
    },
  }
}
</script>

<style scoped>
.task-form {
  display: flex;
  flex-direction: column;
  padding: 20px;
  padding-top: 10px;
  background: var(--white);
  border: 1px solid var(--black-transparent);
  border-radius: 10px;
  border-top: none;
  border-top-left-radius: 0;
  border-top-right-radius: 0;
}

.status {
  margin-top: 20px;
  display: flex;
}

.status div {
  margin-right: 20px;
}

.add-task {
  margin-top: 20px;
}

button.delete {
  margin-right: 5px;
}
</style>