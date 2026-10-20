// 头像、战徽、字体先用本地存的，同时后台向服务器核对，有更新下一次打开生效。
// GitHub Pages 只许浏览器缓存 10 分钟，过期后每张图都要等一次往返；这里免掉等待。
// 只经手这几类同站图片与字体，网页、样式、脚本和外站请求一律不管。
// 要停用：把本文件换成只有 self.addEventListener("activate", () => self.registration.unregister()); 的一行，构建发布即可。
const CACHE = "static-v1";
const CACHED = /\/(portraits|assets\/emblems|assets\/fonts)\//;

self.addEventListener("install", () => self.skipWaiting());

self.addEventListener("activate", (event) => {
  event.waitUntil(
    (async () => {
      for (const key of await caches.keys()) if (key !== CACHE) await caches.delete(key);
      await self.clients.claim();
    })(),
  );
});

self.addEventListener("fetch", (event) => {
  const req = event.request;
  if (req.method !== "GET") return;
  const url = new URL(req.url);
  if (url.origin !== location.origin || !CACHED.test(url.pathname)) return;
  event.respondWith(
    (async () => {
      const cache = await caches.open(CACHE);
      const hit = await cache.match(req);
      const fresh = fetch(req).then((res) => {
        if (res.ok) cache.put(req, res.clone());
        return res;
      });
      if (!hit) return fresh;
      event.waitUntil(fresh.catch(() => {}));
      return hit;
    })(),
  );
});
