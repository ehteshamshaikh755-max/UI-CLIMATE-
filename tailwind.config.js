/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        ink: {
          950: '#070B14',
          900: '#0A1128',
          800: '#101A36',
          700: '#172446',
        },
        monsoon: {
          50: '#EAFBF9',
          100: '#CDF5EF',
          300: '#6FD9CC',
          500: '#14B8A6',
          600: '#0E8C7E',
          700: '#0B6F65',
        },
        sunrise: {
          300: '#F6D29C',
          400: '#F0BD72',
          500: '#E8A857',
          600: '#D88E36',
        },
        coral: {
          400: '#FF8A7A',
          500: '#FF6B5B',
          600: '#E6503F',
        },
        mist: {
          50: '#F7F9FB',
          100: '#EEF2F6',
          200: '#DCE4EC',
        },
      },
      fontFamily: {
        display: ['"Space Grotesk"', 'sans-serif'],
        body: ['"Inter"', 'sans-serif'],
        mono: ['"JetBrains Mono"', 'monospace'],
      },
      backgroundImage: {
        'monsoon-radial':
          'radial-gradient(120% 120% at 10% 0%, rgba(20,184,166,0.18) 0%, rgba(7,11,20,0) 55%), radial-gradient(120% 120% at 90% 100%, rgba(232,168,87,0.12) 0%, rgba(7,11,20,0) 55%)',
      },
      boxShadow: {
        glass: '0 8px 32px 0 rgba(7, 11, 20, 0.37)',
        'glass-light': '0 8px 32px 0 rgba(16, 26, 54, 0.08)',
      },
      animation: {
        'fade-up': 'fadeUp 0.6s ease-out forwards',
        'float-slow': 'float 6s ease-in-out infinite',
        shimmer: 'shimmer 1.8s linear infinite',
      },
      keyframes: {
        fadeUp: {
          '0%': { opacity: 0, transform: 'translateY(16px)' },
          '100%': { opacity: 1, transform: 'translateY(0)' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-10px)' },
        },
        shimmer: {
          '0%': { backgroundPosition: '-700px 0' },
          '100%': { backgroundPosition: '700px 0' },
        },
      },
    },
  },
  plugins: [],
}
