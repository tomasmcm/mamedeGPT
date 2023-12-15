import { sveltekit } from '@sveltejs/kit/vite';
import type { UserConfig } from 'vite';
import { SvelteKitPWA } from '@vite-pwa/sveltekit'

const config: UserConfig = {
	plugins: [sveltekit(), SvelteKitPWA({
		srcDir: 'src',
		mode: 'development',
		scope: '/',
				base: '/',
				selfDestroying: process.env.SELF_DESTROYING_SW === 'true',
				manifest: {
					short_name: '🎁 💬',
					name: '🎁 💬',
					start_url: '/',
					scope: '/',
					display: 'standalone',
					theme_color: "#ffffff",
					background_color: "#ffffff",
					icons: [
						{
							src: '/bot.jpg',
							sizes: '192x192',
							type: 'image/jpg',
						},
						{
							src: '/bot.jpg',
							sizes: '512x512',
							type: 'image/jpg',
						},
						{
							src: '/bot.jpg',
							sizes: '512x512',
							type: 'image/jpg',
							purpose: 'any maskable',
						},
					],
				},
				injectManifest: {
					globPatterns: ['client/**/*.{js,mjs,css,ico,jpg,png,svg,webp,woff,woff2,wasm}']
				},
				workbox: {
					globPatterns: ['client/**/*.{js,mjs,css,ico,jpg,png,svg,webp,woff,woff2,wasm}']
				},
				devOptions: {
					enabled: true,
					suppressWarnings: process.env.SUPPRESS_WARNING === 'true',
					type: 'module',
					navigateFallback: '/',
				},

	})
],
	test: {
		include: ['src/**/*.{test,spec}.{js,ts}']
	}
};

export default config;
