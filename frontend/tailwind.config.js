/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        primary: {
          light: '#a5b4fc',
          DEFAULT: '#6366f1',
          dark: '#4338ca',
        },
        secondary: {
          light: '#fbcfe8',
          DEFAULT: '#ec4899',
          dark: '#be185d',
        },
        dark: {
          light: '#4b5563',
          DEFAULT: '#1f2937',
          dark: '#111827',
        },
        light: {
          light: '#f9fafb',
          DEFAULT: '#f3f4f6',
          dark: '#e5e7eb',
        },
      },
      animation: {
        'gradient-x': 'gradient-x 10s ease infinite',
        'gradient-y': 'gradient-y 10s ease infinite',
        'gradient-xy': 'gradient-xy 10s ease infinite',
      },
      keyframes: {
        'gradient-x': {
          '0%, 100%': {
            'background-position': '0% 50%',
          },
          '50%': {
            'background-position': '100% 50%',
          },
        },
        'gradient-y': {
          '0%, 100%': {
            'background-position': '50% 0%',
          },
          '50%': {
            'background-position': '50% 100%',
          },
        },
        'gradient-xy': {
          '0%, 100%': {
            'background-position': '0% 0%',
          },
          '50%': {
            'background-position': '100% 100%',
          },
        },
      },
    },
  },
  plugins: [],
} 