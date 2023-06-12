<script>
	import '../app.css'
	import '../app.postcss'
	import { page } from '$app/stores'
	import { pwaInfo } from 'virtual:pwa-info'
	import { onMount } from 'svelte'

	$: webManifestLink = pwaInfo ? pwaInfo.webManifest.linkTag : ''

	let ReloadPrompt = null

	onMount(async () => {
		pwaInfo && (ReloadPrompt = (await import('$lib/components/ReloadPrompt.svelte')).default)
	})
</script>

<svelte:head>
	<title>亿点</title>
	{@html webManifestLink}
</svelte:head>

<div class="h-[100vh] flex flex-col items-center max-w-4xl mx-auto">
	<h1 class="text-2xl font-bold w-full text-center py-4 flex items-center justify-between">
		<span />
		<h1 class="col-auto">亿点问</h1>
		<a href="about" class="text-sm p-4">
			<svg
				xmlns="http://www.w3.org/2000/svg"
				width="16"
				height="16"
				fill="currentColor"
				class="bi bi-info-circle"
				viewBox="0 0 16 16"
			>
				<path d="M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14zm0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16z" />
				<path
					d="m8.93 6.588-2.29.287-.082.38.45.083c.294.07.352.176.288.469l-.738 3.468c-.194.897.105 1.319.808 1.319.545 0 1.178-.252 1.465-.598l.088-.416c-.2.176-.492.246-.686.246-.275 0-.375-.193-.304-.533L8.93 6.588zM9 4.5a1 1 0 1 1-2 0 1 1 0 0 1 2 0z"
				/>
			</svg>
		</a>
	</h1>
	<slot />
	{#if $page.route.id === '/about'}
		<button class="h-full" on:click={() => history.back()}>
			<svg
				xmlns="http://www.w3.org/2000/svg"
				fill="none"
				viewBox="0 0 24 24"
				stroke-width="1.5"
				stroke="currentColor"
				class="w-6 h-6"
			>
				<path
					stroke-linecap="round"
					stroke-linejoin="round"
					d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18"
				/>
			</svg>
		</button>
	{/if}
</div>
