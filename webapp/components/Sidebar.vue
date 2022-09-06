<template>
  <div :class="`sidebar ${showSidebar ? 'sidebar-open' : ''}`">
    <h3 class="title">priority-tracker</h3>
    <nuxt-link class="sidebar-item" to="/">Tasks</nuxt-link>
    <nuxt-link class="sidebar-subitem" to="/#active">Active</nuxt-link>
    <nuxt-link class="sidebar-subitem" to="/#next">Up Next</nuxt-link>
    <nuxt-link class="sidebar-subitem" to="/#backlog">Backlog</nuxt-link>
    <hr class="sidebar-separator" />
    <nuxt-link class="sidebar-item" to="/categories">Categories</nuxt-link>
    <nuxt-link class="sidebar-item" to="/projects">Projects</nuxt-link>
    <nuxt-link class="sidebar-item" to="/priorities">Priorities</nuxt-link>
  </div>
</template>

<script>
  export default {
    props: {
      showSidebar: {
        type: Boolean,
        default: false,
      },
    }
  }
</script>

<style scoped>

.title {
  width: 260px;
  overflow-x: hidden;
  padding: 20px;
  font-family: 'Homemade Apple';
  text-shadow: 4px 4px 3px hsl(292deg 38% 52%);
}

.sidebar {
  width: 260px;
  padding: 0;
  background: var(--white);
  overflow-x: hidden;
  max-width: 0;
  transition: max-width 0.5s ease-in-out;
  overflow-x: auto;
  position: fixed;
  height: 100%;
  top: 0;
  left: 0;
  z-index: 3;
}

.sidebar-open {
  max-width: 260px;
}

.sidebar-item, .sidebar-subitem {
  color: var(--primary-color);
  overflow: hidden;
  width: 260px;
  display: block;
  padding: 8px 0 8px 16px;
  margin: 3px 15px;
  margin-right: 20px;
  border-radius: 10px;
  transition: color 0.3s ease-in-out, background-color 0.3s ease-in-out, box-shadow 0.3s ease-in-out;
}

.sidebar-subitem {
  margin-left: 15px;
}

.sidebar-item:hover, .sidebar-subitem:hover, .nuxt-link-exact-active {
  background-color: var(--secondary-color-light);
  box-shadow: var(--black-transparent) 1.95px 1.95px 2.6px;
}

.nuxt-link-exact-active {
  font-weight: bold;
}

.sidebar-separator {
  margin: 15px 0;
}

</style>