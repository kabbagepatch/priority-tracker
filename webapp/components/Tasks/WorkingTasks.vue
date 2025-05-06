<template>
  <div>
    <task-list
      :title="title"
      :tasks="tasks"
      :maxTasks="maxTasks"
    />
    <add-task-button v-if="showAddButton" />
  </div>
</template>

<script>
import { mapState } from 'vuex';
import TaskList from './TaskList.vue';
import AddTaskButton from './AddTaskButton.vue';

export default {
  props: {
    title: {
      type: String,
      default: "",
    },
    status: {
      type: String,
      default: "",
    },
    maxTasks: {
      type: Number,
      default: 5,
    },
    showAddButton: {
      type: Boolean,
      default: false,
    }
  },
  components: {
    TaskList,
    AddTaskButton,
  },
  computed: {
    ...mapState({
      tasks(state) {
        return state.tasks.workingTasksData[this.status];
      }
    }),
  },
  created () {
    this.$store.dispatch('tasks/getTaskByStatus', { status: this.status });
  },
}
</script>

<style scoped>

</style>