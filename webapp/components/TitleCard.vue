<template>
  <div class="title-card">
    <h2>{{title}}</h2>
    <div class="card-content" :style="{ padding: contentPadding || '20px' }">
      <slot></slot>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    title: "",
    contentPadding: "10px 20px",
  },
}
</script>

<style scoped>
h2 {
  border-radius: 20px;
  border-bottom-left-radius: 0;
  border-bottom-right-radius: 0;
  margin-bottom: -5px;
}

.card-content {
  background: var(--white);
  border-bottom-left-radius: 20px;
  border-bottom-right-radius: 20px;
  margin-bottom: 20px;
  box-shadow: var(--black-transparent) 1.95px 1.95px 2.6px, var(--dark-blue-transparenter) 0px 0px 1px 2px;
}
</style>
