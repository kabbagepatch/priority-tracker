<template>
  <ul
    id="right-click-menu"
    tabindex="-1"
    v-if="viewMenu"
    @blur="closeMenu" 
    :style="{ top: top, left: left }"
  >
    <li role="button" tabindex="0" @click.stop="moveTaskToActive" v-if="task.status !== 'active'">Move to Active</li>
    <li role="button" tabindex="0" @click.stop="moveTaskToQueued" v-if="task.status !== 'queued'">Move to Up Next</li>
    <li role="button" tabindex="0" @click.stop="moveTaskToPaused" v-if="task.status !== 'paused'">Move to Paused</li>
    <li role="button" tabindex="0" @click.stop="moveTaskToBacklog" v-if="task.status !== 'backlog'">Move to Backlog</li>
    <li role="button" tabindex="0" @click.stop="moveTaskToComplete" v-if="task.status !== 'complete'">Mark as Complete</li>
    <li role="button" tabindex="0" @click.stop="updateTask">Modify Task</li>
    <li role="button" tabindex="0" @click.stop="deleteTask" id="delete-option">Delete Task</li>
  </ul>
</template>

<script>
export default {
  props: {
    task: {
      type: Object,
      default: {}
    },
    top: {
      type: String,
      default: '0px',
    },
    left: {
      type: String,
      default: '0px',
    },
    viewMenu: {
      type: Boolean,
      default: false,
    },
    closeMenu: {
      type: Function,
      default: () => undefined,
    },
    updateTask: {
      type: Function,
      default: () => undefined,
    },
  },
  methods: {
    moveTaskToActive (e) {
      this.$store.dispatch('tasks/updateTaskStatus', { ...this.task, prevStatus: this.task.status, status: 'active' });
    },
    moveTaskToQueued (e) {
      this.$store.dispatch('tasks/updateTaskStatus', { ...this.task, prevStatus: this.task.status, status: 'queued' });
    },
    moveTaskToPaused (e) {
      this.$store.dispatch('tasks/updateTaskStatus', { ...this.task, prevStatus: this.task.status, status: 'paused' });
    },
    moveTaskToBacklog (e) {
      this.$store.dispatch('tasks/updateTaskStatus', { ...this.task, prevStatus: this.task.status, status: 'backlog' });
    },
    moveTaskToComplete (e) {
      this.$store.dispatch('tasks/updateTaskStatus', { ...this.task, prevStatus: this.task.status, status: 'complete' });
    },
    deleteTask (e) {
      if (confirm('Are you sure you want to delete this task?')) {
        this.$store.dispatch('tasks/removeTask', this.task);
      }
    }
  }
}
</script>

<style scoped>
#right-click-menu{
  background: var(--white);
  border: 1px solid #BDBDBD;
  box-shadow: 0 2px 2px 0 rgba(0,0,0,.14),0 3px 1px -2px rgba(0,0,0,.2),0 1px 5px 0 rgba(0,0,0,.12);
  display: block;
  list-style: none;
  margin: 0;
  padding: 0;
  position: absolute;
  width: 250px;
  z-index: 999999;
}

#right-click-menu li {
  border-bottom: 1px solid #E0E0E0;
  margin: 0;
  padding: 5px 35px;
}

#right-click-menu li:last-child {
  border-bottom: none;
}

#right-click-menu li:hover {
  background: var(--primary-color);
  color: var(--secondary-color);
  cursor: pointer;
}

#delete-option {
  color: var(--danger-color);
}
</style>