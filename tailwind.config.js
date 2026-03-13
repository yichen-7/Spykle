/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        navy: {
          950: '#070D1A',
          900: '#0B1426',
          800: '#111C32',
          700: '#1A2742',
          600: '#1E2D4A',
          500: '#243B5E',
        },
        silver: {
          100: '#F0F2F7',
          200: '#E0E4ED',
          300: '#C0C8D8',
          400: '#A0AABF',
          500: '#7B8AA3',
          600: '#5C6B84',
        },
        aqua: {
          300: '#7EDED8',
          400: '#4ECDC4',
          500: '#3BA99E',
          600: '#2D8A82',
        },
        amber: {
          400: '#F0B840',
          500: '#E8A838',
          600: '#CC8E20',
        },
        rose: {
          400: '#F07088',
          500: '#E85D75',
          600: '#CC4460',
        },
        soft: {
          blue: '#5B8DEF',
          purple: '#9B7AEF',
          green: '#5CC9A0',
        },
      },
      borderRadius: {
        '2xl': '16px',
        '3xl': '20px',
      },
      boxShadow: {
        'glow-aqua': '0 0 20px rgba(78, 205, 196, 0.15)',
        'glow-amber': '0 0 20px rgba(240, 184, 64, 0.15)',
        'glow-rose': '0 0 20px rgba(232, 93, 117, 0.15)',
        'card': '0 2px 16px rgba(0, 0, 0, 0.2)',
        'card-hover': '0 4px 24px rgba(0, 0, 0, 0.3)',
      },
    },
  },
  plugins: [],
}
