<template>
  <div>
    <div class="heading">
      <h1>Backlog</h1>
      <button @click="showAddTask = !showAddTask">Add Task</button>
    </div>
    <div v-if="showAddTask">
      <form class="task-form" @submit.prevent="addTask(true)">
        <label class="label" for="input">Title*</label>
        <input type="text" v-model="curTask.name" />
        <label class="label" for="select">Project</label>
        <select v-model="curTask.project" name="project" id="project" @change="selectTaskProject">
          <option value>Please select a project</option>
          <option v-for="option in prioritiesData" :key="option.id" :value="option.id">
            {{ option.name }}
          </option>
        </select>
        <label class="label" for="select">Cagetory*</label>
        <select :disabled="curTask.project.length !== 0" v-model="curTask.category" name="category" id="category">
          <option value>Please select a category</option>
          <option v-for="option in categoryData" :key="option.id" :value="option.id">
            {{ option.name }}
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
          <div v-if="prioritiesData.filter(p => p.id === task.project).length" class="subTitle">
            {{ prioritiesData.filter(p => p.id === task.project)[0].name }}
          </div>
          <div v-else class="subTitle">
            {{ categoryData.filter(c => c.id === task.category)[0].name }}
          </div>
        </div>
        <div class="buttons">
          <button
            class="remove-button"
            @click="toggleTaskActive(task, false)"
          >
            Move to Backlog
          </button>
          <button
            class="remove-button"
            @click="toggleTaskComplete(task, !task.complete)"
          >
            {{ task.complete ? 'Uncomplete' : 'Complete' }}
          </button>
          <button
            class="remove-button"
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
    <div v-for="project in prioritiesData.concat({ name: 'Other', id: 'none' })" :key="project.id">
      <div>
        <h3 class="project-name" @click="selectProject(project)" >
          {{ project.name }}
        </h3>
        <div v-if="project.category" class="subTitle">
          {{ categoryData.filter(c => c.id === project.category)[0].name }}
        </div>
      </div>
      <div v-if="selectedProject.id === project.id">
        <div v-if="backlogTasks[project.id] !== undefined">
          <ul class="task-list">
            <li class="task" v-for="task in backlogTasks[project.id]" :key="task.id">
              <div>
                <div :class="task.complete ? 'complete-task' : ''">{{ task.name }}</div>
                <div v-if="!task.project || task.project === 'none'" class="subTitle">
                  {{ categoryData.filter(c => c.id === task.category)[0].name }}
                </div>
              </div>
              <div class="buttons">
                <button
                  class="remove-button"
                  @click="toggleTaskActive(task, true)"
                >
                  Move to Active
                </button>
                <button
                  class="remove-button"
                  @click="toggleTaskComplete(task, !task.complete)"
                >
                  {{ task.complete ? 'Uncomplete' : 'Complete' }}
                </button>
                <button
                  class="remove-button"
                  @click="removeTask(task.id, project.id)"
                >
                  Remove
                </button>
              </div>
            </li>
          </ul>
        </div>
      </div>
    </div>
  </div>
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
    ...mapState([
      'prioritiesData',
      'projectTasksData',
      'categoryData',
      'activeTasks',
    ]),
    ...mapGetters([
      'backlogTasks',
    ]),
    independentTasks() {
      return this.projectTasksData.none;
    },
  },
  mounted () {
    this.$store.dispatch('getPrioritiesData')
    this.$store.dispatch('getActiveTasks')
  },
  methods: {
    selectTaskProject (e) {
      const selectedProject = this.prioritiesData.find(p => p.id === e.target.value);
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
        this.$store.dispatch('getProjectTasks', project.id)
      }
    },
    addTask () {
      this.$store.dispatch('addTask', this.curTask);
      this.curTask = {
        name: '',
        description: '',
        category: '',
        project: '',
      };
    },
    removeTask (id, projectId) {
      this.$store.dispatch('removeTask', { id, projectId })
    },
    toggleTaskComplete (task, complete) {
      this.$store.dispatch('updateTask', {
        ...task,
        complete,
      })
    },
    toggleTaskActive (task, active) {
      this.$store.dispatch('updateTask', {
        ...task,
        active,
      })
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
  width: 500px;
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
.remove-button {
  padding: 0.4em 0.75em
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