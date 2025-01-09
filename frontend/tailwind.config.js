/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        secondary: {
          DEFAULT: '#10b981',
        },
        primary: {
          DEFAULT: '#06b6d4', 
        },
        background: {
          DEFAULT: '#18181b',
        },
        text: {
          DEFAULT: '#d1d5db',
        },
      },
      fontFamily: {
        sans: ['Roboto', 'sans-serif'],
      },
    },  },
  plugins: [],
}

