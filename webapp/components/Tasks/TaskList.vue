<template>
  <client-only>
    <div class="task-list-container">
      <h2 v-if="title">
        <span>{{ title }}</span>
        <span
          v-if="maxTasks !== null" :class="maxTasks < tasks.length ? 'too-many-tasks' : 'good-tasks'"
        >
          ({{ tasks.length }}/{{ maxTasks }})
        </span>
      </h2>
      <div v-if="!tasks || tasks.length === 0">Loading...</div>
      <div class="task-list">
        <div v-for="task in tasks" :key="task.id">
          <task-list-item :task="task" :moveButtonText="moveButtonText" :onMoveButtonClick="() => onMoveButtonClick(task.id)" />
        </div>
      </div>
    </div>
  </client-only>
</template>

<script>
import TaskForm from './TaskForm.vue';
import TaskListItem from './TaskListItem.vue';

export default {
  components: {
    TaskForm,
    TaskListItem,
  },
  data () {
    return {
      selectedTask: undefined,
      showTaskForm: false,
    }
  },
  props: {
    title: {
      type: String,
      default: "",
    },
    tasks: {
      type: Array,
      default: () => [],
    },
    maxTasks: {
      type: Number,
      default: null,
    },
    moveButtonText: {
      type: String,
      default: null,
    },
    onMoveButtonClick: {
      type: Function,
      default: () => undefined,
    },
  },
}
</script>

<style scoped>

h2 {
  display: flex;
  width: 100%;
  border-radius: 20px;
  justify-content: space-between;
  font-weight: 900 !important;
  box-shadow: var(--black-transparent) 1.95px 1.95px 2.6px, var(--dark-blue-transparenter) 0px 0px 1px 2px;
}

.task-list {
  padding-left: 0;
  margin: 15px 0;
}

.too-many-tasks {
  color: var(--danger-color);
  text-shadow: 1px 1px 0.5px var(--black);
}
.good-tasks {
  color: var(--secondary-color);
  text-shadow: 1px 1px 0.5px var(--black);
}
</style>