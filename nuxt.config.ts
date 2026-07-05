import tailwindcss from '@tailwindcss/vite'

// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2025-07-15',
  devtools: { enabled: true },
  modules: ['shadcn-nuxt', 'nuxt-auth-utils', '@nuxtjs/color-mode'],
  css: ['~/assets/css/tailwind.css'],
  vite: {
    plugins: [tailwindcss()],
    optimizeDeps: {
      include: [
        '@lucide/vue',
        '@nuxtjs/color-mode',
        '@vee-validate/zod',
        '@vueuse/core',
        'class-variance-authority',
        'clsx',
        'dayjs',
        'dayjs/plugin/timezone',
        'dayjs/plugin/utc',
        'reka-ui',
        'tailwind-merge',
        'vaul-vue',
        'vee-validate',
        'zod',
      ],
    },
  },
  colorMode: {
    classSuffix: '',
  },
  runtimeConfig: {
    openWeatherApiUrl: process.env.OPENWEATHER_API_URL,
    openWeatherApiKey: process.env.OPENWEATHER_API_KEY,
  },
  shadcn: {
    prefix: '',
    componentDir: '@/components/ui',
  },
  components: [
    {
      path: '~/components',
      pathPrefix: false,
    },
  ],
  nitro: {
    devStorage: {
      gweather: {
        driver: 'fs',
        base: './.data',
      },
    },
  },
})
