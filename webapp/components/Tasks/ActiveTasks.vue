<template>
  <div>
    <task-list
      title="Active"
      :tasks="activeTasks"
      :maxTasks="2"
    />
    <add-task-button v-if="showAddButton && activeTasks && activeTasks.length > 0" />
  </div>
</template>

<script>
import { mapState } from 'vuex';
import TaskList from './TaskList.vue';
import AddTaskButton from './AddTaskButton.vue';

export default {
  props: {
    showAddButton: false,
  },
  components: {
    TaskList,
    AddTaskButton,
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