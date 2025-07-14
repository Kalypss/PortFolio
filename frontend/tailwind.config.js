/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./components/**/*.{js,vue,ts}",
    "./layouts/**/*.vue",
    "./pages/**/*.vue",
    "./plugins/**/*.{js,ts}",
    "./app.vue",
    "./error.vue"
  ],
  theme: {
    extend: {
      fontFamily: {
        'dm': ['DM Sans', 'sans-serif'],
      },
      colors: {
        primary: '#2d2d2d',
        secondary: '#1a1a1a',
        background: {
          start: '#f5f1eb',
          end: '#e8ddd4'
        },
        status: {
          progress: '#f59e0b',
          completed: '#10b981'
        }
      },
      animation: {
        'slide-in-up': 'slideInUp 1s ease forwards',
        'pulse-status': 'pulseStatus 2s infinite'
      },
      keyframes: {
        slideInUp: {
          'to': {
            opacity: '1',
            transform: 'translateY(0)'
          }
        },
        pulseStatus: {
          '0%': {
            boxShadow: '0 0 0 0 rgba(16, 185, 129, 0.7)'
          },
          '70%': {
            boxShadow: '0 0 0 10px rgba(16, 185, 129, 0)'
          },
          '100%': {
            boxShadow: '0 0 0 0 rgba(16, 185, 129, 0)'
          }
        }
      }
    }
  },
  plugins: []
}
