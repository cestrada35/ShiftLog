// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  ssr: false,
  compatibilityDate: '2026-09-22',
  devtools: { enabled: process.env.NUXT_PUBLIC_USE_MOCKS === 'false' ? false : true },
  typescript: { strict: true },
  modules: [
    '@pinia/nuxt',
    '@primevue/nuxt-module',
  ],
  primevue: {
    options: {
      theme: { preset: 'aura' },
    },
    autoImport: true,
    components: {
      include: ['Button', 'InputText', 'Card', 'Message', 'ProgressSpinner', 'Select'],
    },
  },
  nitro: {
    devProxy: {
      '/api': {
        target: 'http://localhost:8000/api',
        changeOrigin: true
      }
    }
  },
  css: ['primeicons/primeicons.css'],
  components: [
    { path: '~/components', pathPrefix: false },
  ],
  imports: {
    dirs: ['stores', 'composables'],
  },
  runtimeConfig: {
    public: {
      useMocks: process.env.NUXT_PUBLIC_USE_MOCKS !== 'false',
      PRIMEUI_LICENSE: process.env.PRIMEUI_LICENSE,
    }
  }
})