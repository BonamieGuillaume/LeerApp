import { readdir, readFile, writeFile } from 'node:fs/promises'
import { createHash } from 'node:crypto'
import { join } from 'node:path'

const base = process.env.VITE_BASE_PATH || '/'
if (!/^\/(?:[A-Za-z0-9_-]+\/)*$/.test(base)) throw Error('VITE_BASE_PATH moet een pad met begin- en eindslash zijn.')
const manifest = {
  id: './', name: 'Verzekeringen Leeratelier', short_name: 'Leeratelier',
  description: 'Leren, oefenen en herhalen voor Belgische verzekeringsdistributie.',
  lang: 'nl-BE', start_url: './', scope: './', display: 'standalone',
  background_color: '#f5f7f9', theme_color: '#15364b',
  icons: [
    { src: 'icons/icon-192.png', sizes: '192x192', type: 'image/png', purpose: 'any' },
    { src: 'icons/icon-512.png', sizes: '512x512', type: 'image/png', purpose: 'any' },
    { src: 'icons/icon-maskable-512.png', sizes: '512x512', type: 'image/png', purpose: 'maskable' },
  ],
}
await writeFile('dist/manifest.webmanifest', JSON.stringify(manifest, null, 2) + '\n')
await writeFile('dist/.nojekyll', '')
async function filesAt(dir, prefix = '') {
  const files = []
  for (const entry of await readdir(dir, { withFileTypes: true })) {
    const path = prefix + entry.name
    if (entry.isDirectory()) files.push(...await filesAt(join(dir, entry.name), path + '/'))
    else if (entry.name !== 'sw.js') files.push(path)
  }
  return files.sort()
}
const files = await filesAt('dist')
const hash = createHash('sha256').update(base)
for (const file of files) hash.update(file).update(await readFile(join('dist', file)))
const version = hash.digest('hex').slice(0, 16)
const cachePrefix = 'leeratelier-offline:' + base + ':'
const worker = `// Generated from the complete build. Never clears study data.
const CACHE_PREFIX = ${JSON.stringify(cachePrefix)};
const CACHE_NAME = CACHE_PREFIX + ${JSON.stringify(version)};
const APP_BASE = new URL('./', self.location.href);
const APP_INDEX = new URL('index.html', APP_BASE).href;
const PRECACHE = ${JSON.stringify(files)}.map(path => new URL(path, APP_BASE).href);
self.addEventListener('install', event => {
  event.waitUntil(caches.open(CACHE_NAME).then(cache => cache.addAll(PRECACHE)));
});
self.addEventListener('activate', event => {
  event.waitUntil(caches.keys().then(keys => Promise.all(
    keys.filter(key => key.startsWith(CACHE_PREFIX) && key !== CACHE_NAME).map(key => caches.delete(key))
  )));
});
self.addEventListener('fetch', event => {
  const request = event.request;
  const url = new URL(request.url);
  if (request.method !== 'GET' || url.origin !== APP_BASE.origin || !url.pathname.startsWith(APP_BASE.pathname)) return;
  const isAppPage = request.mode === 'navigate' && (url.pathname === APP_BASE.pathname || url.pathname === APP_BASE.pathname + 'index.html');
  event.respondWith(caches.open(CACHE_NAME).then(async cache => {
    const stored = await cache.match(isAppPage ? APP_INDEX : request);
    return stored || fetch(request);
  }));
});
`
await writeFile('dist/sw.js', worker)
console.log(`PWA gereed: ${files.length} bestanden voor offline gebruik onder ${base} (versie ${version}).`)
