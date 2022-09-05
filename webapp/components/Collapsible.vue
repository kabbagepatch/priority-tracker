<template>
  <div :class="`collapsible ${collapse ? '' : 'collapsible-expanded'}`">
    <slot></slot>
  </div>
</template>

<script>
export default {
  props: {
    collapse: {},
  },
}
</script>

<style scoped>
.collapsible {
  max-height: 0px;
  overflow: hidden;
  transition: max-height .5s ease-in-out;
}

.collapsible-expanded {
  max-height: 1000vh;
}
</style>