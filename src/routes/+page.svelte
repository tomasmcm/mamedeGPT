<script lang="ts">
	import ChatMessage from '$lib/components/ChatMessage.svelte'
	import type { ChatCompletionRequestMessage } from 'openai'
	import { SSE } from 'sse.js'

	let query: string = ''
	let answer: string = ''
	let loading: boolean = false
	let chatMessages: ChatCompletionRequestMessage[] = []
	let scrollToDiv: HTMLDivElement

	function scrollToBottom() {
		setTimeout(function () {
			scrollToDiv.scrollIntoView({ behavior: 'smooth', block: 'end', inline: 'nearest' })
		}, 100)
	}

	const handleSubmit = async () => {
		loading = true
		chatMessages = [...chatMessages, { role: 'user', content: query }]

		const eventSource = new SSE('/api/chat', {
			headers: {
				'Content-Type': 'application/json'
			},
			payload: JSON.stringify({ messages: chatMessages })
		})

		query = ''

		eventSource.addEventListener('error', handleError)

		eventSource.addEventListener('message', (e) => {
			scrollToBottom()
			try {
				loading = false
				if (e.data === '[DONE]') {
					chatMessages = [...chatMessages, { role: 'assistant', content: answer }]
					answer = ''
					return
				}

				const completionResponse = JSON.parse(e.data)
				const [{ delta }] = completionResponse.choices

				if (delta.content) {
					answer = (answer ?? '') + delta.content
				}
			} catch (err) {
				handleError(err)
			}
		})
		eventSource.stream()
		scrollToBottom()
	}

	function handleError<T>(err: T & { data?: string }) {
		loading = false
		query = ''
		answer = ''
		console.error(err)
		if (err.data) alert(JSON.parse(err.data).message)
	}
</script>

<div class="flex flex-col justify-between pt-4 w-full  items-center gap-2">
	<div class="h-[90%] w-full">
		<div>
			<h1 class="text-2xl font-bold w-full text-center">wangze聊天框</h1>
			<p class="text-sm text-surface-300 text-center italic">Powered by gpt-3.5-turbo</p>
		</div>
		<div
			class="h-[70vh] max-h-full w-full rounded-md px-2 py-4 overflow-y-auto flex flex-col gap-4"
		>
			<div class="flex flex-col gap-2">
				<ChatMessage type="assistant" message="yo,问点什么吗？" />
				{#each chatMessages as message}
					<ChatMessage type={message.role} message={message.content} />
				{/each}
				{#if answer}
					<ChatMessage type="assistant" message={answer} />
				{/if}
				{#if loading}
					<ChatMessage type="assistant" message="Loading.." />
				{/if}
			</div>
			<div class="" bind:this={scrollToDiv} />
		</div>
	</div>
	<form class="flex w-full rounded-md gap-4 p-4" on:submit|preventDefault={() => handleSubmit()}>
		<div class="input-group input-group-divider grid-cols-[1fr_auto]">
			<input type="text" class="input px-4" bind:value={query} />
			<button type="submit" class="btn variant-filled-primary"> Send </button>
		</div>
	</form>
</div>
