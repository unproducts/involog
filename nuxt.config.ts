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
  ssr: false,
  imports: {
    dirs: ['coladas'],
  },
  modules: [
    '@nuxtjs/tailwindcss',
    '@nuxtjs/google-fonts',
    // 'shadcn-nuxt' // TODO: remove this once shadcn-nuxt is released further.
    './app/modules/shad-corrector',
    '@peterbud/nuxt-query',
  ],
  nuxtQuery: {
    autoImports: ['useQuery', 'useMutation', 'useQueryClient'],
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
