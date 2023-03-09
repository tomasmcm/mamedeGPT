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
	<h1 class="text-2xl font-bold w-full text-center py-4 flex items-center justify-between">
		<span />
		<span class="col-auto  "> 1dian聊天框 </span>
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
</div>
