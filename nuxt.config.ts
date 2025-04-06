// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  future: {
    compatibilityVersion: 4,
  },
  app: {
    head: {
      htmlAttrs: {
        'data-mode': 'light',
        lang: 'en',
      },
    },
  },
  modules: [
    '@nuxtjs/tailwindcss',
    'shadcn-nuxt',
    '@nuxtjs/google-fonts' /**, '@nuxtjs/html-validator' */,
    '@pinia/nuxt',
  ],
  pinia: {
    storesDirs: ['./app/stores'],
  },
  tailwindcss: {
    cssPath: ['~/assets/tailwind.css', { injectPosition: 'first' }],
  },
  googleFonts: {
    families: {
      Poppins: true,
    },
  },
  shadcn: {
    prefix: 'Shad',
    componentDir: './app/components/Ui',
  },
  compatibilityDate: '2024-11-01',
  devtools: { enabled: true },
});
