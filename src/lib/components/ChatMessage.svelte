<script lang="ts">
	import type { ChatCompletionRequestMessageRoleEnum } from 'openai'
	import { Avatar } from '$components/ui/avatar'
	import { Skeleton } from '$components/ui/skeleton'
	import AvatarImage from './ui/avatar/AvatarImage.svelte'
	import AvatarFallback from './ui/avatar/AvatarFallback.svelte'
	export let type: ChatCompletionRequestMessageRoleEnum
	export let message: string

	$: loading = message === 'Loading..'
	$: isUser = type === 'user'
</script>

<div class="flex space-x-2 {isUser ? 'flex justify-end' : 'flex justify-start'}">
	{#if type !== 'user'}
		<Avatar class="w-6 h-6">
			<AvatarImage src="/tatan.webp" alt="YD avatar" />
			<AvatarFallback>YD</AvatarFallback>
		</Avatar>
	{/if}
	{#if loading}
		<div class="space-y-2">
			<Skeleton class="h-4 w-[250px]" />
			<Skeleton class="h-4 w-[200px]" />
		</div>
	{:else}
		<p
			class="rounded-md border px-4 py-3 text-sm  transition-colors duration-500 {isUser
				? 'bg-green-200'
				: 'hover:bg-gray-100'}"
		>
			{message}
		</p>
	{/if}
</div>
