/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        // Primary colors
        primary: {
          50: '#eef4ff',
          100: '#d9e5ff',
          200: '#bcd0ff',
          300: '#8eb0ff',
          400: '#5a84ff',
          500: '#3b5bff',
          600: '#2b3df0',
          700: '#2630dc',
          800: '#242ab3',
          900: '#232a8c',
          950: '#181a50',
        },
        // Secondary colors (neon cyan)
        secondary: {
          50: '#edfcff',
          100: '#d6f7ff',
          200: '#b5f0ff',
          300: '#83e8ff',
          400: '#48d8ff',
          500: '#1ebcff',
          600: '#06a1ff',
          700: '#0983ff',
          800: '#1069db',
          900: '#135aae',
          950: '#0f3871',
        },
        // Accent colors (neon purple)
        accent: {
          50: '#faf5ff',
          100: '#f4e8ff',
          200: '#ebd5ff',
          300: '#dbb3ff',
          400: '#c384ff',
          500: '#ab55ff',
          600: '#9737f5',
          700: '#822bdb',
          800: '#6d27b5',
          900: '#592392',
          950: '#370d61',
        },
        // Success colors
        success: {
          50: '#edfff9',
          100: '#d6fff0',
          200: '#affee1',
          300: '#72fac9',
          400: '#36ecac',
          500: '#0ad48e',
          600: '#00b378',
          700: '#008f63',
          800: '#037151',
          900: '#035c43',
          950: '#003427',
        },
        // Warning colors
        warning: {
          50: '#fffaeb',
          100: '#fff0c7',
          200: '#ffde89',
          300: '#ffc54b',
          400: '#ffaa1e',
          500: '#f98a05',
          600: '#dd6701',
          700: '#b74706',
          800: '#94380d',
          900: '#7a2f0f',
          950: '#461705',
        },
        // Error colors
        error: {
          50: '#fff1f2',
          100: '#ffe1e3',
          200: '#ffc9cd',
          300: '#ffa3aa',
          400: '#ff7078',
          500: '#ff3d4b',
          600: '#ed1d2d',
          700: '#c91226',
          800: '#a71225',
          900: '#8a1324',
          950: '#4c0310',
        },
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
        mono: ['"Share Tech Mono"', 'monospace'],
      },
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'cyber-grid': 'linear-gradient(to right, #0f172a 1px, transparent 1px), linear-gradient(to bottom, #0f172a 1px, transparent 1px)',
      },
      boxShadow: {
        'neon-primary': '0 0 5px rgba(59, 91, 255, 0.5), 0 0 20px rgba(59, 91, 255, 0.3)',
        'neon-secondary': '0 0 5px rgba(30, 188, 255, 0.5), 0 0 20px rgba(30, 188, 255, 0.3)',
        'neon-accent': '0 0 5px rgba(171, 85, 255, 0.5), 0 0 20px rgba(171, 85, 255, 0.3)',
      },
      animation: {
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'glow': 'glow 2s ease-in-out infinite alternate',
      },
      keyframes: {
        glow: {
          '0%': { boxShadow: '0 0 5px rgba(59, 91, 255, 0.5), 0 0 20px rgba(59, 91, 255, 0.3)' },
          '100%': { boxShadow: '0 0 8px rgba(59, 91, 255, 0.8), 0 0 30px rgba(59, 91, 255, 0.5)' },
        },
      },
    },
  },
  plugins: [],
};