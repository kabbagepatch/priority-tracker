<template>
  <div :class="showSidebar ? 'sidebar-visible' : ''">
    <div class="overlay" :aria-hidden="showSidebar" v-if="showSidebar" @click="toggleSidebar" />
    <div class="header">
      <div class="nav-title-container">
        <client-only><button @click="toggleSidebar" class="outlined sidebar-toggle"><v-icon name="bars" /></button></client-only>
        <nuxt-link to="/">
          <h3 class="nav-title">priority-tracker</h3>
        </nuxt-link>
      </div>
      <div class="nav-links" v-if="user">
        <a href="#" @click.prevent="onLogout"><button>Logout</button></a>
      </div>
      <div class="nav-links" v-else>
        <a href="#" @click.prevent="login"><button>Login</button></a>
        <a href="#" @click.prevent="signup"><button>Sign Up</button></a>
      </div>
    </div>
    <hr />
    <div v-if="user" class="container">
      <sidebar :showSidebar="showSidebar" />
      <div class="content"><Nuxt /></div>
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
    'Mulish',
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
}

*,
*::before,
*::after {
  box-sizing: border-box;
  margin: 0;
}

.overlay {
  position: fixed;
  display: none;
  width: 100%;
  height: 100%;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
  z-index: 2;
  cursor: pointer;
}

@media only screen and (max-width: 600px) {
  .sidebar-visible {
    height: 100vh;
    overflow: hidden;
  }
}

.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;
  margin: 10px 0;
}

.nav-title-container {
  display: flex;
  align-items: center;
}

.nav-title {
  padding: 0 20px;
}

.container {
  display: flex;
  width: 100%;
  min-height: calc(100vh - 55px);
}

.content {
  padding: 40px 50px;
  width: 100%;
  background-color: hsl(202, 100%, 98%);
}

a {
  text-decoration: none;
}

.nav-links {
  margin-right: 10px;
}

.nav-links a {
  color: hsl(187, 88%, 30%);
  margin: 0 7px;
}

.sidebar-toggle {
  display: none;
}

@media only screen and (max-width: 600px) {
  .content {
    padding: 15px 20px;
  }

  .sidebar-toggle, .overlay {
    display: block;
  }

  .nav-title {
    padding: 0;
  }

  .nav-links a {
    font-size: 0.8em;
    margin: 0 2px;
  }
}

.nav-links a:hover {
  color: hsl(181, 37%, 55%);
}

</style>
