import plugin from 'tailwindcss/plugin';
import type { Config } from 'tailwindcss';

/** @type {import('tailwindcss').Config} */
export default {
	content: ['./src/**/*.{html,js,svelte,ts}'],

	theme: {
		extend: {
			colors: {
				'primary-blue': '#049ce4',
				'secondary-blue': '#81d4e7',
				'dark-blue': '#045494',
				'primary-gray': '#59728e',
				'secondary-gray': '#bcccd9',
				'primary-green': '#1a9590'
			},
			keyframes: {
				zoomin: {
					'0%': {
						transform: 'scale(1)'
					},
					'25%': {
						transform: 'scale(1.25)'
					},
					'100%': {
						transform: 'scale(1)'
					}
				}
			},
			animation: {
				zoomin: 'zoomin 1s ease-in-out infinite'
			}
		}
	},

	plugins: [
		plugin(function ({ addVariant, addUtilities }) {
			addVariant('not-first-last', '&:not(:last-child):not(:first-child)');
			addVariant('first-last', ['&:first-child', '&:last-child']);
			addVariant('direct-children', '&>*');
			addVariant('not-first', '&:not(:first-child)');
			addVariant('not-last', '&:not(:last-child)');
			addUtilities({
				'.arrow-hide': {
					'-moz-appearance': 'textfield !important',
					appearance: 'textfield !important',
					'-webkit-appearance': 'none',
					margin: '0'
				},
				'.arrow-hide::-webkit-inner-spin-button, .arrow-hide::-webkit-outer-spin-button': {
					'-webkit-appearance': 'none',
					margin: '0'
				}
			});
		})
	]
} satisfies Config;
