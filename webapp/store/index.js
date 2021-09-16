export const state = () => ({
  categoryData: [],
  projectData: [],
  prioritiesData: [],
  projectTasksData: {},
  independentTasks: [],
  activeTasks: [],
})

export const getters = {
  unprioritisedProjects: state => {
    return state.projectData.filter(p => state.prioritiesData.findIndex(pr => pr.id === p.id) === -1)
  },
  backlogTasks: state => {
    const backlogTasks = {};
    Object.keys(state.projectTasksData).forEach(project => {
      backlogTasks[project] = state.projectTasksData[project].filter(task => !task.active);
    });
    console.log({backlogTasks});

    return backlogTasks;
  }
}

export const mutations = {
  setCategoryData: (state, data) => {
    state.categoryData = data
  },
  setProjectData: (state, data) => {
    state.projectData = data
  },
  updateProjectData: (state, data) => {
    const projectIndex = state.projectData.findIndex(p => p.id === data.id)
    if (projectIndex === -1) {
      state.projectData = [data].concat(state.projectData)
    } else {
      state.projectData.splice(projectIndex, 1, data)
    }
  },
  removeProject: (state, projectId) => {
    const projectIndex = state.projectData.findIndex(p => p.id === projectId)
    if (projectId !== -1) {
      state.projectData.splice(projectIndex, 1)
    }
  },
  setPrioritiesData: (state, data) => {
    state.prioritiesData = data.sort((a, b) => a.createdAt - b.createdAt)
  },
  updatePrioritiesData: (state, projectId) => {
    state.prioritiesData = state.prioritiesData.concat([state.projectData.find(p => p.id === projectId)]);
  },
  removePriority: (state, projectId) => {
    const projectIndex = state.prioritiesData.findIndex(p => p.id === projectId)
    if (projectId !== -1) {
      state.prioritiesData.splice(projectIndex, 1)
    }
  },
  setProjectTaskData: (state, data) => {
    state.projectTasksData = {
      ...state.projectTasksData,
      [data.projectId]: data.data.sort((a, b) => a.createdAt - b.createdAt).filter(t => !t.complete)
    }
  },
  addTaskToProject: (state, data) => {
    const projectTasks = state.projectTasksData[data.project].concat(data.data);
    state.projectTasksData = {
      ...state.projectTasksData,
      [data.projectId]: projectTasks
    }
  },
  removeTask: (state, data) => {
    const projectTasks = state.projectTasksData[data.projectId];
    projectTasks.splice(projectTasks.findIndex(t => t.id === data.id), 1);
    state.projectTasksData = {
      ...state.projectTasksData,
      [data.projectId]: projectTasks
    }
  },
  updateTask: (state, updatedTask) => {
    const projectTasks = state.projectTasksData[updatedTask.project];
    const taskIndex = projectTasks.findIndex(t => t.id === updatedTask.id)
    if (taskIndex !== -1) {
      projectTasks.splice(taskIndex, 1, updatedTask);
      state.projectTasksData = {
        ...state.projectTasksData,
        [updatedTask.projectId]: projectTasks
      }
    }

    const activeTasks = state.activeTasks;
    const activeTaskIndex = activeTasks.findIndex(t => t.id === updatedTask.id)
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
  },
  setActiveTasks: (state, data) => {
    state.activeTasks = data.sort((a, b) => a.updatedAt - b.updatedAt);
  }
}

