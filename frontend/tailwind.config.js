/** @type {import('tailwindcss').Config} */
export default {
  darkMode: ['class'],
  content: [
    './pages/**/*.{ts,tsx}',
    './components/**/*.{ts,tsx}',
    './app/**/*.{ts,tsx}',
    './src/**/*.{ts,tsx}',
  ],
  prefix: '',
  theme: {
  	container: {
  		center: true,
  		padding: '2rem',
  		screens: {
  			'2xl': '1400px'
  		}
  	},
  	extend: {
  		colors: {
  			'lime-cream': {
  				'50': '#f9fbea',
  				'100': '#f3f7d5',
  				'200': '#ebf0b0',
  				'300': '#dfe586',
  				'400': '#d1d65c',
  				'500': '#c1d52a',
  				'600': '#a3b817',
  				'700': '#7f8f15',
  				'800': '#636f15',
  				'900': '#4d5612',
  				'950': '#1b1e06'
  			},
  			'muted-teal': {
  				'50': '#eff5f3',
  				'100': '#d9e8e2',
  				'200': '#bdd9d0',
  				'300': '#9cc8bb',
  				'400': '#7ab3a4',
  				'500': '#5a9b8a',
  				'600': '#4a8277',
  				'700': '#396051',
  				'800': '#2d4a3f',
  				'900': '#234032',
  				'950': '#0d1613'
  			},
  			'dry-sage': {
  				'50': '#f3f5ef',
  				'100': '#e3e8d9',
  				'200': '#d0dcc4',
  				'300': '#b9ceab',
  				'400': '#9bbe89',
  				'500': '#82ac6b',
  				'600': '#6a9354',
  				'700': '#557543',
  				'800': '#435a35',
  				'900': '#364a2a',
  				'950': '#12160e'
  			},
  			celadon: {
  				'50': '#f2f8ed',
  				'100': '#e1f0d8',
  				'200': '#c7e5b5',
  				'300': '#a4d689',
  				'400': '#8acb66',
  				'500': '#78b54a',
  				'600': '#60913b',
  				'700': '#4d7330',
  				'800': '#3f5a28',
  				'900': '#344824',
  				'950': '#11190a'
  			},
  			primary: {
  				'50': '#f2f8ed',
  				'100': '#e1f0d8',
  				'200': '#c7e5b5',
  				'300': '#a4d689',
  				'400': '#8acb66',
  				'500': '#78b54a',
  				'600': '#60913b',
  				'700': '#4d7330',
  				'800': '#3f5a28',
  				'900': '#344824',
  				'950': '#11190a',
  				DEFAULT: '#60913b',
  				foreground: '#f9fbea'
  			},
  			success: {
  				'50': '#f2f8ed',
  				'100': '#e1f0d8',
  				'200': '#c7e5b5',
  				'300': '#a4d689',
  				'400': '#8acb66',
  				'500': '#78b54a',
  				'600': '#60913b',
  				'700': '#4d7330',
  				'800': '#3f5a28',
  				'900': '#344824',
  				DEFAULT: '#78b54a'
  			},
  			accent: {
  				'50': '#f9fbea',
  				'100': '#f3f7d5',
  				'200': '#ebf0b0',
  				'300': '#dfe586',
  				'400': '#d1d65c',
  				'500': '#c1d52a',
  				'600': '#a3b817',
  				'700': '#7f8f15',
  				'800': '#636f15',
  				'900': '#4d5612',
  				DEFAULT: '#c1d52a',
  				foreground: '#1b1e06'
  			},
  			neutral: {
  				'50': '#eff5f3',
  				'100': '#d9e8e2',
  				'200': '#bdd9d0',
  				'300': '#9cc8bb',
  				'400': '#7ab3a4',
  				'500': '#5a9b8a',
  				'600': '#4a8277',
  				'700': '#396051',
  				'800': '#2d4a3f',
  				'900': '#234032',
  				'950': '#0d1613',
  				DEFAULT: '#396051',
  				foreground: '#f9fbea'
  			},
  			sage: {
  				'50': '#f3f5ef',
  				'100': '#e3e8d9',
  				'200': '#d0dcc4',
  				'300': '#b9ceab',
  				'400': '#9bbe89',
  				'500': '#82ac6b',
  				'600': '#6a9354',
  				'700': '#557543',
  				'800': '#435a35',
  				'900': '#364a2a',
  				'950': '#12160e',
  				DEFAULT: '#6a9354'
  			},
  			border: 'hsl(var(--border))',
  			input: 'hsl(var(--input))',
  			ring: 'hsl(var(--ring))',
  			background: 'hsl(var(--background))',
  			foreground: 'hsl(var(--foreground))',
  			secondary: {
  				DEFAULT: 'hsl(var(--secondary))',
  				foreground: 'hsl(var(--secondary-foreground))'
  			},
  			destructive: {
  				DEFAULT: 'hsl(var(--destructive))',
  				foreground: 'hsl(var(--destructive-foreground))'
  			},
  			muted: {
  				DEFAULT: 'hsl(var(--muted))',
  				foreground: 'hsl(var(--muted-foreground))'
  			},
  			popover: {
  				DEFAULT: 'hsl(var(--popover))',
  				foreground: 'hsl(var(--popover-foreground))'
  			},
  			card: {
  				DEFAULT: 'hsl(var(--card))',
  				foreground: 'hsl(var(--card-foreground))'
  			}
  		},
  		fontSize: {
  			xs: '0.75rem',
  			sm: '0.875rem',
  			base: '1rem',
  			lg: '1.125rem',
  			xl: '1.375rem',
  			'2xl': '1.75rem',
  			'3xl': '2.25rem',
  			'4xl': '2.75rem'
  		},
  		spacing: {
  			'18': '4.5rem',
  			'22': '5.5rem',
  			'26': '6.5rem'
  		},
  		borderRadius: {
  			DEFAULT: '12px',
  			sm: '8px',
  			md: '10px',
  			lg: '16px',
  			xl: '20px',
  			'2xl': '24px'
  		},
  		boxShadow: {
  			sm: '0 1px 3px rgba(57, 96, 81, 0.08), 0 1px 2px rgba(57, 96, 81, 0.06)',
  			DEFAULT: '0 4px 6px rgba(57, 96, 81, 0.1), 0 2px 4px rgba(57, 96, 81, 0.06)',
  			md: '0 4px 6px rgba(57, 96, 81, 0.1), 0 2px 4px rgba(57, 96, 81, 0.06)',
  			lg: '0 10px 15px rgba(57, 96, 81, 0.15), 0 4px 6px rgba(57, 96, 81, 0.1)',
  			xl: '0 20px 25px rgba(57, 96, 81, 0.15), 0 10px 10px rgba(57, 96, 81, 0.1)'
  		},
  		transitionDuration: {
  			'150': '150ms',
  			'200': '200ms'
  		},
  		keyframes: {
  			'accordion-down': {
  				from: {
  					height: '0'
  				},
  				to: {
  					height: 'var(--radix-accordion-content-height)'
  				}
  			},
  			'accordion-up': {
  				from: {
  					height: 'var(--radix-accordion-content-height)'
  				},
  				to: {
  					height: '0'
  				}
  			}
  		},
  		animation: {
  			'accordion-down': 'accordion-down 0.2s ease-out',
  			'accordion-up': 'accordion-up 0.2s ease-out'
  		}
  	}
  },
  plugins: [require('tailwindcss-animate')],
};
