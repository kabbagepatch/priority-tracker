export default {
  // Target: https://go.nuxtjs.dev/config-target
  target: 'static',

  // Global page headers: https://go.nuxtjs.dev/config-head
  head: {
    title: 'priority-tracker',
    htmlAttrs: {
      lang: 'en'
    },
    meta: [
      { charset: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      { hid: 'description', name: 'description', content: '' }
    ],
    link: [
      { rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' },
      { rel: 'stylesheet', href: 'https://fonts.googleapis.com/css2?family=Mulish:wght@300&family=Poppins:wght@600&display=swap' },
      { rel: 'stylesheet', href: 'https://fonts.googleapis.com/css?family=Homemade Apple' },
      { rel: 'stylesheet', href: 'https://fonts.googleapis.com/css?family=Cairo' }
    ],
    script :[
      { src: '/coloris.min.js', type: 'text/javascript', body: true }
    ]
  },

  // Global CSS: https://go.nuxtjs.dev/config-css
  css: [
    `~/assets/main.css`,
    `~/assets/coloris.min.css`
  ],

  // Plugins to run before rendering page: https://go.nuxtjs.dev/config-plugins
  plugins: [
    '~/plugins/vue-awesome.js',
    { src: '~/plugins/netlify-identity-widget.js', mode: 'client' }
  ],

  // Auto import components: https://go.nuxtjs.dev/config-components
  components: true,

  // Modules for dev and build (recommended): https://go.nuxtjs.dev/config-modules
  buildModules: [
    // https://go.nuxtjs.dev/eslint
    // '@nuxtjs/eslint-module'
    '@nuxtjs/pwa',
  ],

  // Modules: https://go.nuxtjs.dev/config-modules
  modules: [
    // https://go.nuxtjs.dev/axios
    '@nuxtjs/axios'
  ],

  // Axios module configuration: https://go.nuxtjs.dev/config-axios
  axios: {},

  // Build Configuration: https://go.nuxtjs.dev/config-build
  build: {
    transpile: [/vue-awesome/]
  },

  pwa: {
    manifest: {
      name: 'Priority Tracker',
      short_name: 'Priority Tracker',
      background_color: '#0b0f24',
      theme_color: '#3878c2'
    },
    icon: {
      fileName: 'task.png'
    }
  }
}
