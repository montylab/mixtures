const KEY = 'mixtures-cache-v1'

self.addEventListener('install', (event) => {
	event.waitUntil(self.skipWaiting())
})

self.addEventListener('message', (event) => {
	if (event.data.type === 'CACHE_URLS') {
		event.waitUntil(
			caches.open(KEY)
				.then( (cache) => {
					console.log(event.data.payload)
					return cache.addAll(event.data.payload);
				})
		);
	}
})

self.addEventListener('fetch', function (event) {
	event.respondWith(
		caches.open(KEY).then(cache => {
			fetch(event.request).then((response) => {
				if (event.request.method === 'GET') {
					cache.put(event.request, response.clone())
				}
				return response.clone()
			}).catch()

			return caches.match(event.request)
		})
	)
})