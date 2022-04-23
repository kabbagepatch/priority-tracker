<template>
  <main>
    <active-tasks
      v-if="!$nuxt.$route.hash || $nuxt.$route.hash.includes('active')"
    />
    <queued-tasks
      v-if="!$nuxt.$route.hash || $nuxt.$route.hash.includes('next')"
    />
    <div
      v-if="!$nuxt.$route.hash || $nuxt.$route.hash.includes('backlog')"
    >
      <backlog-tasks />
    </div>
    <button ref="task-form-button" class="add-task-button" @click="toggleTaskForm">{{ selectedTask ? 'Update' : 'Add' }} Task</button>
    <div v-if="showTaskForm">
      <task-form
        :selectedTask="selectedTask"
        :onCancelClick="() => { showTaskForm = false, selectedTask = undefined }"
      />
    </div>
  </main>
</template>

<script>
import ActiveTasks from '@/components/Tasks/ActiveTasks.vue';
import QueuedTasks from '@/components/Tasks/QueuedTasks.vue';
import BacklogTasks from '@/components/Tasks/BacklogTasks.vue';
import TaskForm from '@/components/Tasks/TaskForm.vue';

export default {
  components: {
    TaskForm,
    ActiveTasks,
    QueuedTasks,
    BacklogTasks,
  },

  data() {
    return {
      selectedTask: undefined,
      showTaskForm: false,
    }
  },

  head() {
    return {
      script: [{ src: 'https://identity.netlify.com/v1/netlify-identity-widget.js' }],
    };
  },

  created () {
    this.$store.dispatch('categories/getCategoryData');
    this.$store.dispatch('projects/getPrioritiesData');
  },

  methods: {
    toggleTaskForm() {
      this.showTaskForm = !this.showTaskForm;
      setTimeout(() => {
        if (this.showTaskForm)
          window.scrollTo(0, this.$refs['task-form-button'].offsetTop + 20);
      }, 10);
    },
  },
}
</script>

<style scoped>
.add-task-button {
  width: 100%;
  border: 1px solid hsl(187, 66%, 30%);
  color: hsl(187, 66%, 30%);
  background: white;
  box-shadow: hsla(0, 0%, 0%, 0.15) 1.95px 1.95px 2.6px;
  font-size: 18px;
  border-radius: 10px;
}
.add-task-button:hover, .add-task-button:focus {
  background: hsl(0, 0%, 98%);
}
</style>