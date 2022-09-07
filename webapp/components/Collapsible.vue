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
  visibility: hidden;
}

.collapsible-expanded {
  max-height: 1000vh;
  visibility: visible;
  transition: max-height 1s ease-in-out;
}
</style>