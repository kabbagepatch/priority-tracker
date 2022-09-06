<template>
  <div class="card">
    <slot></slot>
  </div>
</template>

<style scoped>
.card {
  padding: 15px 20px;
  box-shadow: var(--dark-blue-transparent) 0px 4px 8px -2px, var(--dark-blue-transparenter) 0px 0px 0px 1px;
  margin-bottom: 10px;
  background: var(--white);
}
</style>