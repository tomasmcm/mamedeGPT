<script>
	import { Button } from '$components/ui/button'
	let cacheWorker = null
	let cacheCleared = null

	function checkWorker () {
		if (!cacheWorker) {
			cacheWorker = new Worker(new URL('../cache.js', import.meta.url), {
				type: 'module'
			});
			
			// Attach the callback function as an event listener.
			cacheWorker.addEventListener('message', (e) => {
				console.log(e)
				switch (e.data.status) {
					case 'clear-cache-complete': {
						if (cacheCleared) cacheCleared();
						break;
					}
				}
			});
		}
	}

	async function clearCache () {
		try {
			const confirmClear = window.confirm('Are you sure you want to clear the cache? This will remove the model files stored locally.');
			if (!confirmClear) return;

			const cachePromise = new Promise((resolve, reject) => {
				cacheCleared = resolve
			})
			checkWorker();
			cacheWorker.postMessage({ type: 'clear-cache' });
			await cachePromise;

			alert('Cache cleared successfully.');
		} catch (error) {
			console.error('Failed to clear cache:', error);
			alert('Failed to clear cache.' + error.message);
		}
	}
</script>
<div class="mt-4 w-full grid place-items-center px-4">
	<p>
		This PWA offers a fully offline inference runtime with a chat model finetuned from Cerebras-GPT 111M <small>(M for million)</small>.
		<br>
		For comparison, Llama 2 is available in 7B, 13B, 70B <small>(B for billion)</small>. GPT 3.5 turbo has 20B parameters, and GPT 4 has 1.76T parameters <small>(T for trillion)</small>.
		<br>
		This model is very small in comparison, so it tends to hallucinate a lot and get confused easily. Still, it's quite amazing that we can run it on a phone.
		<br><br>
		Model: <a href="https://huggingface.co/MBZUAI/LaMini-Cerebras-111M" target="_blank">LaMini-Cerebras-111M</a><br>
		Inference: <a href="https://github.com/xenova/transformers.js" target="_blank">transformers.js</a><br>
		Runtime: <a href="https://onnxruntime.ai/" target="_blank">ONNX</a>
	</p>

	<Button on:click={clearCache} class="mt-40">
		<span class="px-20">Clear Cache</span>
	</Button>
</div>
