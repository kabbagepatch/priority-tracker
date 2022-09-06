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
          <task-list-item :task="task" />
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
      default: () => "",
    },
    tasks: {
      type: Array,
      default: () => [],
    },
    maxTasks: {
      type: Number,
      default: null,
    }
  },
}
</script>

<style scoped>
.task-list-container {
  background: var(--secondary-color);
  padding: 20px 0;
  border-radius: 10px;
}

h2 {
  display: flex;
  width: 100%;
  justify-content: space-between;
}

.task-list {
  padding-left: 0;
}

.too-many-tasks {
  color: var(--danger-color);
  text-shadow: 1px 1px 0.5px var(--black-transparent);
}
.good-tasks {
  color: var(--secondary-color);
  text-shadow: 1px 1px 0.5px var(--black);
}
</style>