export const state = () => ({
  projectTasksData: {},
  activeTasks: [],
  queuedTasks: [],
})

export const getters = {
  backlogTasks: state => {
    const backlogTasks = {};
    Object.keys(state.projectTasksData).forEach(projectId => {
      backlogTasks[projectId] = state.projectTasksData[projectId].filter(task => task.status === 'backlog');
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

    if (state.activeTasks && data.task.status === 'active') {
      const activeTasks = state.activeTasks.concat([data.task]);
      state.activeTasks = activeTasks;
    }

    if (state.queuedTasks && data.task.status === 'queued') {
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
      if (updatedTask.status === 'active') {
        if (activeTaskIndex === -1) {
          state.activeTasks = activeTasks.concat([updatedTask]);
        } else {
          activeTasks.splice(activeTaskIndex, 1, updatedTask)
          state.activeTasks = activeTasks;
        }
      }
      if (updatedTask.status !== 'active' && activeTaskIndex !== -1) {
        activeTasks.splice(activeTaskIndex, 1);
        state.activeTasks = activeTasks
      }
    }

    const queuedTasks = [].concat(state.queuedTasks);
    if (queuedTasks) {
      const queuedTaskIndex = queuedTasks.findIndex(t => t.id === updatedTask.id)
      if (updatedTask.status === 'queued') {
        if (queuedTaskIndex === -1) {
          state.queuedTasks = [updatedTask].concat(queuedTasks);
        } else {
          queuedTasks.splice(queuedTaskIndex, 1, updatedTask)
          state.queuedTasks = queuedTasks;
        }
      }
      if (updatedTask.status !== 'queued' && queuedTaskIndex !== -1) {
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

const baseUrl = 'https://8666skqt4l.execute-api.us-east-1.amazonaws.com/dev';

export const actions = {
  async getIndependentTasks ({ commit, rootState }) {
    try {
      await this.$axios.get(`${baseUrl}/projects/none/tasks?user=${rootState.auth.user.username}`,
        {
          headers: { 'Content-Type': 'application/json' }
        }).then((res) => {
        commit('setProjectTaskData', { projectId: 'none', tasks: res.data });
      });
    } catch (error) {
      console.error(error);
    }
  },
  async getActiveTasks ({ commit, rootState }) {
    try {
      await this.$axios.get(`${baseUrl}/tasks?user=${rootState.auth.user.username}&status=active`,
        {
          headers: { 'Content-Type': 'application/json' }
        }).then((res) => {
        commit('setActiveTasks', res.data);
      });
    } catch (error) {
      console.error(error);
    }
  },
  async getQueuedTasks ({ commit, rootState }) {
    try {
      await this.$axios.get(`${baseUrl}/tasks?user=${rootState.auth.user.username}&status=queued`,
        {
          headers: { 'Content-Type': 'application/json' }
        }).then((res) => {
        commit('setQueuedTasks', res.data);
      });
    } catch (error) {
      console.error(error);
    }
  },
  async getProjectTasks ({ commit, rootState }, data) {
    try {
      await this.$axios.get(`${baseUrl}/projects/${data.id}/tasks?user=${rootState.auth.user.username}`,
        {
          headers: { 'Content-Type': 'application/json' }
        }).then((res) => {
        let tasks = res.data;
        if (data.statuses) {
          tasks = tasks.filter(t => data.statuses.includes(t.status));
        }
        commit('setProjectTaskData', { projectId: data.id, tasks });
      });
    } catch (error) {
      console.error(error);
    }
  },
  async addTask ({ commit, rootState }, data) {
    try {
      await this.$axios.post(`${baseUrl}/tasks?user=${rootState.auth.user.username}`,
        data,
        {
          headers: { 'Content-Type': 'application/json' }
        }).then((res) => {
        commit('addTaskToProject', { projectId: data.project, task: res.data });
      });
    } catch (error) {
      console.error(error);
    }
  },
  async removeTask ({ commit, rootState }, data) {
    try {
      await this.$axios.delete(`${baseUrl}/tasks/${data.id}?user=${rootState.auth.user.username}`,
        { headers: { 'Content-Type': 'application/json' } }
      );
      commit('removeTask', data);
    } catch (error) {
      console.error(error);
    }
  },
  async updateTask ({ commit, rootState }, data) {
    try {
      const res = await this.$axios.put(`${baseUrl}/tasks/${data.id}?user=${rootState.auth.user.username}`,
        data,
        { headers: { 'Content-Type': 'application/json' } }
      );
      commit('updateTask', res.data);
      if (data.onCallComplete) data.onCallComplete();
    } catch (error) {
      console.error(error);
    }
  },
  async updateTaskStatus ({ commit, rootState }, { id, status, onCallComplete }) {
    try {
      const res = await this.$axios.put(`${baseUrl}/tasks/${id}/status?user=${rootState.auth.user.username}`,
        { status },
        { headers: { 'Content-Type': 'application/json' } }
      );
      commit('updateTask', res.data);
      if (onCallComplete) onCallComplete();
    } catch (error) {
      console.error(error);
    }
  },
}
