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
        // Couleurs principales
        'dark-bg': '#0a0a0a',
        'dark-surface': '#141414',
        'dark-surface-light': '#1f1f1f',
        'text-primary': '#ffffff',
        'text-secondary': '#d1d5db',
        'accent-yellow': '#f5c518',
        'accent-blue': '#5799ef',
        'border-dark': '#2d2d2d',
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
