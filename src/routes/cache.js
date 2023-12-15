self.addEventListener('message', async (event) => {
  return clearCache(event);
});

async function clearCache (event) {
  const cache = await caches.open("transformers-cache");
  const keys = await cache.keys();
  await Promise.all(keys.map((key) => cache.delete(key)));

  self.postMessage({
    status: 'clear-cache-complete'
  });
}