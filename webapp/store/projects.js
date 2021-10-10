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
    data.forEach(project => {
      projectData[project.id] = project;
    });
    state.projectData = projectData;
  },
  updateProjectData: (state, data) => {
    state.projectData = Object.assign({}, state.projectData, { [data.id]: data });
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
    data.forEach(project => {
      prioritiesData[project.id] = project;
    });
    state.prioritiesData = prioritiesData;
  },
  updatePrioritiesData: (state, projectId) => {
    state.prioritiesData = Object.assign({}, state.prioritiesData, { [projectId]: state.projectData[projectId] });
  },
  removePriority: (state, projectId) => {
    if (state.prioritiesData[projectId]) {
      const prioritiesData = Object.assign({}, state.prioritiesData);
      delete prioritiesData[projectId];
      state.prioritiesData = prioritiesData;
    }
  },
}

export const actions = {
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
}
