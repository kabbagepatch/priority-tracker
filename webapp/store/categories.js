export const state = () => ({
  categoriesData: {},
})

export const getters = {
}

export const mutations = {
  setCategoryData: (state, data) => {
    const categoriesData = {};
    data.forEach(category => {
      categoriesData[category.id] = category;
    });
    state.categoriesData = categoriesData;
  },
  addCategory: (state, categoryData) => {
    state.categoriesData = Object.assign({}, state.categoriesData, { [categoryData.id]: categoryData });
  },
  removeCategory: (state, categoryId) => {
    if (state.categoriesData[categoryId]) {
      const categoriesData = Object.assign({}, state.categoriesData);
      delete categoriesData[categoryId];
      state.categoriesData = categoriesData;
    }
  },
  updateCategory: (state, categoryData) => {
    state.categoriesData = Object.assign({}, state.categoriesData, { [categoryData.id]: categoryData });
  },
}

const baseUrl = 'https://8666skqt4l.execute-api.us-east-1.amazonaws.com/dev';

export const actions = {
  async getCategoryData ({ commit, rootState }) {
    try {
      await this.$axios.get(`${baseUrl}/categories?user=${rootState.auth.user.username}`,
        {
          headers: { 'Content-Type': 'application/json' }
        }).then((res) => {
        commit('setCategoryData', res.data)
      })
    } catch (error) {
      console.log(error)
    }
  },
  async addCategory ({ commit, rootState }, data) {
    try {
      await this.$axios.post(`${baseUrl}/categories?user=${rootState.auth.user.username}`,
        data,
        {
          headers: { 'Content-Type': 'application/json' }
        }).then((res) => {
        commit('addCategory', res.data)
      });
    } catch (error) {
      console.log(error)
    }
  },
  async removeCategory ({ commit, rootState }, categoryId) {
    try {
      commit('removeCategory', categoryId)
      await this.$axios.delete(`${baseUrl}/categories/${categoryId}?user=${rootState.auth.user.username}`,
        { headers: { 'Content-Type': 'application/json' } }
      )
    } catch (error) {
      console.log(error)
    }
  },
  async updateCategory ({ commit, rootState }, data) {
    try {
      const res = await this.$axios.put(`${baseUrl}/categories/${data.categoryId}?user=${rootState.auth.user.username}`,
        data,
        { headers: { 'Content-Type': 'application/json' } }
      )
      commit('updateCategory', res.data)
    } catch (error) {
      console.log(error)
    }
  },
}
