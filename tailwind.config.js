/** @type {import('tailwindcss').Config} */
export default {
  content: [
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './src/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      // ============================================
      // DESIGN SYSTEM - PREMIUM SEMANTIC TOKENS
      // ============================================
      
      colors: {
        // Background Tokens
        bg: 'var(--color-bg)',
        surface: 'var(--color-surface)',
        surface2: 'var(--color-surface2)',
        
        // Text Tokens
        text: 'var(--color-text)',
        muted: 'var(--color-muted)',
        
        // Border Token
        border: 'var(--color-border)',
        
        // Primary Brand Color
        primary: {
          DEFAULT: 'var(--color-primary)',
          hover: 'var(--color-primary-hover)',
          pressed: 'var(--color-primary-pressed)',
        },
        
        // Accent & Status
        accent: 'var(--color-accent)',
        danger: 'var(--color-danger)',
        success: 'var(--color-success)',
      },

      // ============================================
      // TYPOGRAPHY SCALE - PREMIUM HIERARCHY
      // ============================================
      
      fontSize: {
        // Display (Hero)
        'display-mobile': ['clamp(2.25rem, 5vw, 2.5rem)', { 
          lineHeight: '1.1', 
          letterSpacing: '-0.02em', 
          fontWeight: '700' 
        }],
        'display-desktop': ['clamp(3rem, 6vw, 3.5rem)', { 
          lineHeight: '1.05', 
          letterSpacing: '-0.02em', 
          fontWeight: '700' 
        }],
        
        // Headings
        'h1-mobile': ['1.75rem', { lineHeight: '1.2', letterSpacing: '-0.01em', fontWeight: '700' }],
        'h1-desktop': ['2.5rem', { lineHeight: '1.2', letterSpacing: '-0.01em', fontWeight: '700' }],
        'h2-mobile': ['1.375rem', { lineHeight: '1.3', letterSpacing: '-0.01em', fontWeight: '700' }],
        'h2-desktop': ['2rem', { lineHeight: '1.25', letterSpacing: '-0.01em', fontWeight: '700' }],
        'h3': ['1.125rem', { lineHeight: '1.4', fontWeight: '600' }],
        
        // Body
        'body': ['1rem', { lineHeight: '1.6', fontWeight: '400' }],
        'small': ['0.875rem', { lineHeight: '1.5', fontWeight: '400' }],
        'caption': ['0.75rem', { lineHeight: '1.4', fontWeight: '400' }],
      },

      // ============================================
      // SPACING SYSTEM - 8PX GRID
      // ============================================
      
      spacing: {
        'unit': '8px',
        '0': '0',
        '0.5': '4px',
        '1': '8px',
        '2': '16px',
        '3': '24px',
        '4': '32px',
        '5': '40px',
        '6': '48px',
        '7': '56px',
        '8': '64px',
        '10': '80px',
        '12': '96px',
        '16': '128px',
        '20': '160px',
      },

      // ============================================
      // CONTAINER & LAYOUT
      // ============================================
      
      maxWidth: {
        'container': '1280px',
      },
      
      container: {
        center: true,
        padding: {
          DEFAULT: '1.25rem', // 20px mobile
          sm: '1.5rem',       // 24px tablet
          lg: '1.5rem',       // 24px desktop
        },
        screens: {
          sm: '640px',
          md: '768px',
          lg: '1024px',
          xl: '1280px',
        },
      },

      // ============================================
      // BORDER RADIUS - CONSISTENT SCALE
      // ============================================
      
      borderRadius: {
        'button': '0.75rem',  // 12px
        'card': '1rem',       // 16px
        'modal': '1rem',      // 16px
        'badge': '9999px',    // full pill
      },

      // ============================================
      // BOX SHADOWS - PREMIUM DEPTH
      // ============================================
      
      boxShadow: {
        'input': '0 1px 2px 0 rgb(0 0 0 / 0.05)',
        'button': '0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -1px rgb(0 0 0 / 0.06)',
        'card': '0 10px 15px -3px rgb(0 0 0 / 0.08), 0 4px 6px -2px rgb(0 0 0 / 0.05)',
        'hero': '0 20px 25px -5px rgb(0 0 0 / 0.1), 0 10px 10px -5px rgb(0 0 0 / 0.04)',
      },

      // ============================================
      // MOTION SYSTEM - PREMIUM TIMING
      // ============================================
      
      transitionDuration: {
        'hover': '150ms',
        'press': '100ms',
        'drawer': '240ms',
        'modal': '200ms',
        'page': '300ms',
      },
      
      transitionTimingFunction: {
        'premium': 'cubic-bezier(0.33, 1, 0.68, 1)', // ease-out premium
      },

      // ============================================
      // Z-INDEX SCALE - LAYERING SYSTEM
      // ============================================
      
      zIndex: {
        'base': '0',
        'dropdown': '1000',
        'sticky': '1100',
        'modal': '1200',
        'popover': '1300',
        'tooltip': '1400',
      },

      // ============================================
      // ANIMATIONS - MICRO-INTERACTIONS
      // ============================================
      
      animation: {
        'fade-in': 'fadeIn 300ms ease-out',
        'slide-up': 'slideUp 240ms ease-out',
        'slide-down': 'slideDown 240ms ease-out',
        'scale-in': 'scaleIn 200ms ease-out',
      },
      
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { transform: 'translateY(8px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        slideDown: {
          '0%': { transform: 'translateY(-8px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        scaleIn: {
          '0%': { transform: 'scale(0.95)', opacity: '0' },
          '100%': { transform: 'scale(1)', opacity: '1' },
        },
      },
    },
  },
  plugins: [],
}
