<template>
  <div>
    <div
      role="button"
      tabindex="0"
      aria-label="toggle task form"
      @click="toggleTaskForm"
      :class="`task ${delayedShowTaskForm ? 'task-form-open' : ''}`"
    >
      <div class="task-info">
        <h4 :class="task.complete ? 'complete-task' : ''">
          <a class="task-name task-name-link" v-if="task.link" :href="task.link" target="_blank" @click="(e) => e.stopPropagation()">
            {{ task.name }}
          </a>
          <span class="task-name" v-else>{{ task.name }}</span>
        </h4>
        <div v-if="prioritiesData[task.project]" class="subTitle">
          {{ prioritiesData[task.project].name }}
        </div>
        <div v-else-if="categoriesData[task.category]" class="subTitle">
          {{ categoriesData[task.category].name }}
        </div>
      </div>
      <div class="buttons">
        <button
          aria-label="Mark Task as Complete"
          title="Mark Task as Complete"
          class="secondary icon-only complete"
          @click="completeTask"
        >
          <v-icon name="check"/>
        </button>
        <button
          aria-label="Expand task"
          title="Expand task"
          class="secondary icon-only"
          @click="toggleTaskForm"
        >
          <v-icon name="chevron-down"/>
        </button>
      </div>
    </div>
    <collapsible
      :collapse="!showTaskForm"
      :ref="'task-form-' + task.id"
    >
      <task-form
        :selectedTask="{ ...task }"
        :onCancelClick="() => { showTaskForm = false }"
      />
    </collapsible>
  </div>
</template>

<script>
import { mapState } from 'vuex';
import TaskForm from './TaskForm.vue';
import Collapsible from '../Collapsible.vue';

export default {
  props: {
    task: {},
  },

  components: { TaskForm, Collapsible },

  data() {
    return {
      showTaskForm: false,
      delayedShowTaskForm: false,
    };
  },

  computed: {
    ...mapState({
      categoriesData: state => state.categories.categoriesData,
      prioritiesData: state => state.projects.prioritiesData,
    }),
  },

  methods: {
    toggleTaskForm(e) {
      e.stopPropagation();
      this.showTaskForm = !this.showTaskForm;
      if (this.delayedShowTaskForm) {
        setTimeout(() => {
          this.delayedShowTaskForm = false;
        }, 500);
      } else {
        this.delayedShowTaskForm = true;
      }
    },
    completeTask (e) {
      e.stopPropagation();
      this.$store.dispatch('tasks/updateTaskStatus', { id: this.task.id, status: 'complete', value: true });
    },
  },
}
</script>

<style scoped>
.task {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin: 0;
  margin-top: 15px;
  background: var(--white);
  padding: 15px 20px;
  box-shadow: var(--black-transparent) 1.95px 1.95px 2.6px, var(--dark-blue-transparenter) 0px 0px 0px 2px;
  border-radius: 10px;
  cursor: pointer;
  transition: background ease 0.25s, box-shadow ease 0.5s;
}

.task:hover, .task:focus {
  transition: background ease 0.25s, box-shadow ease 0.25s;
  background: var(--very-light-grey);
  box-shadow: var(--dark-blue-transparent) 0px 4px 8px -2px, var(--dark-blue-transparenter) 0px 0px 0px 1px;
}

.task-form-open {
  border-bottom-left-radius: 0;
  border-bottom-right-radius: 0;
  margin-bottom: 2px;
}

.task-info {
  min-width: 200px;
  overflow: auto;
  margin-right: 20px;
}

.task-info * {
  font-weight: 600 !important;
}

.complete-task {
  text-decoration: line-through;
}

.buttons {
  text-align: right;
  min-width: 100px;
}

.subTitle {
  margin-top: 2px;
  font-size: 0.8em;
  font-weight: 600 !important;
  text-transform: uppercase;
}

.task-name {
  font-weight: 400;
}

.task-name-link {
  color: var(--primary-color-light);
  text-decoration: underline solid var(--primary-color-transparent);
}

.task-name-link:hover {
  color: var(--primary-color);
}
</style>