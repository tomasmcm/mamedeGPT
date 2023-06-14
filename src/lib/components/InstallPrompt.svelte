<script lang="ts">
	import { Button } from './ui/button'

	export let deferredPrompt: any

	async function installApp() {
		if (deferredPrompt) {
			deferredPrompt.prompt()
			console.log('🆗 Installation Dialog opened')
			// Find out whether the user confirmed the installation or not
			const { outcome } = await deferredPrompt.userChoice
			// The deferredPrompt can only be used once.
			deferredPrompt = null
			// Act on the user's choice
			if (outcome === 'accepted') {
				console.log('😀 User accepted the install prompt.', true)
			} else if (outcome === 'dismissed') {
				console.log('😟 User dismissed the install prompt')
			}
			// We hide the install button
		}
	}
</script>

<Button on:click={installApp} variant="secondary" class="ml-auto mx-4">Install</Button>
