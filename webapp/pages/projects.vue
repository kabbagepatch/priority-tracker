<template>
  <div class="projects-container">
    <title-card title="Projects">
      <form class="project-form" @submit.prevent="updateProject">
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
        <div v-if="!disableAddAsPriority" class="checkbox">
          <input type="checkbox" v-model="addAsPriority" />
          Add As Priority
        </div>
        <div class="add-project">
          <button :disabled="cannotSubmit" type="submit">{{ formState }}</button>
          <button class="secondary outlined" type="reset" @click="() => { formState = 'Add' }">Clear</button>
        </div>
      </form>
      <p>Go to <nuxt-link to="/priorities"><button class="continue">Priorities</button></nuxt-link> when you're done with adding projects</p>
    </title-card>
    <div class="project-list">
      <draggable v-model="projectsDisplayedModel" v-bind="dragOptions" @start="drag=true" @end="onDragEnd" handle=".handle">
        <transition-group type="transition" :name="!drag ? 'flip-list' : null">
          <card v-for="project in projectsDisplayed" :key="project.id">
            <div class="project-with-handle">
              <div class="handle-container"><v-icon name="grip-vertical" width="10" height="16" class="handle" /></div>
              <div class="project-row">
                <div>
                  <h3 class="project-name">
                    {{ project.name }}
                  </h3>
                  <div
                    v-if="categoriesData && categoriesData[project.category]"
                    class="project-category"
                  >
                    <category-pill :color="categoriesData[project.category].color">
                      {{ categoriesData[project.category].name }}
                    </category-pill>
                  </div>
                </div>
                <div class="buttons">
                  <button
                    class="secondary icon-only complete"
                    aria-label="Mark Project as Complete"
                    @click="completeProject(project.id)"
                  >
                    <v-icon name="check"/>
                  </button>
                  <button
                    class="secondary icon-only"
                    aria-label="Update Project"
                    @click="onUpdateProject(project.id)"
                  >
                    <v-icon name="edit"/>
                  </button>
                  <button
                    class="secondary icon-only delete"
                    aria-label="Delete Project"
                    @click="removeProject(project.id)"
                  >
                    <v-icon name="trash"/>
                  </button>
                </div>
              </div>
            </div>
            <div v-if="project.description" class="project-description" v-html="linkifyHtml(project.description)" />
          </card>
        </transition-group>
      </draggable>
    </div>
  </div>
</template>

<script>
import { mapState } from 'vuex'
import linkifyHtml from 'linkify-html';
import Draggable from 'vuedraggable'
import TitleCard from '../components/TitleCard.vue';
import Card from '../components/Card.vue'
import CategoryPill from '../components/CategoryPill.vue'

export default {
  name: 'Projects',
  components: { TitleCard, Card, CategoryPill, Draggable },
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
      drag: false,
      addAsPriority: false,
    }
  },
  computed: {
    ...mapState({
      categoriesData: state => state.categories.categoriesData,
      projectData: state => state.projects.projectData,
      prioritiesData: state => state.projects.prioritiesData,
    }),
    cannotSubmit() {
      return !this.curProject.name || this.curProject.name.trim === '' || !this.curProject.category || this.curProject.category.trim === ''
    },
    disableAddAsPriority() {
      return (this.prioritiesData && Object.keys(this.prioritiesData).length >= 5);
    },
    dragOptions() {
      return {
        animation: 200,
        group: 'Projects',
        ghostClass: "ghost"
      };
    },
    projectsDisplayedModel: {
      get() {
        this.projectsDisplayed = this.projectData ? Object.keys(this.projectData).map(id => this.projectData[id]) : [];
        return this.projectsDisplayed.sort((a, b) => (b.order || b.createdAt) - (a.order || a.createdAt));
      },
      set(value) {
        this.projectsDisplayed = value;
      }
    }
  },
  watch: { 
    projectData: function(newProjectData) {
      this.projectsDisplayed = newProjectData ? Object.keys(newProjectData).map(id => newProjectData[id]) : [];
      this.projectsDisplayed = this.projectsDisplayed.sort((a, b) => (b.order || b.createdAt) - (a.order || a.createdAt));
    }
  },
  mounted () {
    this.$store.dispatch('categories/getCategoryData');
    this.$store.dispatch('projects/getProjectData')
    this.$store.dispatch('projects/getPrioritiesData')
  },
  methods: {
    linkifyHtml(a) {
      return linkifyHtml(a, { target: '_blank' });
    },
    onNameBlur() {
      this.errors.name = !this.curProject.name || this.curProject.name.trim() === '';
    },
    onCategoryBlur() {
      this.errors.category = !this.curProject.category || this.curProject.category.trim() === '';
    },
    updateProject () {
      if (this.cannotSubmit) return;
      this.$store.dispatch('projects/updateProject', { ... this.curProject, addAsPriority: this.addAsPriority });
      this.addAsPriority = false;
      this.formState = 'Add'
      this.curProject = {
        name: '',
        description: '',
        category: ''
      }
    },
    completeProject (id) {
      this.$store.dispatch('projects/updateProject', { id, complete: true });
      this.formState = 'Add'
      this.curProject = {
        name: '',
        description: '',
        category: ''
      }
    },
    onUpdateProject (id) {
      this.curProject = { ...this.projectData[id] };
      this.formState = 'Update';
      window.scrollTo(0, 0);
    },
    removeProject (id) {
      if (confirm('Are you sure you want to delete this project?')) {
        this.$store.dispatch('projects/removeProject', id);
      }
    },
    onDragEnd (e) {
      const projects = Object.keys(this.projectData).map(id => this.projectData[id]).sort((a, b) => (b.order || b.createdAt) - (a.order || a.createdAt));
      this.drag = false
      const curIndex = e.oldIndex;
      const newIndex = e.newIndex;
      const curProject = projects[curIndex];
      let newOrder;
      const existingProjectOrder = projects[newIndex].order || projects[newIndex].createdAt;
      if (newIndex > curIndex) {
        newOrder = existingProjectOrder - 1;
      } else {
        newOrder = existingProjectOrder + 1;
      }

      this.$store.dispatch('projects/updateProject', { ...curProject, order: newOrder });
    },
  }
}
</script>

<style scoped>
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

.checkbox {
  margin-top: 10px;
  font-size: 15px;
  align-items: center;
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

.project-with-handle {
  display: flex;
  align-items: center;
}

.handle-container {
  margin-right: 20px;
  cursor: pointer;
}

.project-description {
  margin: 10px 0 0 30px;
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
