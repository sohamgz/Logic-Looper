/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Bluestock Brand Colors
        primary: {
          50: '#D9E2FF',
          100: '#C2D9FF',
          200: '#DDF2FD',
          500: '#414BEA',
          600: '#525CEB',
          700: '#190482',
          800: '#7752FE',
        },
        dark: '#222222',
        accent: '#F05537',
        background: '#F6F5F5',
        success: '#10b981',
        warning: '#f59e0b',
        error: '#F05537',
      },
      fontFamily: {
        sans: ['Poppins', 'system-ui', 'sans-serif'],
        body: ['Open Sans', 'system-ui', 'sans-serif'],
      },
    },
  },
  plugins: [],
}