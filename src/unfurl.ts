/**
 * Real product photos come from the brand's own product page: the same image a
 * WhatsApp or iMessage link preview shows (og:image). On iOS/Android the app fetches
 * the page directly. On the web most brand sites block cross-origin reads, so the
 * optional EXPO_PUBLIC_UNFURL_URL (supabase/functions/unfurl) does the fetch instead.
 */
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Platform } from 'react-native';

const PROXY = process.env.EXPO_PUBLIC_UNFURL_URL; // e.g. https://xyz.supabase.co/functions/v1/unfurl
const KEY = 'persona.unfurl.v1';
const mem = new Map<string, string | null>();
let disk: Record<string, string | null> | null = null;

async function loadDisk() {
  if (disk) return disk;
  try { disk = JSON.parse((await AsyncStorage.getItem(KEY)) ?? '{}'); } catch { disk = {}; }
  return disk!;
}
async function remember(url: string, img: string | null) {
  mem.set(url, img);
  const d = await loadDisk(); d[url] = img;
  try { await AsyncStorage.setItem(KEY, JSON.stringify(d)); } catch {}
}

export function pickImage(html: string, base: string): string | null {
  const metas = [...html.matchAll(/<meta\s+[^>]*>/gi)].map((m) => m[0]);
  const read = (m: string, attr: string) => (m.match(new RegExp(`${attr}\\s*=\\s*["']([^"']+)["']`, 'i')) ?? [])[1];
  const want = ['og:image:secure_url', 'og:image', 'twitter:image', 'twitter:image:src'];
  for (const w of want) {
    for (const m of metas) {
      const p = read(m, 'property') ?? read(m, 'name');
      if (p && p.toLowerCase() === w) { const c = read(m, 'content'); if (c) return abs(c, base); }
    }
  }
  const link = html.match(/<link\s+[^>]*rel=["']image_src["'][^>]*href=["']([^"']+)["']/i);
  if (link) return abs(link[1], base);
  return null;
}
function abs(u: string, base: string) {
  if (u.startsWith('//')) return 'https:' + u;
  if (u.startsWith('http')) return u.replace(/^http:/, 'https:');
  try { return new URL(u, base).toString(); } catch { return u; }
}

export async function unfurlImage(url: string): Promise<string | null> {
  if (!url) return null;
  if (mem.has(url)) return mem.get(url)!;
  const d = await loadDisk();
  if (url in d) { mem.set(url, d[url]); return d[url]; }
  let img: string | null = null;
  try {
    const ctrl = new AbortController();
    const t = setTimeout(() => ctrl.abort(), 8000);
    if (Platform.OS === 'web') {
      if (PROXY) {
        const r = await fetch(`${PROXY}?url=${encodeURIComponent(url)}`, { signal: ctrl.signal });
        const j = await r.json();
        img = j.image ?? null;
      }
    } else {
      const r = await fetch(url, { signal: ctrl.signal, headers: { 'User-Agent': 'Mozilla/5.0 (iPhone; CPU iPhone OS 17_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.0 Mobile/15E148 Safari/604.1', Accept: 'text/html' } });
      const html = await r.text();
      img = pickImage(html.slice(0, 300_000), url);
    }
    clearTimeout(t);
  } catch { img = null; }
  await remember(url, img);
  return img;
}
