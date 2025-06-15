
import type { Config } from "tailwindcss";

export default {
	darkMode: ["class"],
	content: [
		"./pages/**/*.{ts,tsx}",
		"./components/**/*.{ts,tsx}",
		"./app/**/*.{ts,tsx}",
		"./src/**/*.{ts,tsx}",
	],
	prefix: "",
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
				border: 'hsl(var(--border))',
				input: 'hsl(var(--input))',
				ring: 'hsl(var(--ring))',
				background: 'hsl(var(--background))',
				foreground: 'hsl(var(--foreground))',
				primary: {
					DEFAULT: 'hsl(var(--primary))',
					foreground: 'hsl(var(--primary-foreground))',
					50: '#f2edff',
					100: '#e5dbff',
					200: '#cbb6ff',
					300: '#b292ff',
					400: '#9a6dff',
					500: '#8149ff',
					600: '#6b25ff',
					700: '#5900ff',
					800: '#4d00e6',
					900: '#4000cc',
					950: '#2e0099'
				},
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
				accent: {
					DEFAULT: 'hsl(var(--accent))',
					foreground: 'hsl(var(--accent-foreground))',
					50: '#f5edfd',
					100: '#ebdbfb',
					200: '#d7b7f6',
					300: '#c393f2',
					400: '#af6fed',
					500: '#9b4be9',
					600: '#8727e4',
					700: '#7618d1',
					800: '#6913ac',
					900: '#590f89',
					950: '#370a52'
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
			borderRadius: {
				lg: 'var(--radius)',
				md: 'calc(var(--radius) - 2px)',
				sm: 'calc(var(--radius) - 4px)'
			},
			keyframes: {
				'accordion-down': {
					from: { height: '0' },
					to: { height: 'var(--radix-accordion-content-height)' }
				},
				'accordion-up': {
					from: { height: 'var(--radix-accordion-content-height)' },
					to: { height: '0' }
				},
				'fade-in': {
					from: { opacity: '0' },
					to: { opacity: '1' }
				},
				'fade-out': {
					from: { opacity: '1' },
					to: { opacity: '0' }
				},
				'slide-up': {
					from: { transform: 'translateY(10px)', opacity: '0' },
					to: { transform: 'translateY(0)', opacity: '1' }
				},
				'slide-down': {
					from: { transform: 'translateY(-10px)', opacity: '0' },
					to: { transform: 'translateY(0)', opacity: '1' }
				},
				'slide-left': {
					from: { transform: 'translateX(-100px)', opacity: '0' },
					to: { transform: 'translateX(0)', opacity: '1' }
				},
				'slide-right': {
					from: { transform: 'translateX(100px)', opacity: '0' },
					to: { transform: 'translateX(0)', opacity: '1' }
				},
				'scale-in': {
					from: { transform: 'scale(0.95)', opacity: '0' },
					to: { transform: 'scale(1)', opacity: '1' }
				},
				'blur-in': {
					from: { filter: 'blur(2px)', opacity: '0' },
					to: { filter: 'blur(0)', opacity: '1' }
				},
				'pulse': {
					'0%, 100%': { opacity: '1' },
					'50%': { opacity: '0.5' }
				},
				'float': {
					'0%, 100%': { transform: 'translateY(0)' },
					'50%': { transform: 'translateY(-10px)' }
				},
				'bounce': {
					'0%, 100%': { transform: 'translateY(0)' },
					'50%': { transform: 'translateY(-20px)' }
				},
				'spin-slow': {
					'0%': { transform: 'rotate(0deg)' },
					'100%': { transform: 'rotate(360deg)' }
				},
				'ripple': {
					'0%': { transform: 'scale(0)', opacity: '1' },
					'100%': { transform: 'scale(4)', opacity: '0' }
				},
				'marquee': {
					'0%': { transform: 'translateX(0)' },
					'100%': { transform: 'translateX(-100%)' }
				},
				'scroll-x': {
					'0%': { transform: 'translateX(0)' },
					'100%': { transform: 'translateX(calc(-250px * 7))' }
				},
				'bounce-horizontal': {
					'0%, 100%': { transform: 'translateX(0)' },
					'50%': { transform: 'translateX(25px)' }
				},
				'flip': {
					'0%': { transform: 'perspective(1000px) rotateY(0deg)' },
					'100%': { transform: 'perspective(1000px) rotateY(360deg)' }
				},
				'wave': {
					'0%': { transform: 'rotate(0deg)' },
					'10%': { transform: 'rotate(14deg)' },
					'20%': { transform: 'rotate(-8deg)' },
					'30%': { transform: 'rotate(14deg)' },
					'40%': { transform: 'rotate(-4deg)' },
					'50%': { transform: 'rotate(10deg)' },
					'60%': { transform: 'rotate(0deg)' },
					'100%': { transform: 'rotate(0deg)' }
				}
			},
			animation: {
				'accordion-down': 'accordion-down 0.2s ease-out',
				'accordion-up': 'accordion-up 0.2s ease-out',
				'fade-in': 'fade-in 0.5s ease-out',
				'fade-out': 'fade-out 0.5s ease-out',
				'slide-up': 'slide-up 0.5s ease-out',
				'slide-down': 'slide-down 0.5s ease-out',
				'slide-left': 'slide-left 0.5s ease-out',
				'slide-right': 'slide-right 0.5s ease-out',
				'scale-in': 'scale-in 0.5s ease-out',
				'blur-in': 'blur-in 0.4s ease-out',
				'pulse': 'pulse 3s infinite',
				'float': 'float 5s infinite ease-in-out',
				'bounce': 'bounce 3s infinite ease-in-out',
				'spin-slow': 'spin-slow 6s linear infinite',
				'ripple': 'ripple 1s cubic-bezier(0, 0.2, 0.8, 1) infinite',
				'marquee': 'marquee 25s linear infinite',
				'scroll-x': 'scroll-x 40s linear infinite',
				'bounce-horizontal': 'bounce-horizontal 2s infinite ease-in-out',
				'flip': 'flip 2.5s infinite ease-in-out',
				'wave': 'wave 2.5s ease infinite'
			},
			boxShadow: {
				'glass': '0 4px 30px rgba(0, 0, 0, 0.1)',
				'soft': '0 10px 50px -12px rgba(0, 0, 0, 0.12)',
				'glow': '0 0 15px rgba(133, 89, 244, 0.5)',
				'inner-glow': 'inset 0 0 15px rgba(133, 89, 244, 0.2)',
				'highlight': '0 0px 30px -10px rgba(255, 255, 255, 0.4)',
				'layered': '0 1px 2px rgba(0, 0, 0, 0.05), 0 8px 20px -3px rgba(0, 0, 0, 0.1)',
				'3d': '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05), 0 -2px 4px -1px rgba(0, 0, 0, 0.02)',
				'sharp': '5px 5px 0 0 rgba(0, 0, 0, 0.1)',
				'neon': '0 0 5px rgba(155, 135, 245, 0.5), 0 0 20px rgba(155, 135, 245, 0.3)',
				'inner-sharp': 'inset 3px 3px 0 0 rgba(0, 0, 0, 0.1)'
			},
			backgroundImage: {
				'glass': 'linear-gradient(135deg, rgba(255, 255, 255, 0.4), rgba(255, 255, 255, 0.1))',
				'gradient-primary': 'linear-gradient(135deg, #7e69ab 0%, #9b87f5 100%)',
				'gradient-secondary': 'linear-gradient(135deg, #6E59A5 0%, #D6BCFA 100%)',
				'gradient-cool': 'linear-gradient(90deg, hsla(221, 45%, 73%, 1) 0%, hsla(220, 78%, 29%, 1) 100%)',
				'gradient-warm': 'linear-gradient(90deg, hsla(39, 100%, 77%, 1) 0%, hsla(22, 90%, 57%, 1) 100%)',
				'gradient-radial': 'radial-gradient(circle, hsla(255, 92%, 76%, 0.5) 0%, transparent 70%)',
				'gradient-shimmer': 'linear-gradient(to right, transparent, rgba(255, 255, 255, 0.1), transparent)',
				'noise': 'url("data:image/svg+xml,%3Csvg viewBox=\'0 0 200 200\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cfilter id=\'noiseFilter\'%3E%3CfeTurbulence type=\'fractalNoise\' baseFrequency=\'0.65\' numOctaves=\'3\' stitchTiles=\'stitch\'/%3E%3C/filter%3E%3Crect width=\'100%25\' height=\'100%25\' filter=\'url(%23noiseFilter)\'/%3E%3C/svg%3E")',
				'dots': 'radial-gradient(rgba(0, 0, 0, 0.1) 2px, transparent 2px)',
				'grid': 'linear-gradient(rgba(200, 200, 200, 0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(200, 200, 200, 0.1) 1px, transparent 1px)',
				'stripes': 'linear-gradient(45deg, rgba(0, 0, 0, 0.05) 25%, transparent 25%, transparent 50%, rgba(0, 0, 0, 0.05) 50%, rgba(0, 0, 0, 0.05) 75%, transparent 75%, transparent)'
			},
			fontFamily: {
				sans: ['Inter', 'system-ui', 'sans-serif'],
				heading: ['Poppins', 'system-ui', 'sans-serif']
			},
			transitionTimingFunction: {
				'bounce': 'cubic-bezier(0.175, 0.885, 0.32, 1.275)',
				'smooth': 'cubic-bezier(0.4, 0, 0.2, 1)',
				'spring': 'cubic-bezier(0.680, -0.550, 0.265, 1.550)'
			},
			backgroundSize: {
				'200%': '200% 200%',
				'16': '4rem 4rem'
			},
			backgroundPosition: {
				'banner-position': '50% 30%'
			},
			textShadow: {
				'sm': '0 1px 2px rgba(0, 0, 0, 0.1)',
				'md': '0 2px 4px rgba(0, 0, 0, 0.1)',
				'lg': '0 8px 16px rgba(0, 0, 0, 0.1)',
				'glow': '0 0 5px rgba(155, 135, 245, 0.5)'
			},
			backdropFilter: {
				'none': 'none',
				'sm': 'blur(2px)',
				'md': 'blur(4px)',
				'lg': 'blur(8px)'
			}
		}
	},
	plugins: [require("tailwindcss-animate")],
} satisfies Config;
