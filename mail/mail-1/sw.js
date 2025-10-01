// Service Worker 版本
const CACHE_VERSION = 'mail-app-v1';
const CACHE_NAME = CACHE_VERSION + '-assets';

// 需要缓存的资源列表
const CACHE_ASSETS = [
    '/index.html',
    '/letter.html',
    '/style.css',
    '/letter.css',
    '/sw.js'
];

// 安装阶段：缓存静态资源
self.addEventListener('install', (event) => {
    // 确保service worker在缓存完成后才会安装完成
    event.waitUntil(
        caches.open(CACHE_NAME)
            .then((cache) => {
                console.log('开始缓存资源');
                // 使用addAll缓存所有资源
                return cache.addAll(CACHE_ASSETS);
            })
            .then(() => {
                // 跳过等待阶段，立即激活新的service worker
                return self.skipWaiting();
            })
    );
});

// 激活阶段：清理旧缓存
self.addEventListener('activate', (event) => {
    // 确保新的service worker接管所有客户端
    event.waitUntil(
        Promise.all([
            // 使service worker立即对所有客户端生效
            self.clients.claim(),
            // 清理旧缓存
            caches.keys().then((cacheNames) => {
                return Promise.all(
                    cacheNames.map((cacheName) => {
                        // 删除旧版本的缓存
                        if (cacheName !== CACHE_NAME && cacheName.startsWith(CACHE_VERSION.split('-')[0])) {
                            console.log('删除旧缓存:', cacheName);
                            return caches.delete(cacheName);
                        }
                    })
                );
            })
        ])
    );
});

// 拦截网络请求并尝试从缓存中响应
self.addEventListener('fetch', (event) => {
    // 仅处理GET请求
    if (event.request.method !== 'GET') return;
    
    // 对于HTML页面，优先从网络获取新内容，但同时也从缓存提供旧内容
    if (event.request.headers.get('accept').includes('text/html')) {
        event.respondWith(
            fetch(event.request)
                .then((response) => {
                    // 克隆响应，因为响应只能使用一次
                    const responseClone = response.clone();
                    // 将新的响应存入缓存
                    caches.open(CACHE_NAME)
                        .then((cache) => {
                            cache.put(event.request, responseClone);
                        });
                    return response;
                })
                .catch(() => {
                    // 网络请求失败时，从缓存中获取
                    return caches.match(event.request).then((cachedResponse) => {
                        return cachedResponse || caches.match('/index.html');
                    });
                })
        );
        return;
    }
    
    // 对于其他资源，优先从缓存中获取
    event.respondWith(
        caches.match(event.request)
            .then((cachedResponse) => {
                // 如果缓存中有匹配的响应，直接返回
                if (cachedResponse) {
                    return cachedResponse;
                }
                
                // 否则，从网络请求资源
                return fetch(event.request)
                    .then((response) => {
                        // 克隆响应，因为响应只能使用一次
                        const responseClone = response.clone();
                        // 将响应存入缓存以供将来使用
                        caches.open(CACHE_NAME)
                            .then((cache) => {
                                cache.put(event.request, responseClone);
                            });
                        return response;
                    })
                    .catch((error) => {
                        console.log('获取资源失败:', error);
                    });
            })
    );
});

// 监听消息事件，可以从页面发送消息到service worker
self.addEventListener('message', (event) => {
    if (event.data === 'skipWaiting') {
        self.skipWaiting();
    }
});