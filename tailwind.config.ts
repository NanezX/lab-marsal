import plugin from "tailwindcss/plugin"
import type { Config } from 'tailwindcss';

export default {
	content: ['./src/**/*.{html,js,svelte,ts}'],

	theme: {
		extend: {}
	},

	plugins: [
		plugin(function ({ addVariant }) {
			addVariant('not-first-last', '&:not(:last-child):not(:first-child)')
			addVariant('first-last', ['&:first-child', '&:last-child'])
			addVariant('direct-children', '&>*')
		}),
	]
} satisfies Config;
