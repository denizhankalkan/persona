# Persona

Goodreads ve Letterboxd'nin moda hali. *Letterboxd'da film ne ise bizde model o:* yıldız yalnızca parçaya (model) ve koleksiyona (defile) verilir; marka, stil ve dolap sayfaları parçalardan hesaplanır ve tartışılır. Kişi puanlanmaz, kıyas yok, algoritma yok.

Tez: *Merak ettiğimiz o kişi, bize izin verdiği ölçüde, nereden alışveriş yaptığını anlatır.*

## Stack

Node.js · JavaScript/TypeScript · Python · Kotlin · HTML5 · CSS3 — backend Express.js, frontend React.

| Klasör | Ne | Durum |
|---|---|---|
| `apps/mobile` | Expo / React Native (React 19, TypeScript). Tek koddan iOS, Android (Kotlin katmanı) ve web (HTML5/CSS3). | çalışıyor |
| `apps/api` | Node.js + Express + Postgres (Prisma), JWT + e-posta ile giriş, S3 uyumlu depolama, `unfurl` (resmi sayfadan görsel). İzin modeli burada. | sırada |
| `apps/site` | Lansman sayfası, düz HTML5/CSS3. | sırada |
| `packages/shared` | İki tarafta aynı tipler ve izin kuralları (TypeScript). | sırada |
| `tools/catalog` | Python: Trendyol Partner / Awin ürün akışlarını içe alma, görsel toplama, çift kayıt temizliği. | sırada |

`apps/mobile` bugün Supabase'e (ya da tamamen çevrimdışı, cihaz içi) çalışıyor; `apps/api` gelince uygulama tarafında yalnızca `src/data/` altına bir `ApiRepo` eklenir, ekranlar değişmez.

## Çalıştırma

```bash
cd apps/mobile
npm install
npx expo start          # iOS / Android / web
npx tsc --noEmit        # tip kontrolü
npx expo export --platform web   # web çıktısı → dist/
```

Ayrıntılar: `apps/mobile/README.md`. Ürün kararları: Claude projesindeki `claude/persona-kararlar.md`.
