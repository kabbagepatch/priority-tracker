<template>
  <div>
    <div class="header">
      <nuxt-link to="/">
        <h3 class="nav-title">priority-tracker</h3>
      </nuxt-link>
      <div class="nav-links">
        <nuxt-link to="/categories">Categories</nuxt-link>
        <nuxt-link to="/projects">Projects</nuxt-link>
        <nuxt-link to="/priorities">Priorities</nuxt-link>
      </div>
    </div>
    <hr />
    <div class="content">
      <Nuxt />
    </div>
    <br />
  </div>
</template>

<style>
html {
  font-family:
    'Mulish',
    -apple-system,
    BlinkMacSystemFont,
    'Segoe UI',
    Roboto,
    'Helvetica Neue',
    Arial,
    sans-serif;
  font-size: 16px;
  font-weight: 300;
  word-spacing: 1px;
  -ms-text-size-adjust: 100%;
  -webkit-text-size-adjust: 100%;
  -moz-osx-font-smoothing: grayscale;
  -webkit-font-smoothing: antialiased;
  box-sizing: border-box;
}

*,
*::before,
*::after {
  box-sizing: border-box;
  margin: 0;
}

.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;
  margin: 10px 0;
}

.nav-title {
  padding: 0 20px;
}

.content {
  margin: 15px 0;
  padding: 0 20px;
}

a {
  text-decoration: none;
}

.nav-links {
  margin-right: 10px;
}

.nav-links a {
  color: #098191;
  margin: 0 7px;
}

@media only screen and (max-width: 600px) {
  .nav-links a {
    font-size: 0.8em;
    margin: 0 2px;
  }
}

.nav-links a:hover {
  color: #63b6b8;
}

</style>
