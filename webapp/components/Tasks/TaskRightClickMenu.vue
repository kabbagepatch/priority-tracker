<template>
  <ul
    id="right-click-menu"
    tabindex="-1"
    v-if="viewMenu"
    @blur="closeMenu" 
    :style="{ top: top, left: left }"
  >
    <li>First list item</li>
    <li>Second list item</li>
  </ul>
</template>

<script>
export default {
  props: {
    top: {
      type: String,
      default: '0px',
    },
    left: {
      type: String,
      default: '0px',
    },
    viewMenu: {
      type: Boolean,
      default: false,
    },
    task: {
      type: Object,
      default: {}
    },
    closeMenu: {
      type: Function,
      default: () => undefined,
    },
  },
}
</script>

<style scoped>
#right-click-menu{
    background: var(--secondary-color);
    border: 1px solid #BDBDBD;
    box-shadow: 0 2px 2px 0 rgba(0,0,0,.14),0 3px 1px -2px rgba(0,0,0,.2),0 1px 5px 0 rgba(0,0,0,.12);
    display: block;
    list-style: none;
    margin: 0;
    padding: 0;
    position: absolute;
    width: 250px;
    z-index: 999999;
}

#right-click-menu li {
    border-bottom: 1px solid #E0E0E0;
    margin: 0;
    padding: 5px 35px;
}

#right-click-menu li:last-child {
    border-bottom: none;
}

#right-click-menu li:hover {
  background: var(--primary-color);
  color: var(--secondary-color);
}
</style>