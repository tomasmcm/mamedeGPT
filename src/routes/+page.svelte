<script lang="ts">
	import ChatMessage from '$lib/components/ChatMessage.svelte'
	import type { ChatCompletionRequestMessage } from 'openai'
	import { SSE } from 'sse.js'
	import { onMount } from 'svelte'
	import type { Snapshot } from './$types'
	import { Textarea } from '$components/ui/textarea'
	import { Button } from '$components/ui/button'

	let query: string = ''
	let answer: string = ''
	let loading: boolean = false
	let error = false
	let chatMessages: ChatCompletionRequestMessage[] = []
	let scrollToDiv: HTMLDivElement

	export const snapshot: Snapshot = {
		capture: () => {
			if (error) return
			if (!query && !chatMessages.length) return
			return {
				query,
				chatMessages
			}
		},
		restore: (captured: { query: string; chatMessages: ChatCompletionRequestMessage[] }) => {
			if (!captured) return
			query = captured.query
			chatMessages = captured.chatMessages
		}
	}

	$: query.toLocaleLowerCase() === 'clear' && handleClearConfirm()

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
				error = false
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
				error = true
				handleError(err as Error)
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
		error = true
		if (err.data) alert(JSON.parse(err.data).message)
	}

	function handleClearConfirm() {
		setTimeout(() => {
			if (confirm('Are you sure you want to clear the chat? 清楚全部吗?')) {
				chatMessages = []
				query = ''
				sessionStorage.removeItem('sveltekit:snapshot')
				return
			}
			return
		}, 100)
	}

	onMount(() => scrollToBottom())
</script>

<div class="flex flex-col justify-between pt-4 w-full h-[80vh] items-center gap-2">
	<div class="flex-grow w-full">
		<div class="h-full max-h-full w-full rounded-md px-2 py-4 overflow-y-auto flex flex-col gap-4">
			<div class="flex flex-col gap-2">
				<ChatMessage type="assistant" message="做么？" />

				{#if chatMessages && !error}
					{#each chatMessages as message}
						<ChatMessage type={message.role} message={message.content} />
					{/each}
				{/if}
				{#if answer}
					<ChatMessage type="assistant" message={answer} />
				{/if}
				{#if loading}
					<ChatMessage type="assistant" message="Loading.." />
				{/if}
			</div>
		</div>
	</div>
	<form class="w-full grid gap-2 p-4" on:submit|preventDefault={() => handleSubmit()}>
		<Textarea bind:value={query} />
		<Button type="submit">Send</Button>
		<div bind:this={scrollToDiv} />
	</form>
</div>
