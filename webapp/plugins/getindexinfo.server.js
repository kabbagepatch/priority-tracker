export default async ({ store }) => {
  await store.dispatch('categories/getCategoryData');
  await store.dispatch('projects/getPrioritiesData');
  await store.dispatch('tasks/getTaskByStatus', { status: 'active' });
  await store.dispatch('tasks/getTaskByStatus', { status: 'queued' });
}
