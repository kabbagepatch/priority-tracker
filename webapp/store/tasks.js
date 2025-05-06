const STATUS_TYPES = ['active', 'queued', 'paused'];

export const state = () => ({
  workingTasksData: Object.fromEntries(STATUS_TYPES.map(key => [key, []])),
  projectTasksData: {},
})

export const getters = {
  backlogTasks: state => {
    const backlogTasks = {};
    Object.keys(state.projectTasksData).forEach(projectId => {
      backlogTasks[projectId] = state.projectTasksData[projectId].filter(task => !STATUS_TYPES.includes(task.status));
    });

    return backlogTasks;
  }
}

export const mutations = {
  setWorkingTasks: (state, data) => {
    state.workingTasksData[data.status] = data.tasks;
  },
  setProjectTaskData: (state, data) => {
    state.projectTasksData = {
      ...state.projectTasksData,
      [data.projectId]: data.tasks,
    };
  },
  addTaskToProject: (state, data) => {
    if (state.projectTasksData[data.projectId]) {
      state.projectTasksData = {
        ...state.projectTasksData,
        [data.projectId]: [data.task].concat(state.projectTasksData[data.projectId || 'none'])
      };
    }

    if (state.workingTasksData[data.task.status] && STATUS_TYPES.includes(data.task.status)) {
      state.workingTasksData = {
        ...state.workingTasksData,
        [data.task.status]: state.workingTasksData[data.task.status].concat([data.task])
      };
    }
  },
  removeTask: (state, data) => {
    const projectTasks = state.projectTasksData[data.project];
    if (projectTasks) {
      state.projectTasksData = {
        ...state.projectTasksData,
        [data.project]: projectTasks.filter(t => t.id !== data.id)
      };
    }

    const workingTasks = state.workingTasksData[data.status];
    if (workingTasks) {
      state.workingTasksData = {
        ...state.workingTasksData,
        [data.status]: workingTasks.filter(t => t.id !== data.id)
      };
    }
  },
  updateTask: (state, data) => {
    const { updatedTask, prevTask } = data;
    if (updatedTask.project !== prevTask.project) {
      const newProjectTaskData = {};
      if (state.projectTasksData[updatedTask.project]) {
        newProjectTaskData[updatedTask.project] = [updatedTask].concat(state.projectTasksData[updatedTask.project])
      }
      if (state.projectTasksData[prevTask.project]) {
        newProjectTaskData[prevTask.project] = state.projectTasksData[prevTask.project].filter(t => t.id !== prevTask.id)
      }
      if (Object.keys(newProjectTaskData).length > 0) {
        state.projectTasksData = {
          ...state.projectTasksData,
          ...newProjectTaskData
        };
      }
    } else {
      if (state.projectTasksData[updatedTask.project]) {
        const projectTasks = state.projectTasksData[updatedTask.project];
        const taskIndex = projectTasks.findIndex(t => t.id === updatedTask.id);
        if (taskIndex === -1) {
          projectTasks = [updatedTask].concat(projectTasks);
        } else {
          projectTasks.splice(taskIndex, 1, updatedTask);
        }
        state.projectTasksData = {
          ...state.projectTasksData,
          [updatedTask.project]: projectTasks,
        };
      }
    }

    if (updatedTask.status !== prevTask.status) {
      const newWorkingTasksData = {};
      if (state.workingTasksData[updatedTask.status]) {
        newWorkingTasksData[updatedTask.status] = [updatedTask].concat(state.workingTasksData[updatedTask.status])
      }
      if (state.workingTasksData[prevTask.status]) {
        newWorkingTasksData[prevTask.status] = state.workingTasksData[prevTask.status].filter(t => t.id !== prevTask.id)
      }
      if (Object.keys(newWorkingTasksData).length > 0) {
        state.workingTasksData = {
          ...state.workingTasksData,
          ...newWorkingTasksData
        };
      }
    } else {
      if (state.workingTasksData[updatedTask.status]) {
        const workingTasks = state.workingTasksData[updatedTask.status];
        const taskIndex = workingTasks.findIndex(t => t.id === updatedTask.id);
        if (taskIndex === -1) {
          workingTasks = [updatedTask].concat(workingTasks);
        } else {
          workingTasks.splice(taskIndex, 1, updatedTask);
        }
        state.workingTasksData = {
          ...state.workingTasksData,
          [updatedTask.status]: workingTasks,
        };
      }
    }
  },
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
  async getTaskByStatus({ commit, rootState }, data) {
    try {
      await this.$axios.get(`${baseUrl}/tasks?user=${rootState.auth.user.username}&status=${data.status}`,
        {
          headers: { 'Content-Type': 'application/json' }
        }).then((res) => {
        commit('setWorkingTasks', { status: data.status, tasks: res.data });
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
      commit('updateTask', { updatedTask: res.data, prevTask: { ...data, status: data.prevStatus || data.status } });
      if (data.onCallComplete) data.onCallComplete();
    } catch (error) {
      console.error(error);
    }
  },
  async updateTaskStatus ({ commit, rootState }, data) {
    try {
      const res = await this.$axios.put(`${baseUrl}/tasks/${data.id}/status?user=${rootState.auth.user.username}`,
        { status: data.status },
        { headers: { 'Content-Type': 'application/json' } }
      );
      commit('updateTask', { updatedTask: res.data, prevTask: { ...res.data, status: data.prevStatus || data.status } });
      if (data.onCallComplete) data.onCallComplete();
    } catch (error) {
      console.error(error);
    }
  },
}
