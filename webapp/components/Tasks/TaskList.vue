<template>
  <client-only>
    <div class="task-list-container">
      <h2 v-if="title">
        <span>{{ title }}</span>
        <span
          v-if="maxTasks !== null" :class="maxTasks < tasks.length ? 'too-many-tasks' : 'good-tasks'"
        >
          ({{ tasks.length }}/{{ maxTasks }})
        </span>
      </h2>
      <div v-if="!tasks || tasks.length === 0">Loading...</div>
      <div class="task-list">
        <draggable v-model="tasksDisplayed" v-bind="dragOptions" @start="drag=true" @end="onDragEnd" handle=".handle">
          <transition-group type="transition" :name="!drag ? 'flip-list' : null">
            <div v-for="task in tasksDisplayed" :key="task.id">
              <task-list-item
                :task="task"
                :moveButtonText="moveButtonText"
                :onMoveButtonClick="() => onMoveButtonClick(task.id)"
                :toggleTaskFormOuter="() => toggleTaskForm()"
              />
            </div>
          </transition-group>
        </draggable>
      </div>
    </div>
  </client-only>
</template>

<script>
import Draggable from 'vuedraggable'
import TaskForm from './TaskForm.vue';
import TaskListItem from './TaskListItem.vue';

export default {
  components: {
    Draggable,
    TaskForm,
    TaskListItem,
  },
  data () {
    return {
      selectedTask: undefined,
      taskFormVisible: false,
      drag: false,
      tasksDisplayed: this.tasks ? [].concat(this.tasks) : [],
    }
  },
  props: {
    title: {
      type: String,
      default: "",
    },
    tasks: {
      type: Array,
      default: () => [],
    },
    maxTasks: {
      type: Number,
      default: null,
    },
    moveButtonText: {
      type: String,
      default: null,
    },
    onMoveButtonClick: {
      type: Function,
      default: () => undefined,
    },
  },
  watch: { 
    tasks: function(newTasks) {
      if (this.tasksDisplayed.length !== newTasks.length) this.tasksDisplayed = [].concat(newTasks);
      this.tasksDisplayed.forEach((displayedTask, i) => {
        newTasks.forEach(newTask => {
          if (displayedTask.id === newTask.id) {
            if (displayedTask.name !== newTask.name) {
              this.tasksDisplayed[i].name = newTask.name
            }
            if (displayedTask.link !== newTask.link) {
              this.tasksDisplayed[i].link = newTask.link
            }
            if (displayedTask.project !== newTask.project) {
              this.tasksDisplayed[i].project = newTask.project
            }
            if (displayedTask.category !== newTask.category) {
              this.tasksDisplayed[i].category = newTask.category
            }
          }
        });
      });
    }
  },
  computed: {
    dragOptions() {
      return {
        animation: 200,
        group: this.title,
        disabled: this.taskFormVisible,
        ghostClass: "ghost"
      };
    },
  },
  methods: {
    onDragEnd (e) {
      this.drag = false
      const curIndex = e.oldIndex;
      const newIndex = e.newIndex;
      const curTask = this.tasks[curIndex];
      let newOrder;
      const existingTaskOrder = this.tasks[newIndex].order || this.tasks[newIndex].createdAt;
      if (newIndex > curIndex) {
        newOrder = existingTaskOrder - 1;
      } else {
        newOrder = existingTaskOrder + 1;
      }

      this.$store.dispatch('tasks/updateTask', { ...curTask, order: newOrder });
    },
    toggleTaskForm () {
      this.taskFormVisible = !this.taskFormVisible;
    }
  },
}
</script>

<style scoped>

h2 {
  display: flex;
  width: 100%;
  border-radius: 15px;
  justify-content: space-between;
  font-weight: 900 !important;
  box-shadow: var(--black-transparent) 1.95px 1.95px 2.6px, var(--dark-blue-transparenter) 0px 0px 1px 2px;
}

.task-list {
  padding-left: 0;
  margin: 15px 0;
}

.too-many-tasks {
  color: var(--danger-color);
  text-shadow: 1px 1px 0.5px var(--black);
}
.good-tasks {
  color: var(--secondary-color);
  text-shadow: 1px 1px 0.5px var(--black);
}

.ghost {
  opacity: 0.5;
  background: hsl(199, 86%, 88%);
}
</style>