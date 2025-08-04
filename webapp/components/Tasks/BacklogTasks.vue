<template>
  <div v-if="prioritiesData && Object.keys(prioritiesData).length > 0">
    <h2>
      Backlog
      <div class="show-completed">
        Show Completed
        <input type="checkbox" v-model="getCompleted" @change="changeCompleted" />
      </div>
    </h2>
    <div v-for="projectId in Object.keys(backlogProjects).sort((a, b) => backlogProjects[b].createdAt - backlogProjects[a].createdAt)" :key="projectId">
      <div class="project-section" @click="selectProject(projectId)">
        <h3 class="project-name">
          {{ backlogProjects[projectId].name }}
        </h3>
        <div v-if="categoriesData[backlogProjects[projectId].category]" class="subTitle">
          {{ categoriesData[backlogProjects[projectId].category].name }}
        </div>
      </div>
      <collapsible :collapse="!selectedProjects[projectId] || backlogTasks[projectId] === undefined || backlogTasks[projectId].length === 0">
        <div class="project-description-container">
          <div v-if="backlogProjects[projectId].description" class="project-description" v-html="linkifyHtml(backlogProjects[projectId].description)" />
          <div v-else />
          <div :style="{ width: '120px', 'margin-right': '10px' }">
            <button ref="task-form-button" class="add-task-button secondary" @click="() => { toggleTaskForm(projectId) }">Add Task</button>
          </div>
        </div>
        <div>
          <collapsible :collapse="!showTaskForm[projectId]">
            <task-form
              :showFullForm="true"
              :categoryId="backlogProjects[projectId].category"
              :projectId="projectId"
              :onCancelClick="() => { toggleTaskForm(projectId) }"
            />
          </collapsible>
        </div>
        <div class="task-list">
          <task-list
            :tasks="backlogTasks[projectId]"
          />
        </div>
      </collapsible>
      <div class="complete-notice" v-if="noMoreTasks(projectId)">
        <p>This Project has no more tasks. Would you like to mark it as complete?</p>
        <button
          class="secondary icon-only complete"
          aria-label="Mark Project as Complete"
          @click="completeProject(projectId)"
        >
          <v-icon name="check"/>
        </button>
      </div>
    </div>
    <br />
  </div>
</template>

<script>
import { mapState, mapGetters } from 'vuex';
import linkifyHtml from 'linkify-html';
import TaskList from './TaskList.vue';
import TaskForm from './TaskForm.vue';
import Collapsible from '../Collapsible.vue';

export default {
  components: {
    TaskList,
    TaskForm,
    Collapsible,
  },

  data() {
    return {
      selectedProjects: {},
      showTaskForm: {},
      getCompleted: false,
    }
  },

  computed: {
    ...mapState({
      categoriesData: state => state.categories.categoriesData,
      prioritiesData: state => state.projects.prioritiesData,
      projectTasksData: state => state.tasks.projectTasksData,
      workingTasksData: state => state.tasks.workingTasksData,
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
    linkifyHtml(a) {
      return linkifyHtml(a, { target: '_blank' });
    },
    selectProject (id) {
      if (this.selectedProjects[id]) {
        this.selectedProjects = { ...this.selectedProjects, [id]: false }
      } else {
        this.selectedProjects = { ...this.selectedProjects, [id]: true }
        this.$store.dispatch('tasks/getProjectTasks', { id, statuses: this.getCompleted ? ['complete', 'backlog'] : ['backlog'] });
      }
    },
    changeCompleted () {
      Object.keys(this.selectedProjects).forEach(id => {
        if (this.selectedProjects[id]) {
          this.$store.dispatch('tasks/getProjectTasks', { id, statuses: this.getCompleted ? ['complete', 'backlog'] : ['backlog'] });
        }
      });
    },
    completeProject (id) {
      this.$store.dispatch('projects/updateProject', { id, complete: true });
      this.selectedProjects = { ...this.selectedProjects, [id]: false }
    },
    noMoreTasks(projectId) {
      let workingTasksInProject = 0;
      Object.keys(this.workingTasksData).forEach(status => {
        workingTasksInProject += this.workingTasksData[status].filter(task => task.project === projectId).length;
      });
      return this.selectedProjects[projectId] && this.backlogTasks[projectId] && this.backlogTasks[projectId].length === 0 && workingTasksInProject === 0
    },
    toggleTaskForm(projectId) {
      this.showTaskForm = { ...this.showTaskForm, [projectId]: this.showTaskForm[projectId] ? false : true };
    },
  },
}
</script>

<style scoped>
h2 {
  border-radius: 20px;
  font-weight: 900 !important;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.show-completed {
  width: 100%;
  text-align: right;
  font-weight: 600 !important;
  text-transform: capitalize;
  color: var(--text-color);
  font-size: 16px;
}

.show-completed input {
  width: 16px;
  height: 16px;
  margin: 0 3px;
}

.project-section {
  cursor: pointer;
  background: var(--white);
  margin-top: 20px;
  margin-bottom: 1px;
  padding: 10px 15px;
  border-radius: 20px;
  box-shadow: var(--black-transparent) 2.95px 2.95px 3.6px, var(--dark-blue-transparenter) 0px 0px 2px 3px;
  display: flex;
  justify-content: space-between;
  transition: background-color 0.3s ease-in-out;
}

.project-name {
  transition: color 0.25s ease-in-out;
  color: var(--primary-color);
  font-weight: bold !important;
}

.project-description-container {
  margin-top: 5px;
  display: flex;
  flex-direction: row;
  justify-content: space-between;
}

.project-description {
  color: var(--text-color);
  font-weight: bold !important;
  margin-top: 10px;
  margin-left: 20px;
}

.project-section:hover {
  background: var(--white);
  box-shadow: var(--black-transparent) 2.95px 2.95px 3.6px, var(--dark-blue-transparent) 0px 0px 2px 3px;
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

.complete-notice {
  display: flex;
  width: 100%;
  justify-content: space-between;
  margin-top: 10px;
  padding-left: 20px;
}

.add-task-button {
  width: 100%;
  box-shadow: var(--black-transparent) 2.95px 2.95px 3.6px, var(--dark-blue-transparenter) 0px 0px 2px 3px;
  font-size: 18px;
  border-radius: 15px;
  margin-top: 10px;
}

.add-task-button:hover, .add-task-button:focus {
  color: black;
  transition: background ease 0.25s, box-shadow ease 0.25s;
  background: var(--secondary-color-light);
  box-shadow: var(--black-transparent) 2.95px 2.95px 3.6px, var(--dark-blue-transparent) 0px 0px 2px 3px;
}
</style>