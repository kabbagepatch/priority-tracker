<template>
  <main>
    <button class="add-task-button" @click="showTaskForm = !showTaskForm">{{ selectedTask ? 'Update' : 'Add' }} Task</button>
    <div v-if="showTaskForm">
      <task-form
        :selectedTask="selectedTask"
        :onCancelClick="() => { showTaskForm = false, selectedTask = undefined }"
      />
    </div>
    <task-list
      v-if="!$nuxt.$route.hash || $nuxt.$route.hash.includes('active')"
      title="Active Tasks"
      :tasks="activeTasks"
      primaryIcon="angle-down"
      primaryButtonText="Queue"
      secondaryIcon="angle-double-down"
      secodaryButtonText="Backlog"
      :onPrimaryButtonClick="id => toggleTaskQueued(id, true)"
      :onSecondaryButtonClick="id => toggleTaskActive(id, false)"
      :onUpdateClick="task => { showTaskForm = true; selectedTask = { ...task } }"
    />
    <br />
    <task-list
      v-if="!$nuxt.$route.hash || $nuxt.$route.hash.includes('queue')"
      title="Queued Tasks"
      :tasks="queuedTasks"
      primaryIcon="angle-up"
      primaryButtonText="Active"
      secondaryIcon="angle-down"
      secodaryButtonText="Backlog"
      :onPrimaryButtonClick="id => toggleTaskActive(id, true)"
      :onSecondaryButtonClick="id => toggleTaskQueued(id, false)"
      :onUpdateClick="task => { showTaskForm = true; selectedTask = { ...task } }"
    />
    <br />
    <div
      v-if="!$nuxt.$route.hash || $nuxt.$route.hash.includes('backlog')"
    >
      <h2>Backlog Tasks</h2>
      <div v-for="projectId in Object.keys(backlogProjects).sort((a, b) => backlogProjects[a].createdAt - backlogProjects[b].createdAt)" :key="projectId">
        <div class="project-section">
          <h3 class="project-name" @click="selectProject(projectId)" >
            {{ backlogProjects[projectId].name }}
          </h3>
          <div v-if="categoriesData[backlogProjects[projectId].category]" class="subTitle">
            {{ categoriesData[backlogProjects[projectId].category].name }}
          </div>
        </div>
        <div v-if="selectedProjects[projectId] === true">
          <div v-if="backlogTasks[projectId] !== undefined">
            <task-list
              :tasks="backlogTasks[projectId]"
              primaryIcon="angle-double-up"
              primaryButtonText="Active"
              secondaryIcon="angle-up"
              secodaryButtonText="Queue"
              :onPrimaryButtonClick="id => toggleTaskActive(id, true)"
              :onSecondaryButtonClick="id => toggleTaskQueued(id, true)"
              :onUpdateClick="task => { showTaskForm = true; selectedTask = { ...task } }"
            />
          </div>
        </div>
      </div>
    </div>
  </main>
</template>

<script>
import { mapState, mapGetters } from 'vuex';
import TaskList from '@/components/TaskList.vue';
import TaskForm from '@/components/TaskForm.vue';

export default {
  components: {
    TaskList,
    TaskForm,
  },
  data() {
    return {
      selectedProjects: {},
      selectedTask: undefined,
      showTaskForm: false,
      showQueue: true,
      showBacklog: true,
      showProject: {},
    }
  },
  head() {
    return {
      script: [{ src: 'https://identity.netlify.com/v1/netlify-identity-widget.js' }],
    };
  },
  computed: {
    ...mapState({
      categoriesData: state => state.categories.categoriesData,
      prioritiesData: state => state.projects.prioritiesData,
      projectTasksData: state => state.tasks.projectTasksData,
      activeTasks: state => state.tasks.activeTasks,
      queuedTasks: state => state.tasks.queuedTasks,
    }),
    ...mapGetters('tasks', ['backlogTasks']),
    independentTasks() {
      return this.projectTasksData.none;
    },
    backlogProjects() {
      return Object.assign({}, this.prioritiesData, { none: { name: 'Other', id: 'none' } });
    },
  },
  created () {
    this.$store.dispatch('categories/getCategoryData');
    this.$store.dispatch('projects/getPrioritiesData');
    this.$store.dispatch('tasks/getActiveTasks');
    this.$store.dispatch('tasks/getQueuedTasks');
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
    toggleTaskActive (id, value) {
      this.$store.dispatch('tasks/updateTaskStatus', { id, status: 'active', value });
    },
    toggleTaskQueued (id, value) {
      this.$store.dispatch('tasks/updateTaskStatus', { id, status: 'queued', value });
    },
  },
}
</script>

<style scoped>
.add-task-button {
  width: 100%;
  border: 1px solid hsl(187, 66%, 30%);
  color: hsl(187, 66%, 30%);
  background: white;
  box-shadow: hsla(0, 0%, 0%, 0.15) 1.95px 1.95px 2.6px;
  font-size: 18px;
  border-radius: 10px;
  margin-bottom: 20px;
}
.add-task-button:hover {
  background: hsl(0, 0%, 95%);
}
.project-section {
  margin: 20px 0;
}
.project-name {
  transition: color 0.25s ease-in-out;
  color: hsl(214, 76%, 45%);
  font-weight: bold !important;
  cursor: pointer;
  margin-top: 10px;
}
.project-name:hover {
  color: hsl(214, 56%, 54%);
}
</style>