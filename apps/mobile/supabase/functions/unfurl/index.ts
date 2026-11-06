// Supabase Edge Function: returns the share image (og:image) of a product page.
// Deploy: supabase functions deploy unfurl --no-verify-jwt
// Then set EXPO_PUBLIC_UNFURL_URL=https://<project>.supabase.co/functions/v1/unfurl
const CORS = { 'Access-Control-Allow-Origin': '*', 'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type' };

function pick(html: string, base: string): string | null {
  const metas = [...html.matchAll(/<meta\s+[^>]*>/gi)].map((m) => m[0]);
  const read = (m: string, attr: string) => (m.match(new RegExp(`${attr}\\s*=\\s*["']([^"']+)["']`, 'i')) ?? [])[1];
  for (const w of ['og:image:secure_url', 'og:image', 'twitter:image', 'twitter:image:src']) {
    for (const m of metas) {
      const p = read(m, 'property') ?? read(m, 'name');
      if (p && p.toLowerCase() === w) { const c = read(m, 'content'); if (c) return c.startsWith('//') ? 'https:' + c : c.startsWith('http') ? c : new URL(c, base).toString(); }
    }
  }
  return null;
}

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') return new Response('ok', { headers: CORS });
  const url = new URL(req.url).searchParams.get('url');
  if (!url || !/^https?:\/\//.test(url)) return new Response(JSON.stringify({ error: 'url gerekli' }), { status: 400, headers: { ...CORS, 'Content-Type': 'application/json' } });
  try {
    const r = await fetch(url, { headers: { 'User-Agent': 'Mozilla/5.0 (iPhone; CPU iPhone OS 17_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.0 Mobile/15E148 Safari/604.1', Accept: 'text/html' }, redirect: 'follow' });
    const html = (await r.text()).slice(0, 300_000);
    const title = (html.match(/<title[^>]*>([^<]*)<\/title>/i) ?? [])[1]?.trim() ?? null;
    return new Response(JSON.stringify({ image: pick(html, url), title }), { headers: { ...CORS, 'Content-Type': 'application/json', 'Cache-Control': 'public, max-age=86400' } });
  } catch (e) {
    return new Response(JSON.stringify({ image: null, error: String(e) }), { status: 200, headers: { ...CORS, 'Content-Type': 'application/json' } });
  }
});
