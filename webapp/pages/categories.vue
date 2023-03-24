<template>
  <div class="container">
    <div class="home-header">
      <Logo />
      <div>
        <h1 class="title">
          priority-tracker
        </h1>
      </div>
    </div>
    <CategorySelection />
  </div>
</template>

<script>
export default {
  created () {
    this.$store.dispatch('categories/getCategoryData');
  },
}
</script>

<style scoped>
.container {
  margin: 0 auto;
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  background: var(--secondary-color);
}

.home-header {
  display: flex;
  padding-bottom: 20px;
}

.title {
  padding: 0 20px;
  font-size: 50px;
  color: var(---text-dark);
  font-family: 'Homemade Apple';
  text-shadow: 4px 4px 3px hsl(292deg 38% 52%);
}
</style>
