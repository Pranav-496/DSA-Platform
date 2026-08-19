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
        'primary-light': 'var(--primary-light)',
        background: 'var(--bg-color)',
        surface: 'var(--surface-color)',
        'surface-alt': 'var(--surface-alt)',
        text: {
          DEFAULT: 'var(--text-color)',
          muted: 'var(--text-muted)'
        },
        success: 'var(--success)',
        warning: 'var(--warning)',
        danger: 'var(--danger)',
        border: 'var(--border-color)',
        accent: 'var(--accent)',
      },
      fontFamily: {
        geist: ['Geist', 'sans-serif'],
        inter: ['Inter', 'sans-serif'],
        mono: ['Fira Code', 'Monaco', 'monospace']
      },
      boxShadow: {
        'soft': '0 1px 3px rgba(0,0,0,0.08), 0 1px 2px rgba(0,0,0,0.06)',
        'card': '0 2px 8px rgba(0,0,0,0.06), 0 0 1px rgba(0,0,0,0.1)',
        'elevated': '0 4px 16px rgba(0,0,0,0.08), 0 1px 4px rgba(0,0,0,0.06)',
        'glass': '0 8px 32px rgba(0,0,0,0.12)',
        'glow': '0 0 20px rgba(249,115,22,0.15)',
        'glow-primary': '0 0 24px var(--primary-glow)',
      },
      borderRadius: {
        'xl': '0.875rem',
        '2xl': '1rem',
        '3xl': '1.25rem',
      }
    },
  },
  plugins: [],
}
