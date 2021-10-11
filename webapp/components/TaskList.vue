<template>
  <div>
    <h2 v-if="title">{{ title }}</h2>
    <div class="task-list">
      <div class="task" v-for="task in tasks" :key="task.id">
        <div class="task-info">
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
            @click="onPrimaryButtonClick(task.id)"
          >
            {{ primaryButtonText }}
          </button>
          <button
            class="task-button"
            @click="onSecondaryButtonClick(task.id)"
          >
            {{ secodaryButtonText }}
          </button>
          <button
            class="task-button complete-button"
            @click="completeTask(task.id)"
          >
            Complete
          </button>
          <button
            class="task-button remove-button"
            @click="removeTask(task.id, task.project)"
          >
            Remove
          </button>
        </div>
      </div>
    </div>
  </div>
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
    primaryButtonText: {
      type: String,
      default: () => "",
    },
    secodaryButtonText: {
      type: String,
      default: () => "",
    },
    onPrimaryButtonClick: Function,
    onSecondaryButtonClick: Function,
  },
  methods: {
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
  padding: 10px;
  border: 0.5px solid hsla(200, 80%, 10%, 0.2);
  border-top: none;
}
.task:first-child {
  border: 0.5px solid hsla(200, 80%, 10%, 0.2);
}
.task-info {
  min-width: 200px;
}
.complete-task {
  text-decoration: line-through;
}
.task-button {
  padding: 0.4em 0.75em;
  margin-bottom: 2px;
}
.complete-button {
  background: rgb(19, 139, 49);
}
.complete-button:hover {
  background: rgb(25, 179, 64);
}
.remove-button {
  background: rgb(187, 47, 47);
}
.remove-button:hover {
  background: rgb(221, 55, 55);
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