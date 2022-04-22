<template>
  <div>
    <div class="header">
      <nuxt-link to="/">
        <h3 class="nav-title">priority-tracker</h3>
      </nuxt-link>
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
      <sidebar />
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
  computed: {
    ...mapGetters({
      user: 'auth/user',
    })
  },
  methods: {
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

.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;
  margin: 10px 0;
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

@media only screen and (max-width: 600px) {
  .nav-links a {
    font-size: 0.8em;
    margin: 0 2px;
  }
}

.nav-links a:hover {
  color: hsl(181, 37%, 55%);
}

</style>
