<script lang="ts">
	import '../app.postcss'
	import { page } from '$app/stores'
	import { pwaInfo } from 'virtual:pwa-info'
	import { Button } from '$components/ui/button'
	import { onMount } from 'svelte'
	import InstallPrompt from '$components/InstallPrompt.svelte'
	import { chatMessages, query } from '$lib/utils'

	$: webManifestLink = pwaInfo ? pwaInfo.webManifest.linkTag : ''

	let ReloadPrompt: typeof import('$lib/components/ReloadPrompt.svelte')['default'] | null = null
	let deferredPrompt: any
	let pwaInstallable = false
	let pwaInstalled = false

	// onMount(async () => {
	// 	pwaInfo && (ReloadPrompt = (await import('$lib/components/ReloadPrompt.svelte')).default)

	// 	window.addEventListener('DOMContentLoaded', async (event) => {
	// 		if ('BeforeInstallPromptEvent' in window) {
	// 			console.log('⏳ BeforeInstallPromptEvent supported but not fired yet')
	// 		} else {
	// 			console.log('❌ BeforeInstallPromptEvent NOT supported')
	// 		}
	// 	})

	// 	window.addEventListener('beforeinstallprompt', (e) => {
	// 		// Prevents the default mini-infobar or install dialog from appearing on mobile
	// 		e.preventDefault()
	// 		// Save the event because you’ll need to trigger it later.
	// 		deferredPrompt = e
	// 		pwaInstallable = true
	// 		// Show your customized install prompt for your PWA
	// 		console.log('✅ BeforeInstallPromptEvent fired', true)
	// 	})

	// 	window.addEventListener('appinstalled', (e) => {
	// 		pwaInstalled = true
	// 		console.log('✅ AppInstalled fired', true)
	// 	})
	// })

	function handleClearConfirm() {
		const confirm = window.confirm('Are you sure you want to clear the chat?')
		if (!confirm) return
		chatMessages.set([])
		query.set('')
		sessionStorage.removeItem('sveltekit:snapshot')
	}
</script>

<svelte:head>
	<title>🎁 💬</title>
	<!-- {@html webManifestLink} -->
</svelte:head>

<div class="h-full flex flex-col items-center max-w-4xl mx-auto">
	<div class="text-2xl font-bold p-4 flex items-center justify-between w-full">
		{#if $page.route.id === '/about'}
			<Button href="/" variant="secondary">
				<svg
					xmlns="http://www.w3.org/2000/svg"
					width="16"
					height="16"
					fill="none"
					viewBox="0 0 24 24"
					stroke-width="1.5"
					stroke="currentColor"
				>
					<path
						stroke-linecap="round"
						stroke-linejoin="round"
						d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18"
					/>
				</svg>
				<span class="ml-2">Back</span>
			</Button>
		{:else}
			<Button href="/about" variant="secondary">
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
				<span class="ml-2">About</span>
			</Button>
		{/if}
		<h1>🎁 💬</h1>
		{#if $page.route.id != '/about'}
			<div class="flex">
				{#if pwaInstallable && !pwaInstalled}
					<InstallPrompt {deferredPrompt} />
				{/if}
				<Button on:click={handleClearConfirm} variant="secondary">
					<svg
					xmlns="http://www.w3.org/2000/svg"
					width="16"
					height="16"
					fill="none"
					viewBox="0 0 24 24"
					stroke-width="1.5"
					stroke="currentColor"
					>
						<path
						stroke-linecap="round"
						stroke-linejoin="round"
						d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0"
						/>
					</svg>
					<span class="ml-2">Restart</span>
				</Button>
		</div>
		{:else}
			<span class="w-20"/>
		{/if}
	</div>
	<slot />
</div>

{#if ReloadPrompt}
	<svelte:component this={ReloadPrompt} />
{/if}
