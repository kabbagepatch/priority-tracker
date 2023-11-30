<template>
  <div class="projects-container">
    <h2>Projects</h2>
    <div class="project-form-container">
      <form class="project-form" @submit.prevent="submitProject">
        <label :class="`label ${errors.name ? 'error' : ''}`" for="input">Give your project a title</label>
        <input :class="errors.name ? 'error' : ''" type="text" v-model="curProject.name" @blur="onNameBlur" />
        <label class="label" for="input">Describe the project</label>
        <input type="text" v-model="curProject.description" />
        <label :class="`label ${errors.category ? 'error' : ''}`" for="select">Select Category for the project</label>
        <select :class="errors.category ? 'error' : ''" v-model="curProject.category" name="category" id="category" @blur="onCategoryBlur">
          <option value>Please select a category</option>
          <option v-for="option in categoriesData" :key="option.id" :value="option.id">
            {{ option.name }}
          </option>
        </select>
        <div class="add-project">
          <button :disabled="cannotSubmit" type="submit">{{ formState }}</button>
          <button class="secondary outlined" type="reset" @click="() => { formState = 'Add' }">Clear</button>
        </div>
      </form>
      <p>Go to <nuxt-link to="/priorities"><button class="continue">Priorities</button></nuxt-link> when you're done with adding projects</p>
    </div>
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
            <button
              class="secondary icon-only complete"
              aria-label="Mark Project as Complete"
              @click="completeProject(projectId)"
            >
              <v-icon name="check"/>
            </button>
            <button
              class="secondary icon-only"
              aria-label="Update Project"
              @click="updateProject(projectId)"
            >
              <v-icon name="edit"/>
            </button>
            <button
              class="secondary icon-only delete"
              aria-label="Delete Project"
              @click="removeProject(projectId)"
            >
              <v-icon name="trash"/>
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
      formState: 'Add',
      errors: {
        name: false,
        category: false,
      },
    }
  },
  computed: {
    ...mapState({
      categoriesData: state => state.categories.categoriesData,
      projectData: state => state.projects.projectData,
    }),
    cannotSubmit() {
      return !this.curProject.name || this.curProject.name.trim === '' || !this.curProject.category || this.curProject.category.trim === ''
    }
  },
  mounted () {
    this.$store.dispatch('categories/getCategoryData');
    this.$store.dispatch('projects/getProjectData')
  },
  methods: {
    onNameBlur() {
      this.errors.name = !this.curProject.name || this.curProject.name.trim() === '';
    },
    onCategoryBlur() {
      this.errors.category = !this.curProject.category || this.curProject.category.trim() === '';
    },
    submitProject () {
      if (this.cannotSubmit) return;
      this.$store.dispatch('projects/submitProject', this.curProject);
      this.formState = 'Add'
      this.curProject = {
        name: '',
        description: '',
        category: ''
      }
    },
    completeProject (id) {
      this.$store.dispatch('projects/submitProject', { id, complete: true });
      this.formState = 'Add'
      this.curProject = {
        name: '',
        description: '',
        category: ''
      }
    },
    updateProject (id) {
      if (this.cannotSubmit) return;
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
h2 {
  border-radius: 20px;
  border-bottom-left-radius: 0;
  border-bottom-right-radius: 0;
  margin-bottom: -5px;
}

.project-form-container {
  background: var(--white);
  border-bottom-left-radius: 20px;
  border-bottom-right-radius: 20px;
  padding: 20px;
  margin-bottom: 25px;
}

.project-form {
  display: flex;
  flex-direction: column;
}

label.error {
  color: var(--danger-color);
}

input.error {
  border: 1px solid var(--danger-color);
}

p {
  padding-top: 10px;
}

.add-project {
  margin: 20px 0 10px 0;
}

.card {
  margin-bottom: 25px;
}

.project-row {
  width: 100%;
  display: flex;
  justify-content: space-between;
}

.buttons {
  min-width: 140px;
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
