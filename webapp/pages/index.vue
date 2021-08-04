<template>
  <main class="container">
    <div class="header">
      <Logo />
      <div>
        <h1 class="title">
          priority-tracker
        </h1>
        Hope you're ready to track your priorities babyyyy
      </div>
    </div>
    <CategorySelection />
  </main>
</template>

<script>
export default {}
</script>

<style>
.container {
  margin: 0 auto;
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  text-align: center;
}

.header {
  display: flex;
  padding-bottom: 20px;
}

.title {
  font-family:
    'Quicksand',
    'Source Sans Pro',
    -apple-system,
    BlinkMacSystemFont,
    'Segoe UI',
    Roboto,
    'Helvetica Neue',
    Arial,
    sans-serif;
  display: block;
  font-weight: 300;
  font-size: 50px;
  color: #35495e;
  letter-spacing: 1px;
}
</style>
