/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        space: '#0a0a2a',
        stardust: '#1a1a3a'
      }
    },
  },
  plugins: [],
}