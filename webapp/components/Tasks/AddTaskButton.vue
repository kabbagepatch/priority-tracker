<template>
  <div class="button-container">
    <button ref="task-form-button" class="add-task-button" @click="toggleTaskForm">Add Task</button>
    <div v-if="showTaskForm">
      <task-form :onCancelClick="() => { showTaskForm = false }" />
    </div>
  </div>
</template>

<script>

import TaskForm from '@/components/Tasks/TaskForm.vue';
export default {
  components: {
    TaskForm,
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
  border: 1px solid hsl(187, 66%, 30%);
  color: hsl(187, 66%, 30%);
  background: white;
  box-shadow: hsla(0, 0%, 0%, 0.15) 1.95px 1.95px 2.6px;
  font-size: 18px;
  border-radius: 10px;
}
.add-task-button:hover, .add-task-button:focus {
  background: hsl(0, 0%, 98%);
}
</style>