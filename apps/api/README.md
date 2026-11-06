# apps/api — Node.js + Express

Sırada. Plan:

- Express + TypeScript, Postgres (Prisma). Şema `apps/mobile/supabase/schema.sql`'den taşınır (showcase/saved rafları, reviews.rating 0 = tartışma, lists, list_items, list_saves, show_looks, review_likes, suggestions, profiles.signature/lang).
- Giriş: e-posta magic link / 6 haneli kod (Resend ya da SES), JWT.
- İzin modeli tek yerde: `canViewWardrobe(viewer, owner)` middleware + testleri. Kurallar: herkese açık / takipçilerime (istek + onay) / gizli; parça tek tek gizlenebilir; yorumlar her zaman açık.
- `GET /unfurl?url=` resmi sayfanın og:image'ını döner (web ve mobil aynı yolu kullanır).
- Fotoğraflar: S3 uyumlu depo (presigned upload).
- Çalıştırma hedefi: Railway / Render / Fly, tek Dockerfile.
