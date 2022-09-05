<template>
  <client-only>
    <div class="task-list-container">
      <h2 v-if="title">
        {{ title }}
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
.task-list {
  margin: 20px 0;
  padding-left: 0;
}

.too-many-tasks {
  color: var(--danger-color);
}
.good-tasks {
  color: var(--primary-color);
}
</style>