/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}"
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        // Couleurs inspirées d'IMDb
        'imdb-black': '#121212',
        'imdb-dark-gray': '#2c2c2c',
        'imdb-light-gray': '#757575',
        'imdb-yellow': '#f5c518',
        'imdb-blue': '#5799ef',
        'imdb-white': '#ffffff',
        'imdb-text-primary': '#ffffff',
        'imdb-text-secondary': '#d1d5db',
      },
      backgroundColor: {
        primary: 'var(--imdb-black)',
        secondary: 'var(--imdb-dark-gray)',
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
      },
      boxShadow: {
        'movie-card': '0 4px 6px -1px rgba(0, 0, 0, 0.5), 0 2px 4px -1px rgba(0, 0, 0, 0.3)',
      },
    },
  },
  plugins: [],
}
