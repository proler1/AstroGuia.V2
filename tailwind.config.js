/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./App.{js,jsx,ts,tsx}",
    "./app/**/*.{js,jsx,ts,tsx}",
    "./src/**/*.{js,jsx,ts,tsx}"
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#7C3AED', // Purple
          dark: '#5B21B6',
          light: '#A78BFA',
        },
        secondary: {
          DEFAULT: '#2563EB', // Blue
          dark: '#1E40AF',
          light: '#60A5FA',
        },
        accent: {
          DEFAULT: '#F59E0B', // Gold
          dark: '#D97706',
          light: '#FBBF24',
        },
        background: {
          light: '#F8FAFC',
          dark: '#0F172A',
          DEFAULT: '#F8FAFC',
        },
      },
      fontFamily: {
        sans: ['System', 'sans-serif'],
      },
    },
  },
  plugins: [],
};