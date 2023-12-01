<template>
  <div class="container">
    <div class="category-list">
      <p>Add as many or as few as you want and move on to <nuxt-link to="/projects"><button class="continue">Projects</button></nuxt-link> when done</p>
      <br>
      <form @submit.prevent="addCategory">
        <label>Add a new Category</label>
        <input v-model="newCategory.name" />
        <button type="submit" :disabled="!newCategory.name || newCategory.name.trim().length === 0">Add</button>
      </form>
      <ul>
        <li v-for="categoryId in Object.keys(categoriesData)" :key="categoryId">
          <div class="category-name">
            {{ categoriesData[categoryId].name }}
          </div>
          <button @click="removeCategory(categoryId)">
            Remove
          </button>
        </li>
      </ul>
    </div>
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
    ...mapState({ categoriesData: state => state.categories.categoriesData })
  },

  methods: {
    addCategory () {
      this.$store.dispatch('categories/addCategory', { name: this.newCategory.name })
      this.newCategory = {  name: '' }
    },
    removeCategory (categoryId) {
      this.$store.dispatch('categories/removeCategory', categoryId)
    },
  }
}
</script>

<style scoped>
  .container {
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    border-radius: 20px;
    margin-bottom: 30px;
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
