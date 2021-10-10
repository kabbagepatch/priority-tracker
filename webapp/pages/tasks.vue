<template>
  <div>
    <h1>Tasks</h1>
    <div>
      <p>Congratulations! You've made it this far! These are the projects you've selected as high priority:</p>
      <p>It is now time to add tasks to projects so we can actually start doing the work</p>
      <p>You know the drill. Select one of the below and add as many tasks as you think it'll take to complete the project. Treat this like a brainstorming session. And as always, you can always add more or remove some later</p>
      <p>Hit <nuxt-link to="/"><button class="continue">Continue</button></nuxt-link> when you're done with adding tasks or just wanna continue to the backlog</p>
      <div v-for="projectId in Object.keys(prioritiesData)" :key="projectId">
        <div>
          <h3 class="project-name" @click="selectProject(prioritiesData[projectId])" >
            <span v-if="selectedProject.id === projectId">></span>
            {{ prioritiesData[projectId].name }}
          </h3>
          <div v-if="categoriesData[prioritiesData[projectId].category]" class="category">
            {{ categoriesData[prioritiesData[projectId].category].name }}
          </div>
        </div>
        <div v-if="selectedProject.id === projectId">
          <div >
            <form class="task-form" @submit.prevent="addTask()">
              <label class="label" for="input">
                <h3>Add Task</h3>
              </label>
              <input type="text" v-model="curTask.name" />
            </form>
            <div v-if="projectTasksData[projectId] !== undefined">
              <h3 class="task-list-title">Current Tasks</h3>
              <ul class="task-list">
                <li class="task" v-for="task in projectTasksData[projectId]" :key="task.id">
                  <div>{{ task.name }}</div>
                  <button
                    class="remove-button"
                    @click="removeTask(task.id, projectId)"
                  >
                    Remove
                  </button>
                </li>
              </ul>
              <br />
              <hr />
            </div>
          </div>
        </div>
      </div>
      <br />
      <p>You can also add independent tasks directly to categories</p>
      <div>
        <form class="full-task-form" @submit.prevent="addTask(true)">
          <label class="label" for="input">Title</label>
          <input type="text" v-model="curIndependentTask.name" />
          <label class="label" for="select">Cagetory</label>
          <select v-model="curIndependentTask.category" name="category" id="category">
            <option value>Please select a category</option>
            <option v-for="id in Object.keys(categoriesData)" :key="id" :value="id">
              {{ categoriesData[id].name }}
            </option>
          </select>
          <div class="add-task">
            <button type="submit">Add</button>
          </div>
        </form>
        <h3 class="task-list-title">Current Independent Tasks</h3>
          <ul class="task-list">
            <li class="task" v-for="task in independentTasks" :key="task.id">
              <div>
                <div>{{ task.name }}</div>
                <div v-if="categoriesData[task.category]" class="category">
                  {{ categoriesData[task.category].name }}
                </div>
              </div>
              <div>
                <button
                  class="remove-button"
                  @click="removeTask(task.id, 'none')"
                >
                  Remove
                </button>
              </div>
            </li>
          </ul>
      </div>
    </div>
  </div>
</template>

<script>
import { mapState } from 'vuex';

export default {
  data() {
    return {
      selectedProject: {},
      curTask: {
        name: '',
        description: '',
      },
      curIndependentTask: {
        name: '',
        description: '',
        category: '',
        project: 'none',
      }
    }
  },
  computed: {
    ...mapState({
      categoriesData: state => state.categories.categoriesData,
      prioritiesData: state => state.projects.prioritiesData,
      projectTasksData: state => state.tasks.projectTasksData,
    }),
    independentTasks() {
      return this.projectTasksData.none;
    },
  },
  mounted () {
    this.$store.dispatch('projects/getPrioritiesData')
    this.$store.dispatch('tasks/getIndependentTasks')
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
    addTask (isIndependent) {
      if (isIndependent) {
        this.$store.dispatch('tasks/addTask', this.curIndependentTask);
        this.curIndependentTask = {
          name: '',
          description: '',
          category: '',
          project: 'none',
        }
      } else {
        this.$store.dispatch('tasks/addTask', {
          ...this.curTask,
          project: this.selectedProject.id,
          category: this.selectedProject.category,
        });
        this.curTask = {
          name: '',
          description: '',
          category: '',
        }
      }
    },
    removeTask (id, projectId) {
      this.$store.dispatch('tasks/removeTask', { id, projectId })
    }
  }
};
</script>

<style scoped>
.project-name {
  color: rgb(21, 102, 207);
  font-weight: bold;
  cursor: pointer;
  margin-top: 10px;
}

.project-name:hover {
  color: rgb(116, 167, 233);
}

.task-form, .full-task-form {
  display: flex;
  flex-direction: column;
  margin-bottom: 20px;
  width: 500px;
}
.task-form input {
  margin-left: 10px;
}
.task-list {
  margin-top: 10px;
  padding-left: 10px;
}
.task {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin: 5px 0;
  width: 500px;
}
.remove-button, .add-task button {
  padding: 0.4em 0.75em
}
.add-task {
  margin: 10px 0;
}
.category {
  font-size: 0.8em;
  font-weight: bold;
  text-transform: uppercase;
}
</style>