/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './app/(admin)/**/**/*.{js,ts,jsx,tsx,mdx}',
    './components/admin/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  safelist: ['ck-content'],
  theme: {
    extend: {},
  },
  plugins: [require('@tailwindcss/forms')],
}
