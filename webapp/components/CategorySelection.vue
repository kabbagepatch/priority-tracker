<template>
  <div class="container">
    <p>Let's start by adding categories for your tasks</p>
    <p>Add as many or as few as you want in any order. We will prioritise these next</p>
    <br />
    <form @submit.prevent="addCategory">
      <label>Add a new Category</label>
      <input v-model="newCategory.name"></input>
    </form>
    <ul>
      <li v-for="category in categories" :key="category.id">
        <div class="category-name">{{ category.name }}</div>
        <button @click="categories.splice(categories.findIndex(c => c.id === category.id), 1)">Remove</button>
      </li>
    </ul>
  </div>
</template>

<script>
export default {
  name: 'CategorySelection',
  data () {
    return {
      categories: [
        { id: 1, name: 'Cat 1' },
        { id: 2, name: 'Cat 2' }
      ],
      newCategory: {
        name: ''
      }
    }
  },
  methods: {
    addCategory () {
      this.categories.push({ id: 4, name: this.newCategory.name })
    }
  }
}
</script>

<style scoped>
  .container {
    min-height: 500px;
    min-width: 400px;
    display: flex;
    flex-direction: column;
    justify-content: flex-start;
    border: 1px solid #33333333;
    padding: 30px 50px;
  }
  ul {
    list-style-type: none;
    padding-top: 20px;
    padding-left: 0;
  }
  li {
    width: 100%;
    padding: 5px;
    display: flex;
    justify-content: space-between;
  }
  .category-name {
    margin: 0 20px;
  }
</style>
