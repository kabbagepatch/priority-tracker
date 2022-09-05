<template>
  <div class="card">
    <slot></slot>
  </div>
</template>

<style scoped>
.card {
  padding: 15px 20px;
  box-shadow: hsla(218, 86%, 12%, 0.25) 0px 4px 8px -2px, hsla(218, 86%, 12%, 0.08) 0px 0px 0px 1px;
  margin-bottom: 10px;
  background-color: white;
  border-radius: 5px;
}
</style>