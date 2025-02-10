import { defineConfig } from 'vitest/config';
import { sveltekit } from '@sveltejs/kit/vite';
import svelteEmailTailwind from 'svelte-email-tailwind/vite';

export default defineConfig({
	plugins: [sveltekit(), svelteEmailTailwind({ pathToEmailFolder: '/src/lib/components/emails' })],

	test: {
		include: ['src/**/*.{test,spec}.{js,ts}']
	}
});
