<template>
  <client-only>
    <div class="task-list-container">
      <h2 v-if="title">{{ title }}</h2>
      <div class="task-list">
        <div class="task" v-for="task in tasks" :key="task.id">
          <div class="task-info">
            <h4 :class="task.complete ? 'complete-task' : ''">
              <a class="task-name task-name-link" v-if="task.link" :href="task.link" target="_blank">
                {{ task.name }}
              </a>
              <span class="task-name" v-else>{{ task.name }}</span>
            </h4>
            <div v-if="prioritiesData[task.project]" class="subTitle">
              {{ prioritiesData[task.project].name }}
            </div>
            <div v-else-if="categoriesData[task.category]" class="subTitle">
              {{ categoriesData[task.category].name }}
            </div>
          </div>
          <div class="buttons">
            <button><v-icon name="angle-down"/></button>
            <!-- <button
              class="task-button"
              @click="onPrimaryButtonClick(task.id)"
            >
              <v-icon :name="primaryIcon"/>
              {{ primaryButtonText }}
            </button>
            <button
              class="task-button"
              @click="onSecondaryButtonClick(task.id)"
            >
              <v-icon :name="secondaryIcon"/>
              {{ secodaryButtonText }}
            </button>
            <button
              class="task-button update-button"
              @click="updateTask(task)"
            >
              <v-icon name="edit"/>
              Update
            </button>
            <button
              class="task-button complete-button"
              @click="completeTask(task.id)"
            >
              <v-icon name="check"/>
              Complete
            </button>
            <button
              class="task-button remove-button"
              @click="removeTask(task.id, task.project)"
            >
              <v-icon name="trash"/>
              Remove
            </button> -->
          </div>
        </div>
      </div>
    </div>
  </client-only>
</template>

<script>
import { mapState, mapGetters } from 'vuex';

export default {
  computed: {
    ...mapState({
      categoriesData: state => state.categories.categoriesData,
      prioritiesData: state => state.projects.prioritiesData,
    }),
  },
  props: {
    title: {
      type: String,
      default: () => "",
    },
    tasks: {
      type: Array,
      default: () => [],
    },
    primaryIcon: String,
    primaryButtonText: {
      type: String,
      default: () => "",
    },
    secondaryIcon: String,
    secodaryButtonText: {
      type: String,
      default: () => "",
    },
    onPrimaryButtonClick: Function,
    onSecondaryButtonClick: Function,
    onUpdateClick: Function,
  },
  methods: {
    updateTask (task) {
      window.scrollTo(0, 0);
      this.onUpdateClick(task);
    },
    removeTask (id, projectId) {
      this.$store.dispatch('tasks/removeTask', { id, projectId })
    },
    completeTask (id) {
      this.$store.dispatch('tasks/updateTaskStatus', { id, status: 'complete', value: true });
    },
  }
}
</script>

<style scoped>
.task-list {
  margin: 20px 0;
  padding-left: 0;
}
.task {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin: 0;
  margin-bottom: 10px;
  background: white;
  padding: 15px 20px;
  box-shadow: hsla(0, 0%, 0%, 0.15) 1.95px 1.95px 2.6px;
  border-radius: 10px;
}
.task-info {
  min-width: 200px;
  overflow: auto;
  margin-right: 20px;
}
.complete-task {
  text-decoration: line-through;
}
.buttons {
  text-align: right;
  min-width: 100px;
}
@media only screen and (max-width: 600px) {
  .buttons button {
    width: 100%;
  }
}
.task-button {
  padding: 0.4em 0.75em;
  margin-bottom: 2px;
}
.update-button {
  background: hsl(51, 53%, 65%);
}
.update-button:hover {
  background: hsl(51, 85%, 63%);
}
.complete-button {
  background: hsl(135, 76%, 31%);
}
.complete-button:hover {
  background: hsl(135, 75%, 40%);
}
.remove-button {
  background: hsl(0, 60%, 46%);
}
.remove-button:hover {
  background: hsl(0, 71%, 54%);
}
.subTitle {
  font-size: 0.8em;
  font-weight: 500;
  text-transform: uppercase;
}
.task-list .subTitle {
  font-size: 0.7em;
}
.task-name {
  font-weight: 400;
}
.task-name-link {
  color: hsl(204, 53%, 51%);
  text-decoration: underline solid hsla(204, 53%, 51%, 0.4);
}
.task-name-link:hover {
  color: hsl(204, 77%, 68%);
}
</style>