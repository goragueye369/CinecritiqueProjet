/** @type {import('tailwindcss').Config} */ 
module.exports = { 
  content: [ 
    "./index.html", 
    "./src/**/*.{js,ts,jsx,tsx}" 
  ], 
  theme: { 
    extend: { 
      colors: { 
        "cine-dark": "#0a0a0a", 
        "cine-gray": "#1a1a1a", 
        "cine-yellow": "#f5c518", 
        "cine-blue": "#5799ef" 
      } 
    } 
  }, 
  plugins: [] 
} 
