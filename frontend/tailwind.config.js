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
        primary: 'var(--primary)',
        background: 'var(--bg-color)',
        surface: 'var(--surface-color)',
        text: {
          DEFAULT: 'var(--text-color)',
          muted: 'var(--text-muted)'
        },
        success: 'var(--success)',
        warning: 'var(--warning)',
        danger: 'var(--danger)',
        border: 'var(--border-color)',
      },
      fontFamily: {
        geist: ['Geist', 'sans-serif'],
        inter: ['Inter', 'sans-serif'],
        mono: ['Fira Code', 'Monaco', 'monospace']
      },
      boxShadow: {
        'brutal': '2px 2px 0px 0px rgba(17,17,17,1)',
        'brutal-lg': '4px 4px 0px 0px rgba(17,17,17,1)',
        'brutal-sm': '1px 1px 0px 0px rgba(17,17,17,1)',
      }
    },
  },
  plugins: [],
}
