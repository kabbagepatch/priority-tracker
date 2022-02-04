export const state = () => ({
  habitsData: {},
})

export const getters = {
}

export const mutations = {
  setHabitData: (state, data) => {
    const habitsData = {};
    data.forEach(habit => {
      habitsData[habit.habitId] = { ...habit, marks: [] };
    });
    state.habitsData = habitsData;
  },
  addHabit: (state, habitData) => {
    state.habitsData = Object.assign({}, state.habitsData, { [habitData.habitId]: { ...habitData, marks: [] } });
  },
  removeHabit: (state, habitId) => {
    if (state.habitsData[habitId]) {
      const habitsData = Object.assign({}, state.habitsData);
      delete habitsData[habitId];
      state.habitsData = habitsData;
    }
  },
  setHabitMarks: (state, { habitId, data }) => {
    const newHabitsData = Object.assign({}, state.habitsData);
    newHabitsData[habitId].marks = data.map(mark => mark.markDate);
    state.habitsData = newHabitsData;
  },
  markHabit: (state, { markDate, habitId }) => {
    const newHabitsData = Object.assign({}, state.habitsData);
    newHabitsData[habitId].marks.push(markDate);
    state.habitsData = newHabitsData;
  },
  unmarkHabit: (state, { markDate, habitId }) => {
    const newHabitsData = Object.assign({}, state.habitsData);
    newHabitsData[habitId].marks.splice(newHabitsData[habitId].marks.indexOf(markDate), 1);
    state.habitsData = newHabitsData;
  },
}

export const actions = {
  async getHabitsData ({ commit, dispatch }) {
    try {
      await this.$axios.get('https://8666skqt4l.execute-api.us-east-1.amazonaws.com/dev/habits',
        {
          headers: { 'Content-Type': 'application/json' }
        }).then((res) => {
        commit('setHabitData', res.data);
        res.data.forEach(habit => {
          dispatch('getHabitMarksData', habit.habitId);
        })
      })
    } catch (error) {
      console.log(error)
    }
  },
  async addHabit ({ commit }, data) {
    try {
      await this.$axios.post('https://8666skqt4l.execute-api.us-east-1.amazonaws.com/dev/habits',
        data,
        {
          headers: { 'Content-Type': 'application/json' }
        }).then((res) => {
        commit('addHabit', res.data)
      })
    } catch (error) {
      console.log(error)
    }
  },
  async removeHabit ({ commit }, habitId) {
    try {
      await this.$axios.delete(`https://8666skqt4l.execute-api.us-east-1.amazonaws.com/dev/habits/${habitId}`,
        { headers: { 'Content-Type': 'application/json' } }
      )
      commit('removeHabit', habitId)
    } catch (error) {
      console.log(error)
    }
  },
  async getHabitMarksData ({ commit }, habitId) {
    try {
      await this.$axios.get(`https://8666skqt4l.execute-api.us-east-1.amazonaws.com/dev/habits/${habitId}/marks`,
        {
          headers: { 'Content-Type': 'application/json' }
        }).then((res) => {
        commit('setHabitMarks', { habitId, data: res.data })
      })
    } catch (error) {
      console.log(error)
    }
  },
  async markHabit ({ commit }, data) {
    console.log('markHabit', data)
    try {
      await this.$axios.post(`https://8666skqt4l.execute-api.us-east-1.amazonaws.com/dev/habits/${data.habitId}/mark`,
        data,
        {
          headers: { 'Content-Type': 'application/json' }
        }).then((res) => {
        commit('markHabit', res.data)
      })
    } catch (error) {
      console.log(error)
    }
  },
  async unmarkHabit ({ commit }, data) {
    try {
      await this.$axios.post(`https://8666skqt4l.execute-api.us-east-1.amazonaws.com/dev/habits/${data.habitId}/unmark`,
        data,
        {
          headers: { 'Content-Type': 'application/json' }
        }).then(() => {
        commit('unmarkHabit', data)
      })
    } catch (error) {
      console.log(error)
    }
  },
}
