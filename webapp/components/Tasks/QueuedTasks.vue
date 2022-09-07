<template>
  <task-list
    title="Up Next"
    :tasks="queuedTasks"
    :maxTasks="5"
    moveButtonText="Move To Active"
    :onMoveButtonClick="id => moveTaskToActive(id)"
    :onUpdateClick="task => { showTaskForm = true; selectedTask = { ...task } }"
  />
</template>

<script>
import { mapState } from 'vuex';
import TaskList from './TaskList.vue';

export default {
  components: {
    TaskList,
  },
  computed: {
    ...mapState({
      queuedTasks: state => state.tasks.queuedTasks,
    }),
  },
  created () {
    this.$store.dispatch('tasks/getQueuedTasks');
  },
  methods: {
    moveTaskToActive (id) {
      this.$store.dispatch('tasks/updateTaskStatus', { id, status: 'active', value: true });
    },
  }
}
</script>

<style scoped>

</style>