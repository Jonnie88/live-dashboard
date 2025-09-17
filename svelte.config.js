import adapter from '@sveltejs/adapter-static';
import sveltePreprocess from 'svelte-preprocess';
import path from 'path';

const base = process.env.BASE_PATH ?? ''; // sätts i CI till "/live-dashboard"

const config = {
	preprocess: sveltePreprocess(),
	kit: {
		adapter: adapter({
			fallback: 'index.html' // <-- SPA fallback för GitHub Pages
		}),
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
