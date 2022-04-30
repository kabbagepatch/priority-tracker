<template>
  <div>
    <div :class="`task ${showTaskForm ? 'task-form-open' : ''}`">
      <div class="task-info">
        <h4 :class="task.complete ? 'complete-task' : ''">
          <a class="task-name task-name-link" v-if="task.link" :href="task.link" target="_blank">
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
          class="outlined icon-only complete"
          @click="completeTask(task.id)"
        >
          <v-icon name="check"/>
        </button>
        <button
          aria-label="Expand task"
          title="Expand task"
          class="outlined icon-only"
          @click="toggleTaskForm"
        >
          <v-icon name="chevron-down"/>
        </button>
      </div>
    </div>
    <div v-if="showTaskForm" :ref="'task-form-' + task.id">
      <task-form
        :selectedTask="{ ...task }"
        :onCancelClick="() => { showTaskForm = false }"
      />
    </div>
  </div>
</template>

<script>
import { mapState } from 'vuex';
import TaskForm from './TaskForm.vue';

export default {
  props: {
    task: {},
  },

  components: { TaskForm },

  data() {
    return {
      showTaskForm: false,
    };
  },

  computed: {
    ...mapState({
      categoriesData: state => state.categories.categoriesData,
      prioritiesData: state => state.projects.prioritiesData,
    }),
  },

  methods: {
    toggleTaskForm() {
      this.showTaskForm = !this.showTaskForm;
    },
    completeTask (id) {
      this.$store.dispatch('tasks/updateTaskStatus', { id, status: 'complete', value: true });
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
  background: white;
  padding: 15px 20px;
  box-shadow: hsla(218, 76%, 15%, 0.25) 0px 4px 8px -2px, hsla(218, 76%, 15%, 0.08) 0px 0px 0px 1px;
  border-radius: 10px;
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
button.complete {
  color: hsl(135, 76%, 31%);
  margin-right: 5px;
}
button.complete:hover {
  color: hsl(135, 75%, 40%);
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
  color: hsl(204, 53%, 51%);
  text-decoration: underline solid hsla(204, 53%, 51%, 0.4);
}
.task-name-link:hover {
  color: hsl(204, 77%, 68%);
}
</style>