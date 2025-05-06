<template>
  <div :class="`sidebar ${showSidebar ? 'sidebar-open' : ''}`" :aria-hidden="!showSidebar">
    <h3 class="title">priority-tracker</h3>
    <nuxt-link class="sidebar-item" to="/">Tasks</nuxt-link>
    <nuxt-link class="sidebar-subitem" to="/#active">Active</nuxt-link>
    <nuxt-link class="sidebar-subitem" to="/#next">Up Next</nuxt-link>
    <nuxt-link class="sidebar-subitem" to="/#paused">Paused</nuxt-link>
    <nuxt-link class="sidebar-subitem" to="/#backlog">Backlog</nuxt-link>
    <hr class="sidebar-separator" />
    <nuxt-link class="sidebar-item" to="/projects">Projects</nuxt-link>
    <nuxt-link class="sidebar-item" to="/priorities">Priorities</nuxt-link>
    <nuxt-link class="sidebar-item" to="/categories">Categories</nuxt-link>
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
  width: var(--sidebar-width);
  overflow-x: hidden;
  padding: 20px 0px 9px 30px;
  font-family: 'Homemade Apple';
  text-shadow: 4px 4px 3px hsl(292deg 38% 52%);
  color: var(--white);
  border-bottom: 2px solid white;
  margin-bottom: 25px
}

.sidebar {
  width: var(--sidebar-width);
  padding: 0;
  background: var(--primary-color);
  overflow-x: hidden;
  transition: max-width 0.5s ease-in-out;
  top: 0;
  left: 0;
  z-index: 3;
  position: fixed;
  height: 100%;
}

@media (max-width: 800px) {
  .sidebar {
    max-width: 0;
  }
}

.sidebar-open {
  max-width: var(--sidebar-width);
}

.sidebar-item, .sidebar-subitem {
  color: var(--white);
  overflow: hidden;
  width: var(--sidebar-width);
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
  box-shadow: var(--black-transparent) 1.95px 1.95px 2.6px;
}

.nuxt-link-exact-active {
  color: var(--primary-color);
  background-color: var(--white);
}

.nuxt-link-exact-active {
  font-weight: bold;
}

.sidebar-separator {
  margin: 15px 0;
}

</style>