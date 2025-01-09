const addResourcesToCache = async (resources) => {
  const cache = await caches.open('v2');
  await cache.addAll(resources);
};

const putInCache = async (request, response) => {
  const cache = await caches.open('v1');
  await cache.put(request, response);
};

const cacheFirst = async ({ request, fallbackUrl }) => {
  // First try to get the resource from the cache
  // 首先，尝试从缓存中获取资源
  const responseFromCache = await caches.match(request);
  if (responseFromCache) {
    return responseFromCache;
  }

  // Next try to use the preloaded response, if it's there
  // NOTE: Chrome throws errors regarding preloadResponse, see:
  // https://bugs.chromium.org/p/chromium/issues/detail?id=1420515
  // https://github.com/mdn/dom-examples/issues/145
  // To avoid those errors, remove or comment out this block of preloadResponse
  // code along with enableNavigationPreload() and the "activate" listener.
  // 为了防止这些错误，删除或注释掉preloadResponse代码块，以及enableNavigationPreload()和"activate"监听器。
  // const preloadResponse = await preloadResponsePromise;
  // if (preloadResponse) {
  //   console.info('using preload response', preloadResponse);
  //   putInCache(request, preloadResponse.clone());
  //   return preloadResponse;
  // }

  // Next try to get the resource from the network
  // 然后尝试从网络中获取资源
  try {
    const responseFromNetwork = await fetch(request.clone());
    // response may be used only once
    // we need to save clone to put one copy in cache
    // and serve second one
    // 响应可能会被使用，我们需要将它的拷贝放入缓存，并返回一个拷贝
    putInCache(request, responseFromNetwork.clone());
    return responseFromNetwork;
  } catch (error) {
    const fallbackResponse = await caches.match(fallbackUrl);
    if (fallbackResponse) {
      return fallbackResponse;
    }
    // when even the fallback response is not available,
    // there is nothing we can do, but we must always
    // return a Response object
    // 当回落的响应也不可用时，我们什么也做不了，但我们必须始终返回一个Response对象
    return new Response('Network error happened', {
      status: 408,
      headers: { 'Content-Type': 'text/plain' },
    });
  }
};

const enableNavigationPreload = async () => {
  if (self.registration.navigationPreload) {
    // Enable navigation preloads!
    await self.registration.navigationPreload.enable();
  }
};

self.addEventListener('activate', (event) => {
  event.waitUntil(enableNavigationPreload());
});

self.addEventListener('install', (event) => {
  event.waitUntil(
    addResourcesToCache([
      './',
      './index.html',
      './style.css',
      './app.js',
      './image-list.js',
      './star-wars-logo.jpg',
      './gallery/bountyHunters.jpg',
      './gallery/myLittleVader.jpg',
      './gallery/snowTroopers.jpg',
    ])
  );
});

self.addEventListener('fetch', (event) => {
  event.respondWith(
    cacheFirst({
      request: event.request,
      fallbackUrl: './gallery/myLittleVader.jpg',
    })
  );
});
