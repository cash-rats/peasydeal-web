const defaultTheme = require('tailwindcss/defaultTheme');

/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./app/**/*.{ts,tsx,jsx,js}"],
  theme: {
    screens: {
      // default theme includes:
      // => @media (min-width: 640px) { ... }
      // => @media (min-width: 768px) { ... }
      // => @media (min-width: 1024px) { ... }
      // => @media (min-width: 1280px) { ... }
      // => @media (min-width: 1536px) { ... }
      ...defaultTheme.screens,

      '499': '499px',
      '576': '576px',
      '600': '600px',
      '720': '720px',
      '899': '899px',
      '992': '992px',
      '1200': '1200px',
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
    },
    backgroundImage: {
      'home-gradient-light-sm': "url('/images/home-gradient-light-sm.png')",
      'home-gradient-light': "url('/images/home-gradient-light.png')",
    }
  },
  plugins: [],
};
