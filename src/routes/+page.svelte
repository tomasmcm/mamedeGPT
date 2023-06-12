<script lang="ts">
	import ChatMessage from '$lib/components/ChatMessage.svelte'
	import type { ChatCompletionRequestMessage } from 'openai'
	import { SSE } from 'sse.js'
	import { onMount } from 'svelte'
	import type { Snapshot } from './$types'
	import { Textarea } from '$components/ui/textarea'
	import { Button } from '$components/ui/button'
	import {
		AlertDialog,
		AlertDialogAction,
		AlertDialogCancel,
		AlertDialogContent,
		AlertDialogDescription,
		AlertDialogFooter,
		AlertDialogHeader,
		AlertDialogTitle
	} from '$components/ui/alert-dialog'

	let query: string = ''
	let answer: string = ''
	let loading: boolean = false
	let error = false
	let openAlert = false
	let openAlertTitle = ''
	let openAlertDescription = ''
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
		if (err.data) prompt('Opps', err.data)
		else promptAlert('Opps', 'Something went wrong')
	}

	function handleClearConfirm() {
		const confirm = window.confirm('Are you sure you want to clear the chat?')
		if (!confirm) return
		chatMessages = []
		query = ''
		sessionStorage.removeItem('sveltekit:snapshot')
	}

	function promptAlert(title: string, description: string) {
		openAlert = true
		openAlertTitle = title
		openAlertDescription = description
	}

	onMount(() => scrollToBottom())
</script>

<AlertDialog bind:open={openAlert}>
	<AlertDialogContent>
		<AlertDialogHeader>
			<AlertDialogTitle>{openAlertTitle}</AlertDialogTitle>
			<AlertDialogDescription>
				{openAlertDescription}
			</AlertDialogDescription>
		</AlertDialogHeader>
		<AlertDialogFooter>
			{#if openAlertTitle.toUpperCase() === 'CLEAR CHAT'}
				<!-- TODO: Event not working -->
				<AlertDialogCancel on:click={handleClearCancel}>
					<span>Cancel</span>
				</AlertDialogCancel>
				<AlertDialogAction on:click={handleClearConfirm}>
					<span>Clear</span>
				</AlertDialogAction>
			{:else}
				<AlertDialogAction>Okay</AlertDialogAction>
			{/if}
		</AlertDialogFooter>
	</AlertDialogContent>
</AlertDialog>
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
		<Textarea bind:value={query} required />
		<Button type="submit">Send</Button>
		<div bind:this={scrollToDiv} />
	</form>
	<button on:click={handleClearConfirm}>
		<svg
			xmlns="http://www.w3.org/2000/svg"
			fill="none"
			viewBox="0 0 24 24"
			stroke-width="1.5"
			stroke="currentColor"
			class="w-6 h-6"
		>
			<path
				stroke-linecap="round"
				stroke-linejoin="round"
				d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0"
			/>
		</svg>
	</button>
</div>
