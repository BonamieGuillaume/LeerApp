import test from 'node:test'
import assert from 'node:assert/strict'
import { readFile } from 'node:fs/promises'
import vm from 'node:vm'

const base = process.env.VITE_BASE_PATH || '/'
const origin = 'https://bonamieguillaume.github.io'
const worker = await readFile('dist/sw.js', 'utf8')
const html = await readFile('dist/index.html', 'utf8')

function harness(stored = null, keys = []) {
  const handlers = {}; const deleted = []; let precache = []; let matched = null
  const cache = {
    addAll: async urls => { precache = urls },
    match: async request => { matched = typeof request === 'string' ? request : request.url; return stored },
  }
  vm.runInNewContext(worker, {
    URL, self: { location: { href: origin + base + 'sw.js' }, addEventListener: (name, handler) => { handlers[name] = handler } },
    caches: { open: async () => cache, keys: async () => keys, delete: async key => { deleted.push(key) } },
    fetch: async request => ({ network: request.url }),
  })
  return { handlers, deleted, precache: () => precache, matched: () => matched }
}

test('manifest en iPhone-iconen blijven binnen het repositorypad', async () => {
  const manifest = JSON.parse(await readFile('dist/manifest.webmanifest', 'utf8'))
  assert.equal(manifest.display, 'standalone')
  assert.equal(manifest.start_url, './'); assert.equal(manifest.scope, './')
  assert.ok(html.includes(`href="${base}manifest.webmanifest"`))
  assert.ok(html.includes(`href="${base}icons/apple-touch-icon.png"`))
  for (const icon of manifest.icons) {
    const png = await readFile('dist/' + icon.src)
    const size = Number(icon.sizes.split('x')[0])
    assert.equal(png.readUInt32BE(16), size); assert.equal(png.readUInt32BE(20), size)
    assert.ok(!icon.src.startsWith('/'))
  }
})

test('offline installatie neemt app, alle gebouwde scripts en de volledige PDF op', async () => {
  const h = harness(); let done
  h.handlers.install({ waitUntil: promise => { done = promise } }); await done
  assert.ok(h.precache().includes(origin + base + 'index.html'))
  assert.ok(h.precache().includes(origin + base + 'studiegids-module-1.pdf'))
  assert.ok(h.precache().filter(url => url.endsWith('.js')).length >= 3)
  assert.ok(h.precache().every(url => url.startsWith(origin + base)))
  assert.equal(new Set(h.precache()).size, h.precache().length)
  for (const url of h.precache()) await readFile('dist/' + url.slice((origin + base).length))
})

test('een app-update ruimt uitsluitend eigen oude offlinekopieën op', async () => {
  const prefix = 'leeratelier-offline:' + base + ':'
  const current = worker.match(/CACHE_PREFIX \+ "([a-f0-9]+)"/)[1]
  const h = harness(null, ['andere-app', 'leeratelier-offline:/andere-app/:oud', prefix + 'oud', prefix + current])
  let done; h.handlers.activate({ waitUntil: promise => { done = promise } }); await done
  assert.deepEqual(h.deleted, [prefix + 'oud'])
  assert.ok(!worker.includes('localStorage'))
  assert.ok(!worker.includes('skipWaiting'))
})

test('offline navigatie bewaart PDF-inhoud en onderschept geen andere websites of mutaties', async () => {
  const h = harness({ cached: true })
  const run = async request => { let result; h.handlers.fetch({ request, respondWith: promise => { result = promise } }); return result ? await result : undefined }
  assert.deepEqual(await run({ method: 'GET', mode: 'navigate', url: origin + base }), { cached: true })
  assert.equal(h.matched(), origin + base + 'index.html')
  await run({ method: 'GET', mode: 'navigate', url: origin + base + 'studiegids-module-1.pdf' })
  assert.equal(h.matched(), origin + base + 'studiegids-module-1.pdf')
  assert.equal(await run({ method: 'POST', url: origin + base }), undefined)
  assert.equal(await run({ method: 'GET', url: 'https://example.org/' }), undefined)
  if (base !== '/') assert.equal(await run({ method: 'GET', url: origin + '/een-andere-app/' }), undefined)
})
