<template>
  <div>
    <div
      role="button"
      tabindex="0"
      aria-label="toggle task form"
      @click="toggleTaskForm"
      :class="`task ${delayedShowTaskForm ? 'task-form-open' : ''} ${showTaskForm ? 'task-form-border-zero' : ''}`"
    >
      <div class="task-with-handle">
        <div class="handle-container"><v-icon name="grip-vertical" width="10" height="16" class="handle" /></div>
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
      </div>
      <div class="buttons">
        <button
          v-if="moveButtonText"
          :aria-label="moveButtonText"
          :title="moveButtonText"
          class="secondary icon-only"
          @click="(e) => { e.stopPropagation(); onMoveButtonClick(); }"
        >
          <v-icon name="angle-double-up"/>
        </button>
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
          class="secondary icon-only open-task"
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
    moveButtonText: {
      type: String,
      default: null,
    },
    onMoveButtonClick: {
      type: Function,
      default: () => undefined,
    },
    toggleTaskFormOuter: {
      type: Function,
      default: () => undefined,
    },
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
      this.toggleTaskFormOuter()
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
  margin-top: 30px;
  background: var(--white);
  padding: 15px 20px;
  box-shadow: var(--black-transparent) 2.95px 2.95px 3.6px, var(--dark-blue-transparenter) 0px 0px 2px 3px;
  cursor: pointer;
  transition: background ease 0.25s, box-shadow ease 0.5s;
  border-radius: 15px;
}

.task:hover {
  transition: background ease 0.25s, box-shadow ease 0.25s;
  background: var(--secondary-color-light);
  box-shadow: var(--black-transparent) 2.95px 2.95px 3.6px, var(--dark-blue-transparent) 0px 0px 2px 3px;
}

.task-with-handle {
  display: flex;
  align-items: center;
}

.handle-container {
  margin-right: 20px;
}

.task-form-open {
  margin-bottom: 2px;
  box-shadow: var(--black-transparent) 0.95px 0.95px 1.6px, var(--dark-blue-transparenter) 0px 0px 1px 2px;
}

.task-form-border-zero {
  border-bottom-left-radius: 0;
  border-bottom-right-radius: 0;
}

.task-info {
  min-width: 200px;
  overflow: auto;
}

@media (max-width: 400px) {
  .task-info {
    min-width: 180px;
  }

  button.open-task {
    display: none;
  }
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
  color: var(--primary-color);
  text-decoration: underline solid var(--primary-color-transparent);
}

.task-name-link:hover {
  color: var(--primary-color-light);
}
</style>