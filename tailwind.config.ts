import plugin from "tailwindcss/plugin"
import type { Config } from 'tailwindcss';

export default {
	content: ['./src/**/*.{html,js,svelte,ts}'],

	theme: {
		extend: {
			colors: {
				"primary-blue": "#049ce4",
				"secondary-blue": "#81d4e7",
				"dark-blue": "#045494",
				"primary-gray": "#59728e",
				"secondary-gray": "#bcccd9"
			}
		}
	},

	plugins: [
		plugin(function ({ addVariant }) {
			addVariant('not-first-last', '&:not(:last-child):not(:first-child)')
			addVariant('first-last', ['&:first-child', '&:last-child'])
			addVariant('direct-children', '&>*')
		}),
	]
} satisfies Config;
