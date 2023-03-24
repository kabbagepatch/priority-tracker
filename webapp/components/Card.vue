<template>
  <div class="card">
    <slot></slot>
  </div>
</template>

<style scoped>
.card {
  padding: 15px 20px;
  box-shadow: var(--black-transparent) 1.95px 1.95px 2.6px, var(--dark-blue-transparenter) 0px 0px 1px 2px;
  margin-bottom: 10px;
  background: var(--primary-color-very-light);
  border-radius: 20px;
}
</style>