<template>
  <div>
    <h2>Backlog</h2>
    <div v-for="projectId in Object.keys(backlogProjects).sort((a, b) => backlogProjects[a].createdAt - backlogProjects[b].createdAt)" :key="projectId">
      <div class="project-section" @click="selectProject(projectId)">
        <h3 class="project-name">
          {{ backlogProjects[projectId].name }}
        </h3>
        <div v-if="categoriesData[backlogProjects[projectId].category]" class="subTitle">
          {{ categoriesData[backlogProjects[projectId].category].name }}
        </div>
      </div>
      <div v-if="selectedProjects[projectId] === true">
        <div class="task-list" v-if="backlogTasks[projectId] !== undefined">
          <task-list
            :tasks="backlogTasks[projectId]"
            primaryIcon="angle-double-up"
            primaryButtonText="Active"
            secondaryIcon="angle-up"
            secodaryButtonText="Queue"
            :onPrimaryButtonClick="id => toggleTaskActive(id, true)"
            :onSecondaryButtonClick="id => toggleTaskQueued(id, true)"
          />
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapState, mapGetters } from 'vuex';
import TaskList from './TaskList.vue';

export default {
  components: {
    TaskList,
  },

  data() {
    return {
      selectedProjects: {},
    }
  },

  computed: {
    ...mapState({
      categoriesData: state => state.categories.categoriesData,
      prioritiesData: state => state.projects.prioritiesData,
      projectTasksData: state => state.tasks.projectTasksData,
    }),
    ...mapGetters('tasks', ['backlogTasks']),
    independentTasks() {
      return this.projectTasksData.none;
    },
    backlogProjects() {
      return Object.assign({}, this.prioritiesData, { none: { name: 'Other', id: 'none' } });
    },
  },

  methods: {
    selectProject (id) {
      console.log(this.selectedProjects[id]);
      if (this.selectedProjects[id]) {
        this.selectedProjects = { ...this.selectedProjects, [id]: false }
      } else {
        this.selectedProjects = { ...this.selectedProjects, [id]: true }
        this.$store.dispatch('tasks/getProjectTasks', id)
      }
    },
  },
}
</script>

<style scoped>
.project-section {
  cursor: pointer;
  background: white;
  margin: 20px 0;
  padding: 10px 15px;
  box-shadow: hsla(0, 0%, 0%, 0.52) 0px 1px 3px, hsla(0, 0%, 0%, 0.64) 0px 1px 2px;
  border-radius: 10px;
  display: flex;
  justify-content: space-between;
  transition: background-color 0.3s ease-in-out;
}
@media only screen and (max-width: 600px) {
  .project-section {
    flex-direction: column;
  }

  .subTitle {
    margin-top: 2px;
    font-size: 0.8em;
    font-weight: 600 !important;
    text-transform: uppercase;
  }
}
.project-name {
  transition: color 0.25s ease-in-out;
  color: hsl(204, 53%, 51%);
  font-weight: bold !important;
}
.project-section:hover {
  background: hsl(0, 0%, 96%);
}
.project-section:hover .project-name {
  color: hsl(204, 77%, 38%);
}
.task-list {
  margin-left: 20px;
}
</style>