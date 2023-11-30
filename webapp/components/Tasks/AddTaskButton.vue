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
  box-shadow: var(--black-transparent) 2.95px 2.95px 3.6px, var(--dark-blue-transparenter) 0px 0px 2px 3px;
  font-size: 18px;
  border-radius: 15px;
  margin-top: 10px;
}
.add-task-button:hover, .add-task-button:focus {
  color: black;
  transition: background ease 0.25s, box-shadow ease 0.25s;
  background: var(--secondary-color-light);
  box-shadow: var(--black-transparent) 2.95px 2.95px 3.6px, var(--dark-blue-transparent) 0px 0px 2px 3px;
}
</style>