export const actions = {
  async getCategoryData ({ commit }) {
    try {
      await this.$axios.get('https://8666skqt4l.execute-api.us-east-1.amazonaws.com/dev/categories',
        {
          headers: { 'Content-Type': 'application/json' }
        }).then((res) => {
        commit('setCategoryData', res.data)
      })
    } catch (error) {
      console.log(error)
    }
  },
  async addCategory ({ state, commit }, data) {
    try {
      await this.$axios.post('https://8666skqt4l.execute-api.us-east-1.amazonaws.com/dev/categories',
        data,
        {
          headers: { 'Content-Type': 'application/json' }
        }).then((res) => {
        commit('setCategoryData', [res.data].concat(state.categoryData))
      })
    } catch (error) {
      console.log(error)
    }
  },
  async getProjectData ({ commit }) {
    try {
      await this.$axios.get('https://8666skqt4l.execute-api.us-east-1.amazonaws.com/dev/projects',
        {
          headers: { 'Content-Type': 'application/json' }
        }).then((res) => {
        commit('setProjectData', res.data)
      })
    } catch (error) {
      console.log(error)
    }
  },
  async submitProject ({ commit }, data) {
    try {
      let response
      if (data.id) {
        response = await this.$axios.put(`https://8666skqt4l.execute-api.us-east-1.amazonaws.com/dev/projects/${data.id}`,
          data,
          { headers: { 'Content-Type': 'application/json' } }
        )
      } else {
        response = await this.$axios.post('https://8666skqt4l.execute-api.us-east-1.amazonaws.com/dev/projects',
          data,
          { headers: { 'Content-Type': 'application/json' } }
        )
      }
      commit('updateProjectData', response.data)
    } catch (error) {
      console.log(error)
    }
  },
  async removeProject ({ commit }, projectId) {
    try {
      await this.$axios.delete(`https://8666skqt4l.execute-api.us-east-1.amazonaws.com/dev/projects/${projectId}`,
        { headers: { 'Content-Type': 'application/json' } }
      )
      commit('removeProject', projectId)
    } catch (error) {
      console.log(error)
    }
  },
  async getPrioritiesData ({ commit }) {
    try {
      const res = await this.$axios.get('https://8666skqt4l.execute-api.us-east-1.amazonaws.com/dev/priorities');
      commit('setPrioritiesData', res.data)
    } catch (error) {
      console.log(error)
    }
  },
  async prioritiseProject ({ commit }, projectId) {
    try {
      await this.$axios.post(`https://8666skqt4l.execute-api.us-east-1.amazonaws.com/dev/projects/${projectId}/prioritise`);
      commit('updatePrioritiesData', projectId)
    } catch (error) {
      console.log(error)
    }
  },
  async deprioritiseProject ({ commit }, projectId) {
    try {
      await this.$axios.post(`https://8666skqt4l.execute-api.us-east-1.amazonaws.com/dev/projects/${projectId}/deprioritise`);
      commit('removePriority', projectId)
    } catch (error) {
      console.log(error)
    }
  },
  async getIndependentTasks ({ commit }) {
    try {
      await this.$axios.get(`https://8666skqt4l.execute-api.us-east-1.amazonaws.com/dev/projects/none/tasks`,
        {
          headers: { 'Content-Type': 'application/json' }
        }).then((res) => {
        commit('setProjectTaskData', { projectId: 'none', data: res.data })
      })
    } catch (error) {
      console.log(error)
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
      console.log(error)
    }
  },
  async getProjectTasks ({ commit }, projectId) {
    try {
      await this.$axios.get(`https://8666skqt4l.execute-api.us-east-1.amazonaws.com/dev/projects/${projectId}/tasks`,
        {
          headers: { 'Content-Type': 'application/json' }
        }).then((res) => {
        console.log('getProjectTasks', res.data);
        commit('setProjectTaskData', { projectId, data: res.data })
      })
    } catch (error) {
      console.log(error)
    }
  },
  async addTask ({ commit }, data) {
    try {
      await this.$axios.post('https://8666skqt4l.execute-api.us-east-1.amazonaws.com/dev/tasks',
        data,
        {
          headers: { 'Content-Type': 'application/json' }
        }).then((res) => {
        commit('addTaskToProject', { project: data.project, data: res.data })
      })
    } catch (error) {
      console.log(error)
    }
  },
  async removeTask ({ commit }, data) {
    try {
      await this.$axios.delete(`https://8666skqt4l.execute-api.us-east-1.amazonaws.com/dev/tasks/${data.id}`,
        { headers: { 'Content-Type': 'application/json' } }
      )
      commit('removeTask', data)
    } catch (error) {
      console.log(error)
    }
  },
  async updateTask ({ commit }, data) {
    try {
      const res = await this.$axios.put(`https://8666skqt4l.execute-api.us-east-1.amazonaws.com/dev/tasks/${data.id}`,
        data,
        { headers: { 'Content-Type': 'application/json' } }
      )
      console.log('updateTask', res.data)
      commit('updateTask', res.data)
    } catch (error) {
      console.log(error)
    }
  }
}
