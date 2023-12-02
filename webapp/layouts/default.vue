<template>
  <div :class="showSidebar ? 'sidebar-visible everything' : 'everything'">
    <div class="overlay" :aria-hidden="showSidebar" v-if="showSidebar" @click="toggleSidebar" />
    <div class="header">
      <div class="nav-title-container">
        <button @click="toggleSidebar" class="secondary sidebar-toggle"><client-only><v-icon name="bars" /></client-only></button>
        <nuxt-link to="/">
          <h3 class="nav-title" :aria-hidden="!showSidebar" v-if="!showSidebar">priority-tracker</h3>
        </nuxt-link>
      </div>
      <div class="nav-links" v-if="user">
        <span class="username">Hi {{user.username}}!</span>
        <a href="#" @click.prevent="onLogout"><button>Logout</button></a>
      </div>
      <div class="nav-links" v-else>
        <a href="#" @click.prevent="login"><button>Login</button></a>
        <a href="#" @click.prevent="signup"><button>Sign Up</button></a>
      </div>
    </div>
    <div class="container">
      <sidebar :showSidebar="showSidebar" />
      <div v-if="user" class="content"><Nuxt /></div>
    </div>
  </div>
</template>

<script>
import { mapGetters, mapActions } from 'vuex'
import Sidebar from '@/components/Sidebar.vue';

export default {
  components: {
    Sidebar,
  },
  data () {
    return {
      showSidebar: false,
    }
  },
  computed: {
    ...mapGetters({
      user: 'auth/user',
    })
  },
  methods: {
    toggleSidebar() {
      this.showSidebar = !this.showSidebar;
    },
    onLogout() {
      this.logout()
      if (this.$route.path !== '/') {
        this.$router.push('/')
      }
    },
    ...mapActions({
      login: 'auth/login',
      signup: 'auth/signup',
      logout: 'auth/logout'
    })
  }
}
</script>

<style>
html {
  font-family:
    'Cairo',
    -apple-system,
    BlinkMacSystemFont,
    'Segoe UI',
    Roboto,
    'Helvetica Neue',
    Arial,
    sans-serif;
  font-size: 16px;
  font-weight: 300;
  word-spacing: 1px;
  -ms-text-size-adjust: 100%;
  -webkit-text-size-adjust: 100%;
  -moz-osx-font-smoothing: grayscale;
  -webkit-font-smoothing: antialiased;
  box-sizing: border-box;
  background: rgb(225, 231, 237);
}

*,
*::before,
*::after {
  box-sizing: border-box;
  margin: 0;
}

.overlay {
  position: fixed;
  width: 100%;
  height: 100%;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: hsla(0, 0%, 0%, 0.5);
  z-index: 2;
  cursor: pointer;
}

.sidebar-visible {
  height: 100vh;
  overflow: hidden;
}

.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;
  padding: 20px;
  background: var(--white)
}

.nav-title-container {
  display: flex;
  align-items: center;
}

.nav-title {
  padding-left: 5px;
  text-shadow: 4px 4px 3px hsl(292deg 38% 52%);
  font-family: 'Homemade Apple';
}

.container {
  display: flex;
  width: 100%;
  min-height: calc(100vh - 200px);
  border-radius: 20px;
}

.content {
  padding: 30px;
  padding-top: 22px;
  width: 100%;
  height: 100%;
  background: rgb(225, 231, 237) /* linear-gradient(to right, var(--primary-color) -50%, var(--primary-color-lighter)); */
}

a {
  text-decoration: none;
}

.nav-links {
  margin-right: 10px;
}

.nav-links a {
  color: var(--primary-color-light);
  margin: 0 7px;
}

.nav-links a:hover {
  color: var(--primary-color);
}

.username {
  text-transform: capitalize;
}

@media (min-width: 800px) {
  .everything {
    margin-left: var(--sidebar-width);
  }

  .nav-title-container {
    display: none
  }

  .nav-links {
    width: 100%;
    text-align: right;
  }
}

@media only screen and (max-width: 600px) {
  .content {
    padding: 20px;
  }

  .nav-links a {
    font-size: 0.8em;
    margin: 0 2px;
  }

  .nav-title {
    font-size: 15px;
  }

  .header {
    padding: 18px 6px;
  }
}

</style>
