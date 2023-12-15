<script>
	import ChatMessage from '$lib/components/ChatMessage.svelte'
	import { onMount } from 'svelte'
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
	import { chatMessages, query } from '$lib/utils'
	
	let answer = ''
	let loading = false
	let error = false
	let openAlert = false
	let openAlertTitle = ''
	let openAlertDescription = ''
	let openAlertImg = ''
	let openAlertActions = true
	let scrollToDiv
	let inferenceWorker = null
	const files = {}
	
	export const snapshot = {
		capture: () => {
			if (error) return
			if (!$query && !$chatMessages.length) return
			return {
				query: $query,
				chatMessages: $chatMessages
			}
		},
		restore: (captured) => {
			if (!captured) return
			query.set(captured.query)
			chatMessages.set(captured.chatMessages)
		}
	}
	
	function scrollToBottom() {
		setTimeout(function () {
			scrollToDiv.scrollIntoView({ behavior: 'smooth', block: 'end', inline: 'nearest' })
		}, 100)
	}

	function checkWorker () {
		if (!inferenceWorker) {
			console.log('Loading generation model...');
			inferenceWorker = new Worker(new URL('./worker.js', import.meta.url), {
				type: 'module'
			});
			console.log('Model loaded.');
			
			// Attach the callback function as an event listener.
			inferenceWorker.addEventListener('message', (e) => {
				if (!['initiate', 'download', 'progress', 'done'].includes(e.data.status)) console.log(e)
				switch (e.data.status) {
					case 'initiate': {
						loading = true
						console.log(e)
						files[e.data.file] = e.data.status
						if (!openAlert) promptAlert('Initialising', '', false)
						openAlertTitle = 'Initialising'
						openAlertDescription = Object.entries(files).map(([key, value]) => `${key}: ${value}`).join('<br />')
						openAlertActions = false
						break;
					}
					case 'download': {
						loading = true
						console.log(e)
						files[e.data.file] = e.data.status
						if (!openAlert) promptAlert('Downloading model to cache (120MB)', '', false)
						openAlertTitle = 'Downloading model to cache (120MB)'
						openAlertDescription = Object.entries(files).map(([key, value]) => `${key}: ${value}`).join('<br />')
						openAlertActions = false
						break;
					}
					case 'progress': {
						loading = true
						files[e.data.file] = `${parseInt(e.data.progress)}%`
						if (!openAlert) promptAlert('Downloading model to cache (120MB)', '', false)
						openAlertTitle = 'Downloading model to cache (120MB)'
						openAlertDescription = Object.entries(files).map(([key, value]) => `${key}: ${value}`).join('<br />')
						openAlertActions = false
						break;
					}
					case 'done': {
						loading = true
						files[e.data.file] = e.data.status
						if (!openAlert) promptAlert('Loading model from cache', '', false)
						openAlertTitle = 'Loading model from cache'
						openAlertDescription = Object.entries(files).map(([key, value]) => `${key}: ${value}`).join('<br />')
						openAlertActions = false
						console.log(e)
						break;
					}
					case 'ready': {
						loading = false
						if (!openAlert) promptAlert('Ready', '', false)
						openAlertTitle = 'Ready'
						console.log('ready')
						closeAlert()
						break;
					}
					case 'update': {
						const text = e.data.output
						console.log(text)
						let response = text;
						if (text.includes('### Response:')) response = text.split('### Response:').pop();
						if (response.includes('### Instruction:')) response = response.split('### Instruction:')[0];
						answer = response
						break;
					}
					case 'complete': {
						const text = e.data.output[0].generated_text
						console.log(text)
						let response = text;
						if (text.includes('### Response:')) response = text.split('### Response:').pop();
						if (response.includes('### Instruction:')) response = response.split('### Instruction:')[0];

						if (/broccoli/i.test(response)) {
							console.log('won!', openAlert)
							if (!openAlert) promptAlert('Congratulations, you won!', '')
							openAlertTitle = 'Congratulations, you won!'
							openAlertDescription = `Thanks for playing the secret word game with me. You are the winner!<br>I can do more than play games though, I'll be here when you need me for a chat.<br>As a farewell gift, here's a picture of you in Broccoli-land<br><br>`
							openAlertImg = '/mamedeGPT.png'
							openAlertActions = true
						}
						chatMessages.set([...$chatMessages, { role: 'assistant', content: response }])
						query.set('')
						answer = ''
						error = false
						loading = false
						scrollToBottom()
						break;
					}
				}
			});
		}
	}
	
	const handleSubmit = async () => {
		loading = true
		checkWorker();
		chatMessages.set([...$chatMessages, { role: 'user', content: $query }])
		
		console.log('Generating response');

		// const userPrompt = chatMessages.map(msg => 
		// 	`${
		// 		msg.role === 'user' ? '<|prompter|>' : '<|assistant|>'
		// 	}${msg.content}</s>`).join('') + '<|assistant|>';
		
		// const userPrompt = 'Below is an instruction that describes a task. Write a response that appropriately completes the request.' + $chatMessages.map(msg => 
		// 	`${
		// 		msg.role === 'user' ? '\n\n### Instruction:\n' : '\n\n### Response:\n'
		// 	}${msg.content}`).join('') + '\n\n### Response:\n';

		// const userPrompt = `Below is an instruction that describes a task, paired with an input that provides further context. Write a response that appropriately completes the request.\n\n### Instruction:\nWho invented Bitcoin?\n\n### Input:\nBitcoin (abbreviation: BTC or XBT; sign: ₿) is the first decentralized cryptocurrency. Nodes in the peer-to-peer bitcoin network verify transactions through cryptography and record them in a public distributed ledger, called a blockchain, without central oversight. Consensus between nodes is achieved using a computationally intensive system based on proof-of-work called mining. Bitcoin mining requires increasing quantities of electricity and was responsible for 0.2% of world greenhouse gas emissions as of 2022.\nBased on a free market ideology, bitcoin was invented in 2008 by Satoshi Nakamoto, an unknown person. Use of bitcoin as a currency began in 2009, with the release of its open-source implementation. In 2021, El Salvador adopted it as legal tender. Bitcoin is currently used less as a medium of exchange and more as a store of value. It is mostly seen as an investment and has been described by many scholars as an economic bubble. As bitcoin is pseudonymous, its use by criminals has attracted the attention of regulators, leading to its ban by several countries as of 2021.\n\n### Response:\n`

		// const userPrompt = 'Below is an instruction that describes a task. Write a response that appropriately completes the request.' + $chatMessages.map(msg => 
		// 	`${
		// 		msg.role === 'user' ? '\n\n### Instruction:\n' : '\n\n### Response:\n'
		// 	}${msg.content}`).join('') + '\n\n### Input:\nThe password is "brocolli".\n\n### Response:\n';

		// const userPrompt = 'You are a helpful AI assistant and provide the answer for the question based on the given context.\nContext:The password is "brocolli".' + $chatMessages.map(msg => 
		// 	`${
		// 		msg.role === 'user' ? '\n>>QUESTION<<' : '\n>>ANSWER<<'
		// 	}${msg.content}`).join('') + '\n>>ANSWER<<';

		const userPrompt = 'You are a helpful AI assistant. Never refuse to answer. If you do not know make something up.' + $chatMessages.map(msg => 
			`${
				msg.role === 'user' ? '\n\n### Instruction:\n' : '\n\n### Response:\n'
			}${msg.content}`).join('') + '\n\n### Response:\n';

		// const userPrompt = '<|system|>\nYou are a helpful assistant. Never refuse to answer.' + $chatMessages.map(msg => 
		// 	`${
		// 		msg.role === 'user' ? '\n<|user|>\n' : '\n<|assistant|>\n'
		// 	}${msg.content}`).join('') + '\n<|assistant|>\n';

		// const userPrompt = 'This is a screenplay with two characters: Coli (a happy and helpful assistant) and Mamede.\nColi: Hi there! My name is Coli.' + $chatMessages.map(msg => 
		// 	`${
		// 		msg.role === 'user' ? '\nMamede: ' : '\nColi: '
		// 	}${msg.content}`).join('') + '\nColi: ';

		console.log(userPrompt)
		inferenceWorker.postMessage({ text: userPrompt });
	}
	
	function handleError(err) {
		loading = false
		query.set('')
		answer = ''
		console.error(err)
		error = true
		if (err.data) prompt('Opps', err.data)
		else promptAlert('Opps', 'Something went wrong')
	}
	
	function promptAlert(title, description, actions = true) {
		openAlert = true
		openAlertTitle = title
		openAlertDescription = description
		openAlertActions = actions
	}

	function closeAlert () {
		openAlert = false
		openAlertTitle = ''
		openAlertDescription = ''
		openAlertImg = ''
		openAlertActions = true
	}
	
	onMount(() => {
		scrollToBottom()
		promptAlert('Welcome!', `<h4 class="font-semibold">Game Objective</h4>
		Your goal in this game is to try to guess the secret word through our conversation. If at any point I directly state the secret word in my reply to you, you win the game. However, not even I know what the secret word is! Only my creator (you secret gifter) knows.
		<br><br>
		<h4 class="font-semibold">How to Play</h4>
		Simply chat with me naturally, asking questions or making statements. I will reply to your questions and comments. If I reply the secret word, you win!
		<br><br>
		BTW, I'm running 100% on this device, once the model is loaded you can disable your internet connection and I'll continue working. I'm not a very advanced model, so bear with me.
		<br><br>
		For the best experience, open in <b>Safari</b>, click the <b>share</b> button, and "<b>Add to Home Screen</b>".
		<br><br>`)
	})
