import preprocess from 'svelte-preprocess'
import adapter from '@sveltejs/adapter-vercel'
/** @type {import('@sveltejs/kit').Config}*/
const config = {
	// Consult https://kit.svelte.dev/docs/integrations#preprocessors
	// for more information about preprocessors
	preprocess: [
		preprocess({
			postcss: true
		})
	],
	kit: {
		adapter: adapter({
			runtime: 'nodejs18.x'
		}),
		output: {
			preloadStrategy: 'preload-mjs'
		},
		alias: {
			$components: 'src/lib/components',
			'$components/*': 'src/lib/components/*'
		},
		serviceWorker: {
			register: false
		}
	},
	shadcn: {
		componentPath: './src/lib/components/ui'
	}
}
export default config
