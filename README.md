# MamedeGPT

<h4 class="font-semibold">Game Objective</h4>
Your goal in this game is to try to guess the secret word through our conversation. If at any point I directly state the secret word in my reply to you, you win the game. However, not even I know what the secret word is! Only my creator (you secret gifter) knows.
<br><br>
<h4 class="font-semibold">How to Play</h4>
Simply chat with me naturally, asking questions or making statements. I will reply to your questions and comments. If I reply the secret word, you win!
<br><br>
BTW, I'm running 100% on this device, once the model is loaded you can disable your internet connection and I'll continue working. I'm not a very advanced model, so bear with me.
<br><br>
For the best experience, open in <b>Safari</b>, click the <b>share</b> button, and "<b>Add to Home Screen</b>".
<br><br>

This PWA offers a fully offline inference runtime with a chat model finetuned from Cerebras-GPT 111M <small>(M for million)</small>.
<br>
For comparison, Llama 2 is available in 7B, 13B, 70B <small>(B for billion)</small>. GPT 3.5 turbo has 20B parameters, and GPT 4 has 1.76T parameters <small>(T for trillion)</small>.
<br>
This model is very small in comparison, so it tends to hallucinate a lot and get confused easily. Still, it's quite amazing that we can run it on a phone.
<br><br>
Model: <a href="https://huggingface.co/MBZUAI/LaMini-Cerebras-111M" target="_blank">LaMini-Cerebras-111M</a><br>
Inference: <a href="https://github.com/xenova/transformers.js" target="_blank">transformers.js</a><br>
Runtime: <a href="https://onnxruntime.ai/" target="_blank">ONNX</a>


## Developing

Once you've created a project and installed dependencies with `npm install` (or `pnpm install` or `yarn`), start a development server:

```bash
npm run dev

# or start the server and open the app in a new browser tab
npm run dev -- --open
```

## Building

To create a production version of your app:

```bash
npm run build
```

You can preview the production build with `npm run preview`.

> To deploy your app, you may need to install an [adapter](https://kit.svelte.dev/docs/adapters) for your target environment.
