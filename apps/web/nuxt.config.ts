// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2026-09-22',
  devtools: { enabled: true },
  typescript: {
    strict: true,
  },
  modules: [
    '@pinia/nuxt',
    '@primevue/nuxt-module',
  ],
  primevue: {
    options: {
      theme: {
        preset: 'aura',
      },
    },
    autoImport: true,
    components: {
      include: ['Button', 'InputText', 'Card', 'Message', 'ProgressSpinner'],
    },
  },
  css: [
    'primeicons/primeicons.css',
  ],
  imports: {
    dirs: ['stores', 'composables'],
  },
  runtimeConfig: {
    public: {
      PRIMEUI_LICENSE: process.env.PRIMEUI_LICENSE,
    }
  }
})