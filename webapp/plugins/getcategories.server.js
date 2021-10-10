export default async ({ store }) => {
  await store.dispatch('categories/getCategoryData')
}
