/** @type {import('tailwindcss').Config} */

export default {
  darkMode: "class",
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    container: {
      center: true,
      padding: '1rem',
    },
    extend: {
      colors: {
        primary: {
          50: '#FFF1F4',
          100: '#FFE4EA',
          200: '#FFC9D5',
          300: '#FF9EB1',
          400: '#FF7A93',
          500: '#FF5B79',
          600: '#F03C5E',
          700: '#C92A4A',
          800: '#A3223D',
          900: '#871E36',
        },
        mint: {
          50: '#EFFBF4',
          100: '#D9F5E3',
          200: '#B5ECC8',
          300: '#A8E6CF',
          400: '#6DD397',
          500: '#46C27A',
          600: '#34A063',
          700: '#2C7F50',
        },
        cream: {
          50: '#FFFEF7',
          100: '#FFF8E1',
          200: '#FFEAA7',
          300: '#FFD93D',
        },
        sky: {
          50: '#F0F7FF',
          100: '#D9EAFE',
          200: '#BCDAFD',
          300: '#74B9FF',
          400: '#54A0FF',
        },
      },
      fontFamily: {
        sans: ['"Nunito"', '"PingFang SC"', '"Microsoft YaHei"', 'sans-serif'],
      },
      boxShadow: {
        'soft': '0 4px 20px rgba(0, 0, 0, 0.06)',
        'soft-lg': '0 8px 30px rgba(0, 0, 0, 0.08)',
      },
      animation: {
        'fade-in': 'fadeIn 0.3s ease-out',
        'slide-up': 'slideUp 0.3s ease-out',
        'bounce-soft': 'bounceSoft 0.5s ease',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { opacity: '0', transform: 'translateY(20px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        bounceSoft: {
          '0%, 100%': { transform: 'scale(1)' },
          '50%': { transform: 'scale(1.1)' },
        },
      },
    },
  },
  plugins: [],
};
