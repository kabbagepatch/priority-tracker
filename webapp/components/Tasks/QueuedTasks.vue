<template>
  <task-list
    title="Up Next"
    :tasks="queuedTasks"
    primaryIcon="angle-up"
    primaryButtonText="Active"
    secondaryIcon="angle-down"
    secodaryButtonText="Backlog"
    :onPrimaryButtonClick="id => toggleTaskActive(id, true)"
    :onSecondaryButtonClick="id => toggleTaskQueued(id, false)"
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
}
</script>

<style scoped>

</style>