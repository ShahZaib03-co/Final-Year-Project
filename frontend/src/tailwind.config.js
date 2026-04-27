/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      fontFamily: {
        display: ['"Playfair Display"', 'Georgia', 'serif'],
        body: ['"DM Sans"', 'system-ui', 'sans-serif'],
        mono: ['"JetBrains Mono"', 'monospace'],
      },
      colors: {
        ink: {
          50: '#f7f6f3',
          100: '#eeebe4',
          200: '#ddd6c8',
          300: '#c8bca7',
          400: '#b09e87',
          500: '#9a8470',
          600: '#8a7362',
          700: '#735f52',
          800: '#5e4e45',
          900: '#4d403a',
          950: '#29201c',
        },
        parchment: '#faf8f5',
        crimson: {
          400: '#e05a5a',
          500: '#d44040',
          600: '#b83535',
        },
      },
      animation: {
        'fade-in': 'fadeIn 0.4s ease-out',
        'slide-up': 'slideUp 0.4s ease-out',
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { opacity: '0', transform: 'translateY(16px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
      },
      typography: {
        DEFAULT: {
          css: {
            fontFamily: '"DM Sans", system-ui, sans-serif',
            lineHeight: '1.8',
          },
        },
      },
    },
  },
  plugins: [],
};
