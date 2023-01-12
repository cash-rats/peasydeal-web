const defaultTheme = require('tailwindcss/defaultTheme');

/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./app/**/*.{ts,tsx,jsx,js}"],
  theme: {
    fontFamily: {
      lato: 'Lato, sans-serif',
    },
    screens: {
      // default theme includes:
      // sm => @media (min-width: 640px) { ... }
      // md => @media (min-width: 768px) { ... }
      // lg => @media (min-width: 1024px) { ... }
      // xl => @media (min-width: 1280px) { ... }
      // 2xl => @media (min-width: 1536px) { ... }
      ...defaultTheme.screens,

      '499': '499px',
      '540': '540px',
      '576': '576px',
      '600': '600px',
      '720': '720px',
      '899': '899px',
      '992': '992px',
      '1200': '1200px',
      '1348': '1348px',
      '1600': '1600px',
    },
    extend: {
      keyframes: {
        mountainsmoke: {
          '100%': {
            'background-position': '-51.75rem',
          },
        }
      },
      animation: {
        play: 'animation',
      },
      backgroundImage: (theme) => ({
        'home-gradient-light-sm': "url('/images/home-gradient-light-sm.png')",
        'home-gradient-light': "url('/images/home-gradient-light.png')",
      }),
      colors: {
        'primary': '#e6007e',
        'raisin-black': '#212121',
        'gray-hover-bg': '#E4E4E4',
        'gray-hover-bg-2': '#D8D8D8',
        'header-border': 'rgba(180, 180, 180, 0.4)',
        'gallery': '#f0f0f0',
        'white-smoke': 'rgb(244, 246, 249)',
        'dune': '#343434',
        'mercury': '#e5e5e5',
        'cornflower-blue': '#888',
        'dark-pastel-green': '#50B04C',
        'dark-mint-green': '#00C441',
        'light-green': '#1EE494',
        'grey-cloud': '#b4b4b4',
        'price-off-red': '#e81120',
        'border-color': '#e5e5e5',
        'battleship-grey': '#828183',
      },
      boxShadow: {
        'dropdown': '0 0 3px 0 rgb(73 143 226 / 50%)',
        'searchbar-focus': '0 0 0 4px #cce9e4;',
        'searchbox': 'rgb(0 0 0 / 12%) 1px 2px 8px 1px;',
        'button': '0 2px 5px 0 rgb(0 0 0 / 50%);',
        'button-hover': '0 2px 10px 0 rgb(0 0 0 / 50%);',
      }
    },
  },
  plugins: [],
};
