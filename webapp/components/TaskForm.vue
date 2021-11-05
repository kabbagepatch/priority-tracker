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
    <fieldset v-if="!selectedTask" class="status">
      <legend>Status</legend>
      <div v-for="option in ['active', 'queue', 'backlog']" :key="option">
        <input
          :id="option"
          type="radio"
          :name="curTask.status"
          :checked="curTask.status === option"
          :value="option"
          @change="curTask.status = $event.target.value"
        />
        <label class="label" :for="option">{{ option }}</label><br>
      </div>
    </fieldset>
    <div class="add-task">
      <button type="submit">{{ selectedTask ? 'Update' : 'Add' }}</button>
      <button type="button" @click="onCancel">Cancel</button>
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
    console.log(this.selectedTask)
    if (this.selectedTask && this.selectedTask.name) {
      return { curTask: this.selectedTask };
    }
    return {
      curTask: {
        name: '',
        link: '',
        category: '',
        project: '',
        status: 'backlog',
      },
    }
  },
  watch: {
    selectedTask: function (newVal) {
      if (newVal && newVal.name) {
        this.curTask = newVal
      }
    },
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
      this.onCancelClick();
      this.curTask = {
        name: '',
        link: '',
        category: '',
        project: '',
        status: 'backlog',
      };
    },
  }
}
</script>

<style scoped>
.task-form {
  display: flex;
  flex-direction: column;
  margin: 20px 0;
  padding: 20px;
  padding-top: 10px;
  border: 0.5px solid hsla(200, 80%, 10%, 0.2);
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
</style>