<script lang="ts">
	import type { ChatCompletionRequestMessageRoleEnum } from 'openai'
	import { Avatar } from '@skeletonlabs/skeleton'
	import { clipboard } from '@skeletonlabs/skeleton'
	import { fade } from 'svelte/transition'
	export let type: ChatCompletionRequestMessageRoleEnum
	export let message: string

	$: loading = message === 'Loading..'
</script>

<div
	in:fade|local={{ duration: 300 }}
	class="w-full {type === 'user' ? 'flex justify-end' : 'flex justify-start'}"
>
	<div class="badge">
		<Avatar
			rounded="rounded-full"
			width="w-8"
			initials={type === 'user' ? 'Me' : 'WZ'}
			alt="{type} avatar"
			background={type === 'user' ? 'bg-secondary-500' : 'bg-primary-500'}
		/>
	</div>

	<div
		class="chip flex max-w-full text-left whitespace-pre-line justify-center items-center text-sm sm:text-lg {type ===
		'user'
			? 'variant-ghost-secondary text-secondary-800'
			: 'variant-ghost-primary text-primary-800'}
			{loading && 'animate-pulse'}
			"
		use:clipboard={message}
	>
		{message}
	</div>
</div>
