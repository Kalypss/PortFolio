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
      screens: {
        'phone': '480px',
        'tablet': '768px',
        'laptop': '1200px',
      },
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
      fontSize: {
        'huge': ['3rem', { lineHeight: '1' }], // 48px
        'big': ['1.5rem', { lineHeight: '1.2' }], // 24px
        'medium': ['1.25rem', { lineHeight: '1.5' }], // 20px
        'small': ['0.875rem', { lineHeight: '1.5' }], // 14px
        'smaller': ['0.75rem', { lineHeight: '1.5' }], // 12px

        'laptop-huge': ['2.625rem', { lineHeight: '1' }], // 42px
        'laptop-big': ['1.25rem', { lineHeight: '1.2' }], // 20px
        'laptop-medium': ['1.125rem', { lineHeight: '1.5' }], // 18px
        'laptop-small': ['0.8125rem', { lineHeight: '1.5' }], // 13px
        'laptop-smaller': ['0.6875rem', { lineHeight: '1.5' }], // 11px

        'tablet-huge': ['2rem', { lineHeight: '1' }], // 32px
        'tablet-big': ['1rem', { lineHeight: '1.2' }], // 16px
        'tablet-medium': ['1rem', { lineHeight: '1.5' }], // 16px
        'tablet-small': ['0.75rem', { lineHeight: '1.5' }], // 12px
        'tablet-smaller': ['0.625rem', { lineHeight: '1.5' }], // 10px

        'phone-huge': ['1.5rem', { lineHeight: '1' }], // 24px
        'phone-big': ['0.875rem', { lineHeight: '1.2' }], // 14px
        'phone-medium': ['0.875rem', { lineHeight: '1.5' }], // 14px
        'phone-small': ['0.75rem', { lineHeight: '1.5' }], // 12px
        'phone-smaller': ['0.5rem', { lineHeight: '1.5' }], // 8px
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
