/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './app/(admin)/**/**/*.{js,ts,jsx,tsx,mdx}',
    './components/admin/**/*.{js,ts,jsx,tsx,mdx}',
    './libs/ck-plugins/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  safelist: ['ck-content', 'ck-dialog', 'float-right'],
  theme: {
    extend: {},
  },
  plugins: [require('@tailwindcss/forms')],
}
