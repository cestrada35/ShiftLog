

// import Aura from '@primeuix/themes/aura'
// import Lara from '@primeuix/themes/lara'
import { ShiftLogPreset } from './app/theme/preset'

export default defineNuxtConfig({
  ssr: false,
  compatibilityDate: '2026-09-22',
  devtools: { enabled: process.env.NUXT_PUBLIC_USE_MOCKS === 'false' ? false : true },
  typescript: { strict: true },
  modules: [
    '@pinia/nuxt',
    '@primevue/nuxt-module',
    '@nuxtjs/tailwindcss',
  ],
  primevue: {
    options: {
      theme: { preset: ShiftLogPreset,
        options: {
          // cssLayer: {
          //   name: 'primevue',
          //   order: 'tailwind-base, primevue, tailwind-utilities'
          // }
       },
      }
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
  css: ['primeicons/primeicons.css', '~/assets/styles/motion.css', '~/assets/css/tailwind.css'],
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