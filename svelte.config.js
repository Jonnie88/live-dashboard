// svelte.config.js
import { vitePreprocess } from '@sveltejs/kit/vite';
import adapter from '@sveltejs/adapter-vercel';
import path from 'path';

const config = {
	preprocess: vitePreprocess(),
	kit: {
		adapter: adapter(),
		alias: {
			$lib: path.resolve('./src/lib'),
			$stores: path.resolve('./src/lib/stores'),
			$components: path.resolve('./src/components')
		}
	}
};

export default config;
