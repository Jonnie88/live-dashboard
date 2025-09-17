import { vitePreprocess } from '@sveltejs/kit/vite';
import adapter from '@sveltejs/adapter-static';
import path from 'path';

const base = process.env.BASE_PATH ?? ''; // sätts i CI till "/live-dashboard"

const config = {
	preprocess: vitePreprocess(),
	kit: {
		adapter: adapter(),
		paths: { base },
		prerender: { entries: ['*'] },
		alias: {
			$lib: path.resolve('./src/lib'),
			$stores: path.resolve('./src/lib/stores'),
			$components: path.resolve('./src/components')
		}
	}
};
export default config;
