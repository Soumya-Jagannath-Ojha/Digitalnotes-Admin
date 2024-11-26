/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      keyframes: {
        heartbeat: {
          '0%': { transform: 'scale(1)' },
          '25%': { transform: 'scale(1.1)' },
          '40%': { transform: 'scale(1)' },
          '60%': { transform: 'scale(1.1)' },
          '100%': { transform: 'scale(1)' },
        },
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideIn: {
          '0%': { 
            transform: 'translateY(-20px)',
            opacity: '0'
          },
          '100%': { 
            transform: 'translateY(0)',
            opacity: '1'
          },
        },
        modalIn: {
          '0%': { 
            transform: 'scale(0.95) translateY(-10px)',
            opacity: '0'
          },
          '100%': { 
            transform: 'scale(1) translateY(0)',
            opacity: '1'
          },
        },
      },
      animation: {
        'heartbeat': 'heartbeat 1.5s ease-in-out infinite',
        'fadeIn': 'fadeIn 0.3s ease-out',
        'slideIn': 'slideIn 0.4s ease-out',
        'modalIn': 'modalIn 0.3s ease-out',
      }
    },
  },
  plugins: [],
}
