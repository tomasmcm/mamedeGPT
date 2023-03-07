<script>
	// Your selected Skeleton theme:
	import '@skeletonlabs/skeleton/themes/theme-modern.css'

	// This contains the bulk of Skeletons required styles:
	import '@skeletonlabs/skeleton/styles/all.css'

	// Finally, your application's global stylesheet (sometimes labeled 'app.css')
	import '../app.css'
</script>

<svelte:head>
	<title>亿点</title>
</svelte:head>

<div class="flex flex-col items-center max-w-4xl mx-auto">
	<slot />
</div>
