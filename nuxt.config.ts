// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  future: {
    compatibilityVersion: 4,
  },
  app: {
    head: {
      htmlAttrs: {
        'data-mode': 'light',
      },
    },
  },
  modules: ['@nuxtjs/tailwindcss', 'shadcn-nuxt'],
  shadcn: {
    prefix: 'Shad',
    componentDir: './app/components/Ui',
  },
  compatibilityDate: '2024-11-01',
  devtools: { enabled: true },
});
