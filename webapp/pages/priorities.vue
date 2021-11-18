<template>
  <div>
    <h1>Priorities</h1>
    <div>Now it is time to prioritise projects</div>
    <div>Select up to five projects to mark as actively being worked on. You will only be adding tasks for these projects</div>
    <br />
    <p>Hit <nuxt-link to="/"><button class="continue">Continue</button></nuxt-link> when you're done with prioritising projects</p>
    <div v-for="projectId in Object.keys(prioritiesData)" :key="projectId">
      <div class="project-row">
        <div>
          <h3 class="project-name">
            {{ prioritiesData[projectId].name }}
          </h3>
          <div v-if="categoriesData && categoriesData[prioritiesData[projectId].category]" class="project-category">
            {{ categoriesData[prioritiesData[projectId].category].name }}
          </div>
        </div>
        <div>
          <button @click="deprioritiseProject(prioritiesData[projectId].id)">
            Unselect
          </button>
        </div>
      </div>
    </div>
    <hr v-if="prioritiesData && Object.keys(prioritiesData).length > 0" />
    <div v-for="projectId in Object.keys(unprioritisedProjects)" :key="projectId">
      <div class="project-row">
        <div>
          <h3 class="project-name">
            {{ unprioritisedProjects[projectId].name }}
          </h3>
          <div v-if="categoriesData && categoriesData[unprioritisedProjects[projectId].category]" class="project-category">
            {{ categoriesData[unprioritisedProjects[projectId].category].name }}
          </div>
        </div>
        <div>
          <button
            :disabled="Object.keys(prioritiesData).length >= 5"
            @click="() => prioritiseProject(unprioritisedProjects[projectId].id)"
          >
            Select
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapState, mapGetters } from 'vuex';

export default {
  computed: {
    ...mapState({
      categoriesData: state => state.categories.categoriesData,
      projectData: state => state.projects.projectData,
      prioritiesData: state => state.projects.prioritiesData,
    }),
    ...mapGetters('projects', ['unprioritisedProjects'])
  },
  mounted () {
    this.$store.dispatch('categories/getCategoryData');
    this.$store.dispatch('projects/getProjectData')
    this.$store.dispatch('projects/getPrioritiesData')
  },
  methods: {
    prioritiseProject (id) {
      this.$store.dispatch('projects/prioritiseProject', id)
    },
    deprioritiseProject (id) {
      this.$store.dispatch('projects/deprioritiseProject', id)
    }
  }
};
</script>

<style scoped>

.project-row {
  width: 100%;
  display: flex;
  justify-content: space-between;
  margin: 10px 0;
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