export default async ({ store }) => {
  await store.dispatch('categories/getCategoryData');
  await store.dispatch('projects/getPrioritiesData')
  await store.dispatch('tasks/getActiveTasks')
  await store.dispatch('tasks/getQueuedTasks')
}
