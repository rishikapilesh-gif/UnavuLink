/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        forest: {
          DEFAULT: '#2E6B3F',
          dark: '#1e482a',
          light: '#3d8c53',
          kelly: '#5B7E3C',
        },
        orange: {
          warm: '#F28C28',
          alt: '#FF9D23',
        },
        cherry: {
          DEFAULT: '#D92243',
          coral: '#EA5252',
        },
        cream: {
          DEFAULT: '#F6F3EB',
          dark: '#ECE7DA',
        },
        charcoal: {
          DEFAULT: '#26332B',
          light: '#3e4f44',
        },
        muted: {
          DEFAULT: '#68736C',
          light: '#8fa094',
        },
        sage: {
          DEFAULT: '#DCE5DC',
          light: '#EEF3EE',
        },
        status: {
          success: '#25834A',
          warning: '#E58B20',
          critical: '#D92243',
        }
      },
      fontFamily: {
        sans: ['Inter', 'Plus Jakarta Sans', 'system-ui', 'sans-serif'],
      },
      borderRadius: {
        'card': '16px',
        'subtle': '12px',
      },
      boxShadow: {
        'soft': '0 4px 20px -2px rgba(38, 51, 43, 0.06), 0 2px 6px -1px rgba(38, 51, 43, 0.04)',
        'lift': '0 10px 30px -4px rgba(46, 107, 63, 0.12), 0 4px 10px -2px rgba(38, 51, 43, 0.05)',
      }
    },
  },
  plugins: [],
}
