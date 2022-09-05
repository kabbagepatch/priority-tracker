<template>
  <div class="button-container">
    <button ref="task-form-button" class="add-task-button" @click="toggleTaskForm">Add Task</button>
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
  color: hsl(187, 66%, 30%);
  background: white;
  box-shadow: hsla(0, 0%, 0%, 0.25) 1.95px 1.95px 2.6px;
  font-size: 18px;
  border-radius: 10px;
}
.add-task-button:hover, .add-task-button:focus {
  background: hsl(0, 0%, 98%);
  box-shadow: hsla(218, 86%, 12%, 0.25) 0px 4px 8px -2px, hsla(218, 86%, 12%, 0.08) 0px 0px 0px 1px;
}
</style>