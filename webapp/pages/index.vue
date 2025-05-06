<template>
  <main>
    <working-tasks
      v-if="!$nuxt.$route.hash || $nuxt.$route.hash.includes('active')"
      title="Active"
      status="active"
      :showAddButton="!$nuxt.$route.hash || $nuxt.$route.hash.includes('active')"
    />
    <br v-if="!$nuxt.$route.hash" />
    <working-tasks
      v-if="!$nuxt.$route.hash || $nuxt.$route.hash.includes('next')"
      title="Up Next"
      status="queued"
    />
    <br v-if="!$nuxt.$route.hash" />
    <working-tasks
      v-if="!$nuxt.$route.hash || $nuxt.$route.hash.includes('paused')"
      title="Paused"
      status="paused"
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
import WorkingTasks from '@/components/Tasks/WorkingTasks.vue';
import BacklogTasks from '@/components/Tasks/BacklogTasks.vue';
import AddTaskButton from '@/components/Tasks/AddTaskButton.vue';

export default {
  components: {
    WorkingTasks,
    AddTaskButton,
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
