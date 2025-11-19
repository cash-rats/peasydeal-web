const defaultTheme = require('tailwindcss/defaultTheme');

/** @type {import('tailwindcss').Config} */
module.exports = {
    darkMode: ["class"],
    content: ["./app/**/*.{ts,tsx,jsx,js}"],
  theme: {
  	fontFamily: {
  		poppins: 'Poppins, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, "Noto Sans", sans-serif, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol", "Noto Color Emoji"'
  	},
  	screens: {
  		'499': '499px',
  		'540': '540px',
  		'576': '576px',
  		'600': '600px',
  		'622': '622px',
  		'720': '720px',
  		'899': '899px',
  		'992': '992px',
  		'1200': '1200px',
  		'1348': '1348px',
  		'1600': '1600px',
            ...defaultTheme.screens
  	},
  	extend: {
  		keyframes: {
  			slider: {
  				'0%, 30%': {
  					marginLeft: '0'
  				},
  				'32%, 62%': {
  					marginLeft: '-100%'
  				},
  				'64%, 94%': {
  					marginLeft: '-200%'
  				},
  				'96%, 100%': {
  					marginLeft: '0'
  				}
  			},
  			mountainsmoke: {
  				'100%': {
  					'background-position': '-51.75rem'
  				}
  			},
  			scrollgrid: {
  				'0%, 1%': {
  					transform: 'translate3d(0, 0, 0)'
  				},
  				'100%': {
  					transform: 'translate3d(-1800px, 0, 0)'
  				}
  			}
  		},
  		animation: {
  			play: 'animation',
  			scrollgrid: 'scrollgrid 80s linear infinite'
  		},
  		backgroundImage: {
  			'home-gradient-light-sm': 'url("/images/home-gradient-light-sm.png")',
  			'home-gradient-light': 'url("/images/home-gradient-light.png")'
  		},
  		colors: {
  			primary: {
  				DEFAULT: 'hsl(var(--primary))',
  				foreground: 'hsl(var(--primary-foreground))'
  			},
				'bright-blue': '#4285F4',
  			'raisin-black': '#212121',
  			'gray-hover-bg': '#E4E4E4',
  			'gray-hover-bg-2': '#D8D8D8',
  			'header-border': 'rgba(180, 180, 180, 0.4)',
  			gallery: '#f0f0f0',
  			'white-smoke': 'rgb(244, 246, 249)',
  			dune: '#343434',
  			mercury: '#e5e5e5',
  			'cornflower-blue': '#888',
  			'dark-pastel-green': '#50B04C',
  			'dark-mint-green': '#00C441',
  			'light-green': '#1EE494',
  			'grey-cloud': '#b4b4b4',
  			'price-off-red': '#e81120',
  			'border-color': '#e5e5e5',
  			'battleship-grey': '#828183',
  			'paymentelement-border': '#e6e6e6',
  			'spring-wood': '#F7F7EE',
  			'error-msg-red': '#b21111',
  			background: 'hsl(var(--background))',
  			foreground: 'hsl(var(--foreground))',
  			card: {
  				DEFAULT: 'hsl(var(--card))',
  				foreground: 'hsl(var(--card-foreground))'
  			},
  			popover: {
  				DEFAULT: 'hsl(var(--popover))',
  				foreground: 'hsl(var(--popover-foreground))'
  			},
  			secondary: {
  				DEFAULT: 'hsl(var(--secondary))',
  				foreground: 'hsl(var(--secondary-foreground))'
  			},
  			muted: {
  				DEFAULT: 'hsl(var(--muted))',
  				foreground: 'hsl(var(--muted-foreground))'
  			},
  			accent: {
  				DEFAULT: 'hsl(var(--accent))',
  				foreground: 'hsl(var(--accent-foreground))'
  			},
  			destructive: {
  				DEFAULT: 'hsl(var(--destructive))',
  				foreground: 'hsl(var(--destructive-foreground))'
  			},
  			border: 'hsl(var(--border))',
  			input: 'hsl(var(--input))',
  			ring: 'hsl(var(--ring))',
  			chart: {
  				'1': 'hsl(var(--chart-1))',
  				'2': 'hsl(var(--chart-2))',
  				'3': 'hsl(var(--chart-3))',
  				'4': 'hsl(var(--chart-4))',
  				'5': 'hsl(var(--chart-5))'
  			}
  		},
  		boxShadow: {
  			dropdown: '0 0 3px 0 rgb(73 143 226 / 50%)',
  			'searchbar-focus': '0 0 0 4px #cce9e4',
  			searchbox: 'rgb(0 0 0 / 12%) 1px 2px 8px 1px',
  			button: '0 2px 5px 0 rgb(0 0 0 / 50%)',
  			'button-hover': '0 2px 10px 0 rgb(0 0 0 / 50%)',
  			'price-panel': 'rgb(0 0 0 / 20%) 0px 0px 4px 1px, rgb(0 0 0 / 14%) 0px 0px 1px 0px, rgb(0 0 0 / 12%) 0px 2px 1px -1px'
  		},
  		borderRadius: {
  			lg: 'var(--radius)',
  			md: 'calc(var(--radius) - 2px)',
  			sm: 'calc(var(--radius) - 4px)'
  		},
  	}
  },
  plugins: [require("tailwindcss-animate")],
  important: true,
};
