export const ACTION_KEY_LOGIN = 'login'
export const ACTION_KEY_SIGNUP = 'signup'

export const state = () => ({
  user: null // || { username: 'kavish', email: 'kavishrmunjal@gmail.com' },
})

export const getters = {
  user: (state) => state.user,
}

export const mutations = {
  setUser(state, user) {
    state.user = user;
  },
}

export const actions = {
  init({ commit, dispatch }) {
    console.log('init');

    this.$netlifyIdentity.on('init', (user) => {
      setTimeout(() => {
      console.log('init setUser');
      if (user) {
          commit('setUser', {
            username: user.user_metadata.full_name.toLowerCase(),
            email: user.email,
            id: user.id,
          })
        } else {
          dispatch('open', 'login');
        }
      }, 500);
    })
    this.$netlifyIdentity.on('close', () => {
      const user = this.$netlifyIdentity.currentUser();
      console.log('close setUser');

      if (user) {
        commit('setUser', {
          username: user.user_metadata.full_name.toLowerCase(),
          email: user.email,
          id: user.id,
        })
      }
    })
    this.$netlifyIdentity.init({
      APIUrl: process.env.NETLIFY_IDENTITY_ENDPOINT_URL,
    })
  },
  signup({ dispatch }) {
    dispatch('open', 'signup')
  },
  login({ dispatch }) {
    console.log('login');
    dispatch('open', 'login')
  },
  logout({ commit }) {
    this.$netlifyIdentity.logout()
    commit('setUser', null)
  },
  open({ commit }, action) {
    console.log('open');

    this.$netlifyIdentity.open(action)
    this.$netlifyIdentity.on(action, (user) => {
      console.log('open setUser');
      commit('setUser', {
        username: user.user_metadata.full_name.toLowerCase(),
        email: user.email,
        id: user.id,
      })
      this.$netlifyIdentity.close()
    })
  }
}