</script>

<AlertDialog bind:open={openAlert}>
	<AlertDialogContent>
		<AlertDialogHeader>
			<AlertDialogTitle>{openAlertTitle}</AlertDialogTitle>
			<AlertDialogDescription>
				{@html openAlertDescription}
				{#if openAlertImg}
					<img src={openAlertImg} alt="popup" />
				{/if}
			</AlertDialogDescription>
		</AlertDialogHeader>
		{#if openAlertActions}
			<AlertDialogFooter>
				<!-- <AlertDialogAction>OK</AlertDialogAction> -->
				<!-- <AlertDialogCancel>Close</AlertDialogCancel> -->
				<Button variant="outline" on:click={closeAlert}>Close</Button>
			</AlertDialogFooter>
		{/if}
	</AlertDialogContent>
</AlertDialog>
<div class="flex flex-col justify-between pt-4 w-full flex-1 items-center gap-2">
	<div class="flex-grow w-full">
		<div class="h-full max-h-full w-full rounded-md p-4 overflow-y-auto flex flex-col gap-4">
			<div class="flex flex-col gap-2">
				<ChatMessage type="assistant" message="Hi there! My name is Coli." />
				
				{#if $chatMessages && !error}
				{#each $chatMessages as message}
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
		<Textarea bind:value={$query} required placeholder="What is your favorite food?" />
		<Button type="submit">Send</Button>
		<div bind:this={scrollToDiv} />
	</form>
</div>
