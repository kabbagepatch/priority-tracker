<template>
  <div class="categories-container">
    <title-card title="Categories">
      <form @submit.prevent="addCategory">
        <label class="form-content">Add a new Category</label>
        <input class="form-content" v-model="newCategory.name" />
        <button class="form-content" type="submit" :disabled="!newCategory.name || newCategory.name.trim().length === 0">Add</button>
      </form>
      <p>Add as many or as few as you want and move on to <nuxt-link to="/projects"><button class="continue">Projects</button></nuxt-link> when done</p>
    </title-card>
    <card>
      <ul>
        <li v-for="categoryId in Object.keys(categoriesData)" :key="categoryId">
          <div class="category-name">
            <input
              :style="{ border: categoriesData[categoryId].color ? 'none' : '1px solid black', background: categoriesData[categoryId].color || '' }"
              class="color-picker"
              type="thumbnail"
              :value="categoriesData[categoryId].color"
              data-coloris
              @change="(event) => onChangeColor(categoryId, event.target.value)"
            />
            <span>{{ categoriesData[categoryId].name }}</span>
          </div>
          <button @click="removeCategory(categoryId)">
            Remove
          </button>
        </li>
      </ul>
    </card>
  </div>
</template>

<script>
import { mapState } from 'vuex'

import TitleCard from '../components/TitleCard.vue';
import Card from '../components/Card.vue';

export default {
  components: { TitleCard, Card },
  data () {
    return {
      newCategory: {
        name: ''
      },
    }
  },
  created () {
    this.$store.dispatch('categories/getCategoryData');
  },
  computed: {
    ...mapState({
      categoriesData: state => state.categories.categoriesData,
    })
  },
  methods: {
    addCategory () {
      const randomColor = '#' + Math.floor(Math.random()*16777215).toString(16).padStart(6, '0');
      this.$store.dispatch('categories/addCategory', { name: this.newCategory.name, color: randomColor })
      this.newCategory = {  name: '' }
    },
    removeCategory (categoryId) {
      this.$store.dispatch('categories/removeCategory', categoryId)
    },
    onChangeColor (categoryId, color) {
      this.$store.dispatch('categories/updateCategory', { categoryId, color })
    }
  },
}
</script>

<style scoped>
form {
  width: 100%;
  margin-bottom: 20px;
  display: flex;
  align-items: center;
  width: 100%;
}

input.form-content {
  flex: 1;
  margin: 0 10px;
  max-width: 600px;
}

.category-name {
  display: flex;
  align-items: center;
}

.color-picker {
  width: 30px;
  height: 30px;
  border-radius: 50%;
  padding: 0;
  margin-right: 10px;
  color: transparent;
}

@media (max-width: 600px) {
  form {
    flex-direction: column;
  }

  .form-content {
    width: 100%;
  }

  input.form-content {
    margin: 10px 0 15px 0;
  }
}

ul {
  list-style-type: none;
  padding-left: 0;
}

li {
  width: 100%;
  padding: 5px;
  display: flex;
  justify-content: space-between;
}
</style>
