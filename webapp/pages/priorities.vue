<template>
  <div class="priorities-container">
    <h2>Priorities</h2>
    <div class="info">
      <p>Select up to five projects to mark as actively being worked on. You will only be adding tasks for these projects</p>
      <p>Go to <nuxt-link to="/"><button class="continue">Tasks</button></nuxt-link> when you're done with prioritising projects</p>
    </div>
    <div class="project" v-for="projectId in Object.keys(prioritiesData).sort((a, b) => prioritiesData[b].updatedAt - prioritiesData[a].updatedAt)" :key="projectId">
      <card class="project-row">
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
      </card>
    </div>
    <hr class="hr" v-if="prioritiesData && Object.keys(prioritiesData).length > 0" />
    <div v-for="projectId in Object.keys(unprioritisedProjects).sort((a, b) => unprioritisedProjects[b].updatedAt - unprioritisedProjects[a].updatedAt)" :key="projectId">
      <card class="project-row">
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
      </card>
    </div>
  </div>
</template>

<script>
import { mapState, mapGetters } from 'vuex';
import Card from '../components/Card.vue';

export default {
  components: { Card },
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
h2 {
  border-radius: 20px;
  border-bottom-left-radius: 0;
  border-bottom-right-radius: 0;
  margin-bottom: -5px;
}

.info {
  background: var(--white);
  border-bottom-left-radius: 20px;
  border-bottom-right-radius: 20px;
  padding: 10px 0;
  margin-bottom: 10px;
}

p {
  padding-left: 20px;
}

.project {
  margin: 25px 0;
}

.project-row {
  width: 100%;
  display: flex;
  justify-content: space-between;
}

.project-name {
  font-size: 1.2em;
}

.hr {
  margin: 20px 0;
}

.project-category {
  font-size: 0.8em;
  font-weight: bold;
  text-transform: uppercase;
}
</style>