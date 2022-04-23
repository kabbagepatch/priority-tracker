<template>
  <task-list
    title="Active"
    :tasks="activeTasks"
    primaryIcon="angle-down"
    primaryButtonText="Queue"
    secondaryIcon="angle-double-down"
    secodaryButtonText="Backlog"
    :onPrimaryButtonClick="id => toggleTaskQueued(id, true)"
    :onSecondaryButtonClick="id => toggleTaskActive(id, false)"
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
      activeTasks: state => state.tasks.activeTasks,
    }),
  },
  created () {
    this.$store.dispatch('tasks/getActiveTasks');
  },
}
</script>

<style scoped>

</style>