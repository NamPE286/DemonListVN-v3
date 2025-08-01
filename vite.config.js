import { sentrySvelteKit } from '@sentry/sveltekit';
import { sveltekit } from '@sveltejs/kit/vite';
import { defineConfig } from 'vite';

export default defineConfig({
	plugins: [
		sentrySvelteKit({
			sourceMapsUploadOptions: {
				org: 'demon-list-vn',
				project: 'javascript-sveltekit'
			}
		}),
		sveltekit()
	],
	css: {
		preprocessorOptions: {
			scss: {
				additionalData: '@use "src/variables.scss" as *;',
				silenceDeprecations: ['legacy-js-api']
			}
		}
	}
});
