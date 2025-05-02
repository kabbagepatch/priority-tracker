<template>
  <form class="task-form" @submit.prevent="selectedTask ? updateTask() : addTask()">
    <label :class="`label ${errors.name ? 'error' : ''}`" for="input">Title*</label>
    <input :class="errors.name ? 'error' : ''" type="text" v-model="curTask.name" @blur="onNameBlur" />
    <label class="label" for="input">Link</label>
    <input type="text" v-model="curTask.link" />
    <label class="label" for="select">Project</label>
    <select v-model="curTask.project" name="project" id="project" @change="selectTaskProject">
      <option value>Please select a project</option>
      <option v-for="id in Object.keys(prioritiesData)" :key="id" :value="id">
        {{ prioritiesData[id].name }}
      </option>
    </select>
    <label :class="`label ${errors.category ? 'error' : ''}`" for="select">Cagetory*</label>
    <select
      :disabled="curTask.project.length !== 0 && curTask.project !== 'none'"
      v-model="curTask.category"
      name="category"
      id="category"
      @blur="onCategoryBlur"
      :class="errors.category ? 'error' : ''"
    >
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
      <div class="checkbox">
        Add Another
        <input type="checkbox" v-model="addAnother" />
      </div>
      <button type="submit" :disabled="cannotSubmit">{{ selectedTask ? 'Update' : 'Add' }}</button>
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
    let curTask = {};
    if (this.selectedTask && this.selectedTask.name) {
      curTask = this.selectedTask;
    } else {
      curTask = {
        name: '',
        link: '',
        category: '',
        project: '',
        status: this.$nuxt.$route.hash === '#next' ? 'queued' : (this.$nuxt.$route.hash ? this.$nuxt.$route.hash.substr(1) : 'backlog'),
      };
    }
    return {
      curTask,
      errors: {
        name: false,
        category: false,
      },
      addAnother: false,
    }
  },
  computed: {
    ...mapState({
      categoriesData: state => state.categories.categoriesData,
      prioritiesData: state => state.projects.prioritiesData,
    }),
    cannotSubmit() {
      return !this.curTask.name || this.curTask.name.trim === '' || !this.curTask.category || this.curTask.category.trim === ''
    },
  },
  methods: {
    onNameBlur() {
      this.errors.name = !this.curTask.name || this.curTask.name.trim() === '';
    },
    onCategoryBlur() {
      this.errors.category = !this.curTask.category || this.curTask.category.trim() === '';
    },
    onCancel () {
      this.onCancelClick();
    },
    selectTaskProject (e) {
      const selectedProject = this.prioritiesData[e.target.value];
      if (selectedProject) {
        this.curTask.category = selectedProject.category;
        this.errors.category = false
      } else {
        this.curTask.category = '';
      }
    },
    addTask () {
      if (this.cannotSubmit) return;
      this.$store.dispatch('tasks/addTask', this.curTask);
      if (this.addAnother) {
        this.curTask = {
          name: '',
          link: '',
          category: this.curTask.category,
          project: this.curTask.project,
          status: this.curTask.status,
        };
      } else {
        this.curTask = {
          name: '',
          link: '',
          category: '',
          project: '',
          status: 'backlog',
        };
      }
    },
    updateTask () {
      if (this.cannotSubmit) return;
      this.$store.dispatch('tasks/updateTask', { ...this.curTask, onCallComplete: this.onCancelClick });
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
  padding: 30px;
  padding-top: 20px;
  margin-top: -10px;
  background: var(--white);
  border: 1px solid var(--black-transparent);
  border-radius: 15px;
  border-top: none;
  border-top-left-radius: 0;
  border-top-right-radius: 0;
}

label {
  margin-top: 15px;
}

label.error {
  color: var(--danger-color);
}

input.error {
  border: 1px solid var(--danger-color);
}

.status {
  margin-top: 20px;
  display: flex;
}

.status div {
  margin-right: 20px;
}

.add-task {
  margin-top: 25px;
}

button.delete {
  margin-right: 5px;
}
</style>