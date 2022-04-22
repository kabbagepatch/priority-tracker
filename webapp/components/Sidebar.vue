<template>
  <div class="sidebar">
    <nuxt-link class="sidebar-item" to="/">Tasks</nuxt-link>
    <nuxt-link class="sidebar-subitem" to="/#active">Active</nuxt-link>
    <nuxt-link class="sidebar-subitem" to="/#queue">Up Next</nuxt-link>
    <nuxt-link class="sidebar-subitem" to="/#backlog">Projects Backlog</nuxt-link>
    <hr class="sidebar-separator" />
    <nuxt-link class="sidebar-item" to="/categories">Categories</nuxt-link>
    <nuxt-link class="sidebar-item" to="/projects">Projects</nuxt-link>
    <nuxt-link class="sidebar-item" to="/priorities">Priorities</nuxt-link>
    <nuxt-link class="sidebar-item" to="/habits">Habits</nuxt-link>
  </div>
</template>

<script>
  export default {
    created() {
      console.log(this?.$nuxt.$route);
    }    
  }
</script>

<style scoped>

.sidebar {
  border-right: 1px solid hsla(0, 0%, 0%, 0.401);
  width: 260px;
  padding: 40px 15px;
}

.sidebar-item, .sidebar-subitem {
  color: hsl(187, 88%, 30%);
  display: block;
  padding: 8px 0 8px 16px;
  margin: 3px 0;
  border-radius: 10px;
  transition: color 0.3s ease-in-out, background-color 0.3s ease-in-out, box-shadow 0.3s ease-in-out;
}

.sidebar-subitem {
  margin-left: 15px;
}

.sidebar-item:hover, .sidebar-subitem:hover, .nuxt-link-exact-active {
  background-color: hsl(202, 100%, 98%);
  box-shadow: hsla(0, 0%, 0%, 0.15) 1.95px 1.95px 2.6px;
}

.nuxt-link-exact-active {
  font-weight: bold;
}

.sidebar-separator {
  margin: 15px 0;
}

</style>