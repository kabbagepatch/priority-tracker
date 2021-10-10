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
  async addCategory ({ commit }, data) {
    try {
      await this.$axios.post('https://8666skqt4l.execute-api.us-east-1.amazonaws.com/dev/categories',
        data,
        {
          headers: { 'Content-Type': 'application/json' }
        }).then((res) => {
        commit('addCategory', res.data)
      })
    } catch (error) {
      console.log(error)
    }
  },
  async removeCategory ({ commit }, categoryId) {
    try {
      await this.$axios.delete(`https://8666skqt4l.execute-api.us-east-1.amazonaws.com/dev/categories/${categoryId}`,
        { headers: { 'Content-Type': 'application/json' } }
      )
      commit('removeCategory', categoryId)
    } catch (error) {
      console.log(error)
    }
  },
}
