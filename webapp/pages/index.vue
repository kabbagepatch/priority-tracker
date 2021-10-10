<template>
  <main>
    <div class="heading">
      <h1>Tasks</h1>
      <button @click="showAddTask = !showAddTask">Add Task</button>
    </div>
    <div v-if="showAddTask">
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
        <div class="add-task">
          <button type="submit">Add</button>
        </div>
      </form>
    </div>
    <div v-else><br /></div>
    <h2>Active Tasks</h2>
    <div class="task-list">
      <div class="task" v-for="task in activeTasks" :key="task.id">
        <div>
          <h4 :class="task.complete ? 'complete-task' : ''">{{ task.name }}</h4>
          <div v-if="prioritiesData[task.project]" class="subTitle">
            {{ prioritiesData[task.project].name }}
          </div>
          <div v-else-if="categoriesData[task.category]" class="subTitle">
            {{ categoriesData[task.category].name }}
          </div>
        </div>
        <div class="buttons">
          <button
            class="task-button"
            @click="toggleTaskActive(task.id, false)"
          >
            Backlog
          </button>
          <button
            class="task-button"
            @click="toggleTaskQueued(task.id, true)"
          >
            Queue
          </button>
          <button
            class="task-button complete-button"
            @click="toggleTaskComplete(task.id, true)"
          >
            Complete
          </button>
          <button
            class="task-button remove-button"
            @click="removeTask(task.id, project.id)"
          >
            Remove
          </button>
        </div>
      </div>
    </div>
    <br />
    <hr />
    <br />
    <h2>Queued Tasks</h2>
    <div class="task-list">
      <div class="task" v-for="task in queuedTasks" :key="task.id">
        <div>
          <h4 :class="task.complete ? 'complete-task' : ''">{{ task.name }}</h4>
          <div v-if="prioritiesData[task.project]" class="subTitle">
            {{ prioritiesData[task.project].name }}
          </div>
          <div v-else-if="categoriesData[task.category]" class="subTitle">
            {{ categoriesData[task.category].name }}
          </div>
        </div>
        <div class="buttons">
          <button
            class="task-button"
            @click="toggleTaskActive(task.id, true)"
          >
            Active
          </button>
          <button
            class="task-button"
            @click="toggleTaskQueued(task.id, false)"
          >
            Backlog
          </button>
          <button
            class="task-button complete-button"
            @click="toggleTaskComplete(task.id, true)"
          >
            Complete
          </button>
          <button
            class="task-button remove-button"
            @click="removeTask(task.id, project.id)"
          >
            Remove
          </button>
        </div>
      </div>
    </div>
    <br />
    <hr />
    <br />
    <h2>Backlog Tasks</h2>
    <div v-for="projectId in Object.keys(backlogProjects)" :key="projectId">
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
          <ul class="task-list">
            <li class="task" v-for="task in backlogTasks[projectId]" :key="task.id">
              <div>
                <div :class="task.complete ? 'complete-task' : ''">{{ task.name }}</div>
                <div v-if="(!task.project || task.project === 'none') && categoriesData[task.category]" class="subTitle">
                  {{ categoriesData[task.category].name }}
                </div>
              </div>
              <div class="buttons">
                <button
                  class="task-button"
                  @click="toggleTaskActive(task.id, true)"
                >
                  Active
                </button>
                <button
                  class="task-button"
                  @click="toggleTaskQueued(task.id, true)"
                >
                  Queue
                </button>
                <button
                  class="task-button complete-button"
                  @click="toggleTaskComplete(task.id, true)"
                >
                  Complete
                </button>
                <button
                  class="task-button remove-button"
                  @click="removeTask(task.id, projectId)"
                >
                  Remove
                </button>
              </div>
            </li>
          </ul>
        </div>
      </div>
    </div>
  </main>
</template>

<script>
import { mapState, mapGetters } from 'vuex';

export default {
  data() {
    return {
      selectedProject: {},
      curTask: {
        name: '',
        description: '',
        category: '',
        project: '',
      },
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
    selectTaskProject (e) {
      const selectedProject = this.prioritiesData[e.target.value];
      if (selectedProject) {
        this.curTask.category = selectedProject.category;
      } else {
        this.curTask.category = '';
      }
    },
    selectProject (project) {
      if (this.selectedProject.id === project.id) {
        this.selectedProject = {}
      } else {
        this.selectedProject = project
        this.$store.dispatch('tasks/getProjectTasks', project.id)
      }
    },
    addTask () {
      this.$store.dispatch('tasks/addTask', this.curTask);
      this.curTask = {
        name: '',
        description: '',
        category: '',
        project: '',
      };
    },
    removeTask (id, projectId) {
      this.$store.dispatch('tasks/removeTask', { id, projectId })
    },
    toggleTaskComplete (id, value) {
      this.$store.dispatch('tasks/updateTaskStatus', { id, status: 'complete', value });
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
.task-form {
  display: flex;
  flex-direction: column;
  margin: 20px 0;
  padding: 20px;
  padding-top: 10px;
  border: 0.5px solid hsla(200, 80%, 10%, 0.2);
}
.add-task {
  margin-top: 20px;
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