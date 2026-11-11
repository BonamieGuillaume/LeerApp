/** Public files must stay inside the app's deployment directory on GitHub Pages. */
export function publicUrl(path: string): string {
  if (/^(https?:|data:|blob:)/i.test(path)) return path
  return import.meta.env.BASE_URL + path.replace(/^\/+/, '')
}
