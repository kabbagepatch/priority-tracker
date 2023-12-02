<template>
  <main>
    <active-tasks
      v-if="!$nuxt.$route.hash || $nuxt.$route.hash.includes('active')"
      :showAddButton="!$nuxt.$route.hash || $nuxt.$route.hash.includes('active')"
    />
    <br v-if="!$nuxt.$route.hash" />
    <queued-tasks
      v-if="!$nuxt.$route.hash || $nuxt.$route.hash.includes('next')"
    />
    <br v-if="!$nuxt.$route.hash" />
    <div
      v-if="!$nuxt.$route.hash || $nuxt.$route.hash.includes('backlog')"
    >
      <backlog-tasks />
    </div>
    <add-task-button v-if="$nuxt.$route.hash && !$nuxt.$route.hash.includes('active')" />
  </main>
</template>

<script>
import ActiveTasks from '@/components/Tasks/ActiveTasks.vue';
import QueuedTasks from '@/components/Tasks/QueuedTasks.vue';
import BacklogTasks from '@/components/Tasks/BacklogTasks.vue';
import AddTaskButton from '@/components/Tasks/AddTaskButton.vue';

export default {
  components: {
    AddTaskButton,
    ActiveTasks,
    QueuedTasks,
    BacklogTasks,
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
}
</script>

<style scoped>
</style>
