<template>
  <div>
    <h1>Priorities</h1>
    <div>Now it is time to prioritise projects</div>
    <div>Select up to five projects to mark as actively being worked on. You will only be adding tasks for these projects</div>
    <br />
    <p>Hit <nuxt-link to="/tasks"><button class="continue">Continue</button></nuxt-link> when you're done with prioritising projects</p>
    <div v-for="project in prioritiesData" :key="project.id">
      <div class="project-row">
        <div>
          <h3 class="project-name">
            {{ project.name }}
          </h3>
          <div v-if="categoryData.length > 0" class="project-category">
            {{ categoryData.filter(c => c.id === project.category)[0].name }}
          </div>
        </div>
        <div>
          <button @click="deprioritiseProject(project.id)">
            Unselect
          </button>
        </div>
      </div>
    </div>
    <hr v-if="prioritiesData.length > 0" />
    <div v-for="project in unprioritisedProjects" :key="project.id">
      <div class="project-row">
        <div>
          <h3 class="project-name">
            {{ project.name }}
          </h3>
          <div v-if="categoryData.length > 0" class="project-category">
            {{ categoryData.filter(c => c.id === project.category)[0].name }}
          </div>
        </div>
        <div>
          <button
            :disabled="prioritiesData.length >= 5"
            @click="() => prioritiseProject(project.id)"
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
    ...mapState([
      'prioritiesData',
      'projectData',
      'categoryData'
    ]),
    ...mapGetters(['unprioritisedProjects'])
  },
  mounted () {
    this.$store.dispatch('getProjectData')
    this.$store.dispatch('getPrioritiesData')
  },
  methods: {
    prioritiseProject (id) {
      this.$store.dispatch('prioritiseProject', id)
    },
    deprioritiseProject (id) {
      this.$store.dispatch('deprioritiseProject', id)
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