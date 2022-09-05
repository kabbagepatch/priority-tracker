<template>
  <div>
    <h1>Projects</h1>
    <div class="project-form-container">
      <card>
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
      </card>
    </div>
    <p>Go to <nuxt-link to="/priorities"><button class="continue">Priorities</button></nuxt-link> when you're done with adding projects</p>
    <br />
    <div class="project-list">
      <card v-for="projectId in Object.keys(projectData).sort((a, b) => projectData[b].createdAt - projectData[a].createdAt)" :key="projectId">
        <div class="project-row">
          <div>
            <h3 class="project-name">
              {{ projectData[projectId].name }}
            </h3>
            <div v-if="categoriesData && categoriesData[projectData[projectId].category]" class="project-category">
              {{ categoriesData[projectData[projectId].category].name }}
            </div>
          </div>
          <div class="buttons">
            <button @click="updateProject(projectId)">
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
      </card>
    </div>
  </div>
</template>

<script>
import { mapState } from 'vuex'
import Card from '../components/Card.vue'

export default {
  name: 'Projects',
  components: { Card },
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
    updateProject (id) {
      this.curProject = { ...this.projectData[id] };
      this.formState = 'Update';
      window.scrollTo(0, 0);
    },
    removeProject (id) {
      this.$store.dispatch('projects/removeProject', id)
    }
  }
}
</script>

<style scoped>
.project-form-container {
  margin: 10px 0 20px 0
}

.project-form {
  display: flex;
  flex-direction: column;
}

p {
  padding: 0 10px;
}

.add-project {
  margin: 20px 0 10px 0;
}
.project-row {
  width: 100%;
  display: flex;
  justify-content: space-between;
  margin-bottom: 5px;
}
.buttons {
  min-width: 150px;
  margin-left: 10px;
}
.project-name {
  font-size: 1.2em;
  margin-bottom: 5px;
}
.project-category {
  font-size: 0.8em;
  font-weight: bold;
  text-transform: uppercase;
}
</style>
