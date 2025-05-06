<template>
  <div class="title-card">
    <span
      class="pill-content"
      :style="{
        background: color,
        color: color && isDark(color) ? 'white' : 'dark',
        fontWeight: color && isDark(color) ? '300 !important' : ''
      }"
    >
      <slot></slot>
    </span>
  </div>
</template>

<script>
export default {
  props: {
    color: "",
  },
  methods: {
    isDark(hex) {
      return (parseInt(hex.slice(1), 16) >> 16) * 0.299 + ((parseInt(hex.slice(1), 16) >> 8) & 0xff) * 0.587 + (parseInt(hex.slice(1), 16) & 0xff) * 0.114 < 186;
    },
  }
}
</script>

<style scoped>
.pill-content {
  padding: 0 7px;
  border-radius: 10px;
}
</style>
