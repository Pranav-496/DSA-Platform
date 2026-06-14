/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: '#FFD600',
        background: '#FAFAFA',
        surface: '#FFFFFF',
        text: '#111111',
        success: '#22C55E',
        warning: '#F59E0B',
        danger: '#EF4444',
        border: '#111111',
      },
      fontFamily: {
        geist: ['Geist', 'sans-serif'],
        inter: ['Inter', 'sans-serif'],
        mono: ['Fira Code', 'Monaco', 'monospace']
      },
      boxShadow: {
        'brutal': '4px 4px 0px 0px rgba(17,17,17,1)',
        'brutal-lg': '8px 8px 0px 0px rgba(17,17,17,1)',
        'brutal-sm': '2px 2px 0px 0px rgba(17,17,17,1)',
      }
    },
  },
  plugins: [],
}
