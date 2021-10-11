<template>
  <form class="task-form" @submit.prevent="addTask()">
    <label class="label" for="input">Title*</label>
    <input type="text" v-model="curTask.name" />
    <label class="label" for="select">Project</label>
    <select v-model="curTask.project" name="project" id="project" @change="selectTaskProject">
      <option value>Please select a project</option>
      <option v-for="id in Object.keys(prioritiesData)" :key="id" :value="id">
        {{ prioritiesData[id].name }}
      </option>
    </select>
    <label class="label" for="select">Cagetory*</label>
    <select :disabled="curTask.project.length !== 0" v-model="curTask.category" name="category" id="category">
      <option value>Please select a category</option>
      <option v-for="categoryId in Object.keys(categoriesData)" :key="categoryId" :value="categoryId">
        {{ categoriesData[categoryId].name }}
      </option>
    </select>
    <fieldset class="status">
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
      <button type="submit">Add</button>
    </div>
  </form>
</template>

<script>
import { mapState } from 'vuex';

export default {
  data() {
    return {
      curTask: {
        name: '',
        description: '',
        category: '',
        project: '',
        status: 'backlog',
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
        description: '',
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