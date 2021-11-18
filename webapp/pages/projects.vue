<template>
  <div>
    <h1>Projects</h1>
    <div>
      <p>Now that you've added categories, it's time to add projects within those categories</p>
      <p>Add as many as you like in any order. We shall prioritise these next</p>
    </div>
    <br />
    <p>Hit <nuxt-link to="/priorities"><button class="continue">Continue</button></nuxt-link> when you're done with adding projects</p>
    <div class="project-form-container">
      <form class="project-form" @submit.prevent="submitProject">
        <label class="label" for="input">Give your project a title</label>
        <input type="text" v-model="curProject.name" />
        <label class="label" for="input">Describe the project</label>
        <input type="text" v-model="curProject.description" />
        <label class="label" for="select">Select Category for the project</label>
        <select v-model="curProject.category" name="category" id="category">
          <option value>Please select a category</option>
          <option v-for="option in categoriesData" :key="option.id" :value="option.id">
            {{ option.name }}
          </option>
        </select>
        <div class="add-project">
          <button type="submit">{{ formState }}</button>
          <button type="reset" @click="() => { formState = 'Add' }">Clear</button>
        </div>
      </form>
    </div>
    <div class="project-list">
      <div class="project-data" v-for="projectId in Object.keys(projectData).sort((a, b) => projectData[b].createdAt - projectData[a].createdAt)" :key="projectId">
        <div class="project-row">
          <div>
            <h3 class="project-name">
              {{ projectData[projectId].name }}
            </h3>
            <div v-if="categoriesData && categoriesData[projectData[projectId].category]" class="project-category">
              {{ categoriesData[projectData[projectId].category].name }}
            </div>
          </div>
          <div>
            <button @click="() => { curProject = { ...projectData[projectId] }; formState = 'Update' }">
              Edit
            </button>
            <button @click="removeProject(projectId)">
              Remove
            </button>
          </div>
        </div>
        <div v-if="projectData[projectId].description" class="project-description">
          {{ projectData[projectId].description }}
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapState } from 'vuex'

export default {
  name: 'Projects',
  data () {
    return {
      curProject: {
        name: '',
        description: '',
        category: ''
      },
      formState: 'Add'
    }
  },
  computed: {
    ...mapState({
      categoriesData: state => state.categories.categoriesData,
      projectData: state => state.projects.projectData,
    })
  },
  mounted () {
    this.$store.dispatch('categories/getCategoryData');
    this.$store.dispatch('projects/getProjectData')
  },
  methods: {
    submitProject () {
      this.$store.dispatch('projects/submitProject', this.curProject)
      this.formState = 'Add'
      this.curProject = {
        name: '',
        description: '',
        category: ''
      }
    },
    removeProject (id) {
      this.$store.dispatch('projects/removeProject', id)
    }
  }
}
</script>

<style scoped>
.project-form-container {
  border-bottom: 1px solid #33333399;
  margin-bottom: 20px;
}
.project-form {
  border-top: 1px solid #33333333;
  display: flex;
  flex-direction: column;
  margin-top: 20px;
  margin-bottom: 10px;
}
.add-project {
  margin: 20px 0 10px 0;
}
.project-data {
  padding: 5px;
  border-bottom: 1px solid #33333333;
  padding-bottom: 10px;
  margin-bottom: 10px;
}
.project-row {
  width: 100%;
  display: flex;
  justify-content: space-between;
  margin-bottom: 5px;
}
.project-name {
  font-size: 1.2em;
}
.project-category {
  font-size: 0.8em;
  font-weight: bold;
  text-transform: uppercase;
}
</style>
