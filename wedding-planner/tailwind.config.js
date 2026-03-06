/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{html,ts}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: 'rgb(212, 165, 116)',
          dark: 'rgb(184, 149, 106)',
          light: 'rgb(232, 201, 168)'
        },
        secondary: 'rgb(139, 115, 85)',
        accent: 'rgb(245, 230, 211)',
        rose: 'rgb(232, 213, 213)',
        sage: 'rgb(168, 181, 160)'
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif']
      }
    },
  },
  plugins: [],
}
