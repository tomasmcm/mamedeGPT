<script>
	import { Avatar } from '$components/ui/avatar'
	import { Skeleton } from '$components/ui/skeleton'
	import AvatarImage from './ui/avatar/AvatarImage.svelte'
	import AvatarFallback from './ui/avatar/AvatarFallback.svelte'
	import { marked } from 'marked'
	import DOMPurify from 'isomorphic-dompurify'

	export let type
	export let message

	$: loading = message === 'Loading..'
	$: isUser = type === 'user'
</script>

<div class="flex items-center {isUser ? 'flex-row-reverse justify-start' : 'flex justify-start'}">
		<Avatar class="w-6 h-6">
			{#if isUser}
				<AvatarImage src="/mamede.png" alt="Mamede" />
				<AvatarFallback>Mamede</AvatarFallback>
			{:else}
				<AvatarImage src="/bot.jpg" alt="Coli" />
				<AvatarFallback>Coli</AvatarFallback>
			{/if}
		</Avatar>
	{#if loading}
		<div class="space-y-2">
			<Skeleton class="h-4 w-[250px]" />
			<Skeleton class="h-4 w-[200px]" />
		</div>
	{:else}
		<p
			class="rounded-md border px-4 py-3 text-sm mx-2 transition-colors duration-500 {isUser
				? 'bg-lime-100 hover:bg-lime-200'
				: 'hover:bg-gray-100'}"
		>
			{@html DOMPurify.sanitize(marked.parse(message))}
		</p>
	{/if}
</div>
