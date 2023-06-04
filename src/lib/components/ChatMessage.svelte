<script lang="ts">
	import type { ChatCompletionRequestMessageRoleEnum } from 'openai'
	import { Avatar } from '$components/ui/avatar'
	import {
		Card,
		CardContent,
		CardDescription,
		CardFooter,
		CardHeader,
		CardTitle
	} from '$components/ui/card'
	import AvatarImage from './ui/avatar/AvatarImage.svelte'
	import AvatarFallback from './ui/avatar/AvatarFallback.svelte'
	export let type: ChatCompletionRequestMessageRoleEnum
	export let message: string

	$: loading = message === 'Loading..'
	$: isUser = type === 'user'
</script>

<div class="w-full {isUser ? 'flex justify-end' : 'flex justify-start'}">
	{#if type !== 'user'}
		<Avatar class="w-6 h-6">
			<AvatarImage src="/tatan.webp" alt="YD avatar" />
			<AvatarFallback>YD</AvatarFallback>
		</Avatar>
	{/if}
	<div class="rounded-md border px-4 py-3 font-mono text-sm ml-2 {isUser ? 'bg-green-200' : ''}">
		{message}
	</div>
	<!-- <Card>
		<CardContent>
			<p>{message}</p>
		</CardContent>
	</Card> -->
</div>
