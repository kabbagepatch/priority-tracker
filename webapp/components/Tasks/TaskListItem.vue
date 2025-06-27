<template>
  <div>
    <div
      role="button"
      tabindex="0"
      aria-label="toggle task form"
      @click="toggleTaskForm"
      @contextmenu="openRightClickMenu"
      :class="`task ${delayedShowTaskForm ? 'task-form-open' : ''} ${showTaskForm ? 'task-form-border-zero' : ''}`"
    >
      <task-right-click-menu
        :task="task"
        :viewMenu="viewRightClickMenu"
        :top="rightClickMenuTop"
        :left="rightClickMenuLeft"
        :closeMenu="closeRightClickMenu"
        :updateTask="toggleTaskForm"
      />
      <div class="task-with-handle">
        <div class="handle-container"><v-icon name="grip-vertical" width="10" height="16" class="handle" /></div>
        <div class="task-info">
          <h4 :class="taskComplete ? 'complete-task' : ''">
            <a class="task-name task-name-link" v-if="task.link" :href="task.link" target="_blank" @click="(e) => e.stopPropagation()">
              {{ task.name }}
            </a>
            <span class="task-name" v-else>{{ task.name }}</span>
          </h4>
          <div v-if="prioritiesData[task.project]" class="subtitle" >
            <category-pill :color="categoriesData[task.category]?.color">
              {{ prioritiesData[task.project].name }}
            </category-pill>
          </div>
          <div v-else-if="categoriesData[task.category]" class="subtitle">
            <category-pill :color="categoriesData[task.category]?.color">
              {{ categoriesData[task.category].name }}
            </category-pill>
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
          v-if="this.taskComplete"
          aria-label="Unmark Task as Complete"
          title="Unmark Task as Complete"
          class="secondary icon-only complete"
          @click="completeTask"
        >
          <v-icon name="times"/>
        </button>
        <button
          v-else
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
import TaskRightClickMenu from './TaskRightClickMenu.vue';
import Collapsible from '../Collapsible.vue';
import CategoryPill from '../CategoryPill.vue'

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

  components: { TaskForm, TaskRightClickMenu, Collapsible, CategoryPill },

  data() {
    return {
      taskComplete : this.task.status === 'complete',
      prevStatus: '',
      showTaskForm: false,
      delayedShowTaskForm: false,
      viewRightClickMenu: false,
      rightClickMenuTop: '0px',
      rightClickMenuLeft: '0px',
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
      if (e) e.stopPropagation();
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
    completeTask(e) {
      e.stopPropagation();
      if (this.taskComplete) {
        if (this.prevStatus) {
          this.$store.dispatch('tasks/updateTaskStatus', { ...this.task, status: this.prevStatus });
          this.prevStatus = '';
          this.taskComplete = false;
        }
      } else {
        this.prevStatus = this.task.status;
        this.$store.dispatch('tasks/updateTaskStatus', { ...this.task, status: 'complete' });
        this.taskComplete = true;
      }
    },
    openRightClickMenu(e) {
      setTimeout(() => {
        this.viewRightClickMenu = true;
        this.$nextTick(() => {
          const scrollY = window.scrollY;
          this.$el.querySelector("#right-click-menu").focus();
          window.scroll(0, scrollY);
          this.setRightClickMenu(e.y, e.x, scrollY);
        });
      }, 100);
      e.preventDefault();
    },
    closeRightClickMenu() {
      setTimeout(() => {
        this.viewRightClickMenu = false;
      }, 300);
    },
    setRightClickMenu(top, left, scrollY) {
      const menuEl = this.$el.querySelector("#right-click-menu");
      let largestHeight = window.innerHeight + scrollY - menuEl.offsetHeight - 25;
      let largestWidth = window.innerWidth - menuEl.offsetWidth - 25;

      if (top + scrollY > largestHeight) top = largestHeight; else top += scrollY;
      if (left > largestWidth) left = largestWidth;

      this.rightClickMenuTop = top + 'px';
      this.rightClickMenuLeft = left + 'px';
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

.subtitle {
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