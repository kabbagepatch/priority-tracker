<template>
  <div>
    <h1>Projects</h1>
    <div>
      <p>Now that you've added categories, it's time to add projects within those categories</p>
      <p>Add as many as you like in any order. We shall prioritise these next</p>
    </div>
    <br />
    <p>Hit <nuxt-link to="/priorities"><button class="continue">Continue</button></nuxt-link> when you're done with adding projects</p>
    <div>
      <form class="project-form" @submit.prevent="submitProject">
        <label class="label" for="input">Give your project a title</label>
        <input type="text" v-model="curProject.name" />
        <label class="label" for="input">Describe the project</label>
        <input type="text" v-model="curProject.description" />
        <label class="label" for="select">Select Category for the project</label>
        <select v-model="curProject.category" name="category" id="category">
          <option value>Please select a category</option>
          <option v-for="option in categoryData" :key="option.id" :value="option.id">
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
      <div class="project-data" v-for="project in projectData" :key="project.id">
        <div class="project-row">
          <div>
            <h3 class="project-name">
              {{ project.name }}
            </h3>
            <div class="project-category">
              {{ categoryData.filter(c => c.id === project.category)[0].name }}
            </div>
          </div>
          <div>
            <button @click="() => { curProject = { ...project }; formState = 'Update' }">
              Edit
            </button>
            <button @click="removeProject(project.id)">
              Remove
            </button>
          </div>
        </div>
        <div class="project-description">
          {{ project.description }}
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
    ...mapState(['projectData', 'categoryData'])
  },
  mounted () {
    this.$store.dispatch('getProjectData')
  },
  methods: {
    submitProject () {
      this.$store.dispatch('submitProject', this.curProject)
      this.formState = 'Add'
      this.curProject = {
        name: '',
        description: '',
        category: ''
      }
    },
    removeProject (id) {
      this.$store.dispatch('removeProject', id)
    }
  }
}
</script>

<style scoped>
.project-form {
  display: flex;
  flex-direction: column;
  margin: 20px 0;
  width: 500px;
}
.add-project {
  margin: 10px 0;
}
.project-data {
  padding: 5px;
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
