export const state = () => ({
  projectData: {},
  prioritiesData: {},
})

export const getters = {
  unprioritisedProjects: state => {
    const unprioritisedProjects = {};
    Object.keys(state.projectData).forEach(projectId => {
      if (!state.prioritiesData[projectId]) {
        unprioritisedProjects[projectId] = state.projectData[projectId];
      }
    });
    return unprioritisedProjects;
  },
}

export const mutations = {
  setProjectData: (state, data) => {
    const projectData = {};
    data.filter(project => !project.complete).forEach(project => {
      projectData[project.id] = project;
    });
    state.projectData = projectData;
  },
  updateProjectData: (state, data) => {
    const newProjectData = Object.assign({}, state.projectData, { [data.id]: data });
    if (data.complete) {
      delete newProjectData[data.id];
      if (state.prioritiesData[data.id]) {
        const prioritiesData = Object.assign({}, state.prioritiesData);
        delete prioritiesData[data.id];
        state.prioritiesData = prioritiesData;
      }
    }
    state.projectData = newProjectData;
  },
  removeProject: (state, projectId) => {
    if (state.projectData[projectId]) {
      const projectData = Object.assign({}, state.projectData);
      delete projectData[projectId];
      state.projectData = projectData;
    }
  },
  setPrioritiesData: (state, data) => {
    const prioritiesData = {};
    data.filter(project => !project.complete).forEach(project => {
      prioritiesData[project.id] = project;
    });
    state.prioritiesData = prioritiesData;
  },
  addPriority: (state, projectId) => {
    const newPrioritiesData = Object.assign({}, state.prioritiesData, { [projectId]: state.projectData[projectId] });
    if (state.projectData[projectId].complete) {
      delete newPrioritiesData[projectId];
    }
    state.prioritiesData = newPrioritiesData;
  },
  removePriority: (state, projectId) => {
    if (state.prioritiesData[projectId]) {
      const prioritiesData = Object.assign({}, state.prioritiesData);
      delete prioritiesData[projectId];
      state.prioritiesData = prioritiesData;
    }
  },
}

const baseUrl = 'https://8666skqt4l.execute-api.us-east-1.amazonaws.com/dev';

export const actions = {
  async getProjectData ({ commit, rootState }) {
    try {
      await this.$axios.get(`${baseUrl}/projects?user=${rootState.auth.user.username}`,
        {
          headers: { 'Content-Type': 'application/json' }
        }).then((res) => {
        commit('setProjectData', res.data)
      })
    } catch (error) {
      console.log(error)
    }
  },
  async updateProject ({ commit, rootState }, data) {
    try {
      let response
      if (data.id) {
        commit('updateProjectData', data)
        response = await this.$axios.put(`${baseUrl}/projects/${data.id}?user=${rootState.auth.user.username}`,
          data,
          { headers: { 'Content-Type': 'application/json' } }
        );
      } else {
        response = await this.$axios.post(`${baseUrl}/projects?user=${rootState.auth.user.username}`,
          data,
          { headers: { 'Content-Type': 'application/json' } }
        );
        commit('updateProjectData', response.data)
      }
      if (data.addAsPriority) {
        this.$axios.post(`${baseUrl}/projects/${response.data.id}/prioritise?user=${rootState.auth.user.username}`);
        commit('addPriority', response.data.id);
      }
      if (data.complete) {    
        this.$axios.post(`${baseUrl}/projects/${data.id}/deprioritise?user=${rootState.auth.user.username}`);
        commit('removePriority', data.id);
      }
    } catch (error) {
      console.log(error)
    }
  },
  async removeProject ({ commit, rootState }, projectId) {
    try {
      await this.$axios.delete(`${baseUrl}/projects/${projectId}?user=${rootState.auth.user.username}`,
        { headers: { 'Content-Type': 'application/json' } }
      )
      commit('removeProject', projectId);
      this.$axios.post(`${baseUrl}/projects/${projectId}/deprioritise?user=${rootState.auth.user.username}`);
      commit('removePriority', projectId);
    } catch (error) {
      console.log(error)
    }
  },
  async getPrioritiesData ({ commit, rootState }) {
    try {
      const res = await this.$axios.get(`${baseUrl}/priorities?user=${rootState.auth.user.username}`);
      commit('setPrioritiesData', res.data)
    } catch (error) {
      console.log(error)
    }
  },
  async prioritiseProject ({ commit, rootState }, projectId) {
    try {
      commit('addPriority', projectId)
      await this.$axios.post(`${baseUrl}/projects/${projectId}/prioritise?user=${rootState.auth.user.username}`);
    } catch (error) {
      console.log(error)
    }
  },
  async deprioritiseProject ({ commit, rootState }, projectId) {
    try {
      commit('removePriority', projectId)
      await this.$axios.post(`${baseUrl}/projects/${projectId}/deprioritise?user=${rootState.auth.user.username}`);
    } catch (error) {
      console.log(error)
    }
  },
}
