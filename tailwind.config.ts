/** @type {import('tailwindcss').Config} */
export default {
  darkMode: ['selector', '[data-mode="dark"]'],
  theme: {
    extend: {
      colors: {
        stone: {
          '50': '#f7fde8',
          '100': '#ecfacd',
          '200': '#d9f5a1',
          '300': '#bfec6a',
          '400': '#a4df3c',
          '500': '#77b01a',
          '600': '#669d13',
          '700': '#4e7813',
          '800': '#405f15',
          '900': '#375116',
          '950': '#1b2c07',
        },
      },
    },
  },
  plugins: [],
};
