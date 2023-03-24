export const state = () => ({
  projectTasksData: {},
  activeTasks: [],
  queuedTasks: [],
})

export const getters = {
  backlogTasks: state => {
    const backlogTasks = {};
    Object.keys(state.projectTasksData).forEach(projectId => {
      backlogTasks[projectId] = state.projectTasksData[projectId].filter(task => !task.active && !task.queued);
    });

    return backlogTasks;
  }
}

export const mutations = {
  setProjectTaskData: (state, data) => {
    state.projectTasksData = {
      ...state.projectTasksData,
      [data.projectId]: data.tasks,
    }
  },
  addTaskToProject: (state, data) => {
    if (state.projectTasksData[data.projectId]) {
      const projectTasks = [data.task].concat(state.projectTasksData[data.projectId || 'none']);
      state.projectTasksData = {
        ...state.projectTasksData,
        [data.projectId]: projectTasks
      }
    }

    if (state.activeTasks && data.task.active) {
      const activeTasks = state.activeTasks.concat([data.task]);
      state.activeTasks = activeTasks;
    }

    if (state.queuedTasks && data.task.queued) {
      const queuedTasks = state.queuedTasks.concat([data.task]);
      state.queuedTasks = queuedTasks;
    }
  },
  removeTask: (state, data) => {
    const projectTasks = state.projectTasksData[data.project];
    if (projectTasks) {
      projectTasks.splice(projectTasks.findIndex(t => t.id === data.id), 1);
      state.projectTasksData = {
        ...state.projectTasksData,
        [data.project]: projectTasks
      }
    }

    const activeTasks = [].concat(state.activeTasks);
    if (activeTasks) {
      const activeTaskIndex = activeTasks.findIndex(t => t.id === data.id)
      if (activeTaskIndex !== -1) {
        activeTasks.splice(activeTaskIndex, 1)
        state.activeTasks = activeTasks;
      }
    }

    const queuedTasks = [].concat(state.queuedTasks);
    if (queuedTasks) {
      const queuedTaskIndex = queuedTasks.findIndex(t => t.id === data.id)
      if (queuedTaskIndex !== -1) {
        queuedTasks.splice(queuedTaskIndex, 1)
        state.queuedTasks = queuedTasks;
      }
    }
  },
  updateTask: (state, updatedTask) => {
    if (state.projectTasksData[updatedTask.project]) {
      const projectTasks = [].concat(state.projectTasksData[updatedTask.project]);
      console.log({projectTasks});
      if (projectTasks) {
        const taskIndex = projectTasks.findIndex(t => t.id === updatedTask.id)
        if (taskIndex !== -1) {
          projectTasks.splice(taskIndex, 1, updatedTask);
          state.projectTasksData = {
            ...state.projectTasksData,
            [updatedTask.project]: projectTasks,
          }
        }
      }
    }

    const activeTasks = [].concat(state.activeTasks);
    let activeTaskIndex = -1;
    if (activeTasks) {
      activeTaskIndex = activeTasks.findIndex(t => t.id === updatedTask.id)
      if (updatedTask.active) {
        if (activeTaskIndex === -1) {
          state.activeTasks = activeTasks.concat([updatedTask]);
        } else {
          activeTasks.splice(activeTaskIndex, 1, updatedTask)
          state.activeTasks = activeTasks;
        }
      }
      if (!updatedTask.active && activeTaskIndex !== -1) {
        activeTasks.splice(activeTaskIndex, 1);
        state.activeTasks = activeTasks
      }
    }

    const queuedTasks = [].concat(state.queuedTasks);
    if (queuedTasks) {
      const queuedTaskIndex = queuedTasks.findIndex(t => t.id === updatedTask.id)
      if (updatedTask.queued) {
        if (queuedTaskIndex === -1) {
          state.queuedTasks = activeTaskIndex === -1 ? queuedTasks.concat([updatedTask]) : [updatedTask].concat(queuedTasks);
        } else {
          queuedTasks.splice(queuedTaskIndex, 1, updatedTask)
          state.queuedTasks = queuedTasks;
        }
      }
      if (!updatedTask.queued && queuedTaskIndex !== -1) {
        queuedTasks.splice(queuedTaskIndex, 1);
        state.queuedTasks = queuedTasks
      }
    }
  },
  setActiveTasks: (state, data) => {
    state.activeTasks = data;
  },
  setQueuedTasks: (state, data) => {
    state.queuedTasks = data;
  }
}

export const actions = {
  async getIndependentTasks ({ commit }) {
    try {
      await this.$axios.get(`https://8666skqt4l.execute-api.us-east-1.amazonaws.com/dev/projects/none/tasks`,
        {
          headers: { 'Content-Type': 'application/json' }
        }).then((res) => {
        commit('setProjectTaskData', { projectId: 'none', tasks: res.data })
      })
    } catch (error) {
      console.error(error)
    }
  },
  async getActiveTasks ({ commit }) {
    try {
      await this.$axios.get(`https://8666skqt4l.execute-api.us-east-1.amazonaws.com/dev/tasks/active`,
        {
          headers: { 'Content-Type': 'application/json' }
        }).then((res) => {
        commit('setActiveTasks', res.data)
      })
    } catch (error) {
      console.error(error)
    }
  },
  async getQueuedTasks ({ commit }) {
    try {
      await this.$axios.get(`https://8666skqt4l.execute-api.us-east-1.amazonaws.com/dev/tasks/queued`,
        {
          headers: { 'Content-Type': 'application/json' }
        }).then((res) => {
        commit('setQueuedTasks', res.data)
      })
    } catch (error) {
      console.error(error)
    }
  },
  async getProjectTasks ({ commit }, projectId) {
    try {
      await this.$axios.get(`https://8666skqt4l.execute-api.us-east-1.amazonaws.com/dev/projects/${projectId}/tasks`,
        {
          headers: { 'Content-Type': 'application/json' }
        }).then((res) => {
        commit('setProjectTaskData', { projectId, tasks: res.data })
      })
    } catch (error) {
      console.error(error)
    }
  },
  async addTask ({ commit }, data) {
    try {
      await this.$axios.post('https://8666skqt4l.execute-api.us-east-1.amazonaws.com/dev/tasks',
        { ...data, [data.status]: true },
        {
          headers: { 'Content-Type': 'application/json' }
        }).then((res) => {
        commit('addTaskToProject', { projectId: data.project, task: res.data })
      })
    } catch (error) {
      console.error(error)
    }
  },
  async removeTask ({ commit }, data) {
    try {
      await this.$axios.delete(`https://8666skqt4l.execute-api.us-east-1.amazonaws.com/dev/tasks/${data.id}`,
        { headers: { 'Content-Type': 'application/json' } }
      )
      commit('removeTask', data)
    } catch (error) {
      console.error(error)
    }
  },
  async updateTask ({ commit }, data) {
    try {
      const res = await this.$axios.put(`https://8666skqt4l.execute-api.us-east-1.amazonaws.com/dev/tasks/${data.id}`,
        data,
        { headers: { 'Content-Type': 'application/json' } }
      )
      commit('updateTask', res.data);
      data.onCallComplete();
    } catch (error) {
      console.error(error)
    }
  },
  async updateTaskStatus ({ commit }, { id, status, value, onCallComplete }) {
    try {
      const res = await this.$axios.put(`https://8666skqt4l.execute-api.us-east-1.amazonaws.com/dev/tasks/${id}/${status}`,
        { status: value },
        { headers: { 'Content-Type': 'application/json' } }
      )
      commit('updateTask', res.data)
      onCallComplete();
    } catch (error) {
      console.error(error)
    }
  },
}
