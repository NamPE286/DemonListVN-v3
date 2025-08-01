import { vitePreprocess } from '@sveltejs/vite-plugin-svelte';
import adapter from '@sveltejs/adapter-cloudflare';

/** @type {import('@sveltejs/kit').Config} */
const config = {
	kit: {
		adapter: adapter({
			platformProxy: {
				enabled: true,
				configPath: 'wrangler.toml'
			}
		})
	},

	preprocess: [vitePreprocess({})]
};

export default config;
