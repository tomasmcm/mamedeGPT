import { pipeline, env } from "@xenova/transformers";

// Specify a custom location for models (defaults to '/models/').
env.localModelPath = '/models/';
// Disable the loading of remote models from the Hugging Face Hub:
env.allowRemoteModels = false;
// Set location of .wasm files. Defaults to use a CDN.
// env.backends.onnx.wasm.wasmPaths = '/path/to/files/';

// Use the Singleton pattern to enable lazy construction of the pipeline.
class PipelineSingleton {
  // static task = 'text-generation';
  // static model = 'Xenova/gpt2-large-conversational';
  // static task = 'text2text-generation';
  // static model = 'Xenova/LaMini-Flan-T5-783M';
  // static task = 'text-generation';
  // static model = 'Xenova/WizardCoder-1B-V1-0';
  // static task = 'text-generation';
  // static model = 'Custom/LaMini-Cerebras-111M';
  // static task = 'text-generation';
  // static model = 'Xenova/really-tiny-falcon-testing';
  // static task = 'text2text-generation';
  // static model = 'Xenova/blenderbot_small-90M';
  // static task = 'text-generation';
  // static model = 'Xenova/tiny-random-falcon-7b';

  static task = 'text-generation';
  static model = 'Xenova/LaMini-Cerebras-111M';
  // static task = 'text-generation';
  // static model = 'Xenova/LaMini-GPT-124M';
  // static task = 'text-generation';
  // static model = 'Xenova/LaMini-Neo-125M';

  // static task = 'text2text-generation';
  // static model = 'Xenova/LaMini-T5-61M';
  // static task = 'text2text-generation';
  // static model = 'Xenova/LaMini-Flan-T5-77M';
  // static task = 'text-generation';
  // static model = 'Xenova/pythia-70m-deduped';
  // static task = 'text-generation';
  // static model = 'Felladrin/onnx-zephyr-smol_llama-100m-dpo-full';
  
  static instance = null;
  
  static async getInstance(progress_callback = null) {
    if (this.instance === null) {
      this.instance = pipeline(this.task, this.model, { progress_callback });
    }
    return this.instance;
  }
}

// Listen for messages from the main thread
self.addEventListener('message', async (event) => {
  return inference(event);
});

async function inference (event) {
  // Retrieve the classification pipeline. When called for the first time,
  // this will load the pipeline and save it for future use.
  let generator = await PipelineSingleton.getInstance(x => {
    // We also add a progress callback to the pipeline so that we can
    // track model loading.
    self.postMessage(x);
  });
  
  // Actually perform the classification
  let output = await generator(event.data.text, {
    "temperature": 0.8,
    "top_p": 0.95,
    "repetition_penalty": 1.2,
    "top_k": 50,
    "truncate": 1000,
    // "eos_token_id": 1,
    "max_new_tokens": 100, // Set the maximum number of new tokens for the generated text
    callback_function: (e) => {
      // console.log(e)
      self.postMessage({
        status: "update",
        output: generator.tokenizer.decode(e[0].output_token_ids, { skip_special_tokens: true })
      });
    }
  });
  
  // Send the output back to the main thread
  self.postMessage({
    status: 'complete',
    output: output,
  });
}