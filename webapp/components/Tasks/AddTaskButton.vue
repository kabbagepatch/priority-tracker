<template>
  <div class="button-container">
    <button ref="task-form-button" class="add-task-button secondary" @click="toggleTaskForm">Add Task</button>
    <collapsible :collapse="!showTaskForm">
      <task-form :onCancelClick="() => { showTaskForm = false }" />
    </collapsible>
  </div>
</template>

<script>

import TaskForm from '@/components/Tasks/TaskForm.vue';
import Collapsible from '@/components/Collapsible.vue';
export default {
  components: {
    TaskForm,
    Collapsible,
  },

  data() {
    return {
      showTaskForm: false,
    }
  },

  methods: {
    toggleTaskForm() {
      this.showTaskForm = !this.showTaskForm;
    },
  },
}
</script>

<style scoped>
.button-container {
  width: 100%;
}
.add-task-button {
  width: 100%;
  box-shadow: var(--black-transparent) 1.95px 1.95px 2.6px;
  font-size: 18px;
  border-radius: 20px;
}
.add-task-button:hover, .add-task-button:focus {
  background: var(--secondary-color-light);
  box-shadow: var(--text-dark-transparent) 0px 4px 8px -2px, var(--text-dark-transparenter) 0px 0px 0px 1px;
}
</style>