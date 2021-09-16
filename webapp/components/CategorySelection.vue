<template>
  <div class="container">
    <div class="category-list">
      <p>Let's start by quick-adding categories for your projects and tasks</p>
      <p>Add as many or as few as you want and hit continue when done</p>
      <br>
      <form @submit.prevent="addCategory">
        <label>Add a new Category</label>
        <input v-model="newCategory.name" />
      </form>
      <ul>
        <li v-for="category in categoryData" :key="category.id">
          <div class="category-name">
            {{ category.name }}
          </div>
          <button @click="categoryData.splice(categoryData.findIndex(c => c.id === category.id), 1)">
            Remove
          </button>
        </li>
      </ul>
    </div>
    <nuxt-link to="/projects"><button class="continue">Continue</button></nuxt-link>
  </div>
</template>

<script>
import { mapState } from 'vuex'

export default {
  name: 'CategorySelection',
  data () {
    return {
      newCategory: {
        name: ''
      }
    }
  },

  computed: {
    ...mapState(['categoryData'])
  },

  methods: {
    addCategory () {
      this.$store.dispatch('addCategory', { name: this.newCategory.name })
    }
  }
}
</script>

<style scoped>
  .container {
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    border: 1px solid #33333333;
    min-height: 500px;
    min-width: 400px;
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
