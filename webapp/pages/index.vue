<template>
  <main>
    <div class="heading">
      <h1>Tasks</h1>
      <button @click="showAddTask = !showAddTask">Add Task</button>
    </div>
    <div v-if="showAddTask">
      <task-form />
    </div>
    <div v-else><br /></div>
    <task-list
      title="Active Tasks"
      :tasks="activeTasks"
      primaryButtonText="Queue"
      secodaryButtonText="Backlog"
      :onPrimaryButtonClick="id => toggleTaskQueued(id, true)"
      :onSecondaryButtonClick="id => toggleTaskActive(id, false)"
    />
    <br />
    <hr />
    <br />
    <task-list
      title="Queued Tasks"
      :tasks="queuedTasks"
      primaryButtonText="Active"
      secodaryButtonText="Backlog"
      :onPrimaryButtonClick="id => toggleTaskActive(id, true)"
      :onSecondaryButtonClick="id => toggleTaskQueued(id, false)"
    />
    <br />
    <hr />
    <br />
    <h2>Backlog Tasks</h2>
    <div v-for="projectId in Object.keys(backlogProjects).sort((a, b) => backlogProjects[a].createdAt - backlogProjects[b].createdAt)" :key="projectId">
      <div>
        <h3 class="project-name" @click="selectProject(backlogProjects[projectId])" >
          {{ backlogProjects[projectId].name }}
        </h3>
        <div v-if="categoriesData[backlogProjects[projectId].category]" class="subTitle">
          {{ categoriesData[backlogProjects[projectId].category].name }}
        </div>
      </div>
      <div v-if="selectedProject.id === projectId">
        <div v-if="backlogTasks[projectId] !== undefined">
          <task-list
            :tasks="backlogTasks[projectId]"
            primaryButtonText="Active"
            secodaryButtonText="Queue"
            :onPrimaryButtonClick="id => toggleTaskActive(id, true)"
            :onSecondaryButtonClick="id => toggleTaskQueued(id, true)"
          />
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
      selectedProject: {},
      showAddTask: false,
    }
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
  mounted () {
    this.$store.dispatch('projects/getPrioritiesData')
    this.$store.dispatch('tasks/getActiveTasks')
    this.$store.dispatch('tasks/getQueuedTasks')
  },
  methods: {
    selectProject (project) {
      if (this.selectedProject.id === project.id) {
        this.selectedProject = {}
      } else {
        this.selectedProject = project
        this.$store.dispatch('tasks/getProjectTasks', project.id)
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
.heading {
  display: flex;
  width: 100%;
  justify-content: space-between;
}
.project-name {
  color: rgb(21, 102, 207);
  font-weight: bold;
  cursor: pointer;
  margin-top: 10px;
}
.project-name:hover {
  color: rgb(116, 167, 233);
}
.task-list {
  margin: 20px 0;
  padding-left: 0;
}
.task {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin: 0;
  padding: 10px;
  border: 0.5px solid hsla(200, 80%, 10%, 0.2);
  border-top: none;
}
.task:first-child {
  border: 0.5px solid hsla(200, 80%, 10%, 0.2);
}
.complete-task {
  text-decoration: line-through;
}
.task-button {
  padding: 0.4em 0.75em
}
.complete-button {
  background: rgb(14, 156, 50);
}
.remove-button {
  background: rgb(145, 15, 15);
}
.subTitle {
  font-size: 0.8em;
  font-weight: bold;
  text-transform: uppercase;
}
.task-list .subTitle {
  font-size: 0.7em;
}
</style>