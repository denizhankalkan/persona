# Persona

Goodreads ve Letterboxd'nin moda hali. Puanlanabilir beş şey: **parça, marka, defile (koleksiyon), stil (boho, western, sessiz lüks…) ve dolap/liste** (karakter dolapları, personalar, kullanıcı listeleri). Raflar (Bende / İstiyorum), yıldızlı yorumlar, yorum altında tartışma ve beğeni, markalar için "sadığım / ara sıra / koptum", "nereden aldım" ve izin modeli. Gerçek kullanıcıların dolabına yıldız verilmez; kişi puanlanmaz.

Görsel dil Vogue.com gibi: beyaz zemin, siyah metin, ince çizgiler, köşesiz kutular, Bodoni başlık. Tek vurgu rengi Tiffany mavisi (Pantone 15-5217 TCX, `#53B0AE`), `src/theme.ts`.

Tek kod tabanı: **iOS + Android + Web** (React Native, Expo SDK 58, TypeScript, Expo Router). Arka uç: **Supabase** (isteğe bağlı; yoksa uygulama cihaz üzerindeki örnek veriyle çalışır).

## Ürün fotoğrafları

Çizim yok. Her parçanın fotoğrafı sırasıyla şuradan gelir:
1. Kullanıcının eklediği fotoğraf (galeri; dizi karesi, kendi çekimi) — `expo-image-picker`.
2. Parçanın `imageUrl` alanı (bilinen doğrudan görsel).
3. **Markanın resmi ürün sayfası** (`url`): uygulama sayfayı açıp paylaşım görselini (`og:image`) okur; WhatsApp link önizlemesiyle aynı görsel. iOS/Android'de doğrudan; web'de tarayıcı engeli yüzünden `supabase/functions/unfurl` üzerinden (`EXPO_PUBLIC_UNFURL_URL`).

Deploy: `supabase functions deploy unfurl --no-verify-jwt`. Fotoğraflar marka sunucusundan gösterilir, kopyalanmaz; yayın ölçeğinde Trendyol Partner / Awin gibi iş ortaklığı akışlarına geçilmesi önerilir (görsel kullanım hakkı + komisyon).

## Yapı

```
app/                     Expo Router ekranları (4 sekme + Ekle)
  (tabs)/index.tsx       Akış  — bu hafta en çok eklenenler + takip ettiklerinin hareketleri
  (tabs)/kesfet.tsx      Keşfet — tek arama; listeler, defileler, stiller, markalar, parçalar, kişiler
  (tabs)/ekle.tsx        (+) düğmesi → ekle.tsx modalı
  (tabs)/dolabim.tsx     Dolabım — 4 imza parça, raflar, nereden alıyorum, listelerim, yorumlarım, izinler
  ekle.tsx               Ekle: resmi link yapıştır ya da ara → onayla → raf, yıldız, iki satır, nereden aldım
  item/[id].tsx          Parça: fotoğraf, Bende/İstiyorum/Listeye, nereden aldılar, yorumlar
  marka/[id].tsx         Marka: koptu oranı, topluluk puanı, sadığım/ara sıra/koptum, parçaları, defileleri
  defile/[id].tsx        Defile: marka × sezon, tek kimlik; yıldız + yorum
  stil/[id].tsx          Stil: imza parçalar, katalogda bu stil, podyumda, trend mi kalıcı mı
  liste/[id].tsx         Liste / dolap: karakter dolapları ve personalar da burada (puanlanır)
  user/[id].tsx          Kişi: izinlere göre imza parçaları, rafları, nereden aldıkları (puan yok)
  review/[id].tsx        Yorum + beğeni + tartışma
  persona/[id].tsx       Eski linkler için /liste/dolap-<id> yönlendirmesi
  giris.tsx / gizlilik.tsx / nedir.tsx
src/
  data/types.ts          Veri modeli (SubjectKind: item | brand | show | style | list)
  data/seed.ts           Örnek içerik: Hande, Lara, markalar, 7 defile, 10 stil, 5 liste, örnek kullanıcılar
  data/repo.ts           Repo arayüzü + LocalRepo (AsyncStorage)
  data/supabase.ts       SupabaseRepo (aynı arayüz; defile ve stil kataloğu şimdilik uygulamayla gelir)
  store.tsx              Uygulama durumu, puan hesapları, izinler
  components/            UI (ui.tsx), kartlar, Reviews (ortak puan + yorum bloğu), Photo/ProductImage
  unfurl.ts              Resmi sayfadan fotoğraf okuma
supabase/schema.sql      Tablolar + RLS + tetikleyiciler (review_likes, user_items, lists, list_items dahil)
supabase/seed.sql        Katalog verisi (scripts/make-seed-sql.mjs üretir)
```

## Geliştirme

```bash
npm install
npx expo start          # i: iOS simülatör, a: Android, w: web
npm run typecheck
```

Telefonda denemek için App Store'dan **Expo Go** indir, `npx expo start` çıktısındaki QR'ı okut.

## Arka uç (Supabase)

1. supabase.com'da proje aç.
2. SQL Editor'da `supabase/schema.sql` dosyasını çalıştır, sonra `supabase/seed.sql`.
3. Authentication → Providers: Email'i aç (magic link yeterli). Google/Apple ile giriş sonradan eklenir.
4. `.env.example` → `.env`: proje URL'si ve anon key.
5. `eas.json` içindeki `env` alanlarına da aynı değerleri yaz (derleme sırasında gömülür).

`.env` boşken uygulama tamamen çevrimdışı, örnek veriyle çalışır. TestFlight'a ilk gönderim için bu yeterli.

Giriş ekranı hazır (`app/giris.tsx`): e-posta ile magic link + 6 haneli kod. Supabase'de Authentication → Email açık olmalı; yönlendirme adresi olarak web alan adını ve `persona://giris` şemasını ekle.

## iOS — App Store'a gönderim

Gereken: Apple Developer Program üyeliği (99 $/yıl), ücretsiz bir Expo hesabı. Mac **gerekmez**; derleme EAS bulutunda olur.

```bash
npm install -g eas-cli
eas login
eas init                       # app.json → extra.eas.projectId yazılır
eas build --platform ios --profile production
# İlk seferde Apple hesabına giriş ister; sertifika ve provisioning profilini kendisi üretir.
```

App Store Connect'te uygulamayı oluştur (Bundle ID: `com.mermind.persona`, isim: Persona). Sonra:

```bash
eas submit --platform ios --latest
```

`eas.json → submit.production.ios` alanlarını doldur: `appleId` (Apple ID e-postan), `ascAppId` (App Store Connect'teki sayısal uygulama kimliği), `appleTeamId`.

TestFlight'ta görünür; "External Testing" ile arkadaşlarına link gönderebilirsin. Mağaza inceleme formu için gerekenler:
- Ekran görüntüleri: 6,9" iPhone (1320×2868) — simülatörden alınabilir.
- Gizlilik politikası URL'si: web sürümündeki `/gizlilik` sayfası (metin `app/gizlilik.tsx`; iletişim e-postasını güncelle).
- "Data collection": e-posta (hesap), kullanıcı içeriği (yorumlar, raflar). Takip yok, reklam yok.
- Yaş: 12+ (kullanıcı içeriği).

Sonraki sürümler: `version` artır, `eas build` + `eas submit`. `autoIncrement` build numarasını kendisi artırır.

## Web

```bash
npm run build:web      # dist/ klasörü
```

`dist/` statik bir sitedir; Vercel, Netlify veya Cloudflare Pages'e sürükle-bırak yeter. Vercel ile:

```bash
npm i -g vercel
vercel deploy dist --prod
```

Derin linkler (`/item/deri-ceket`) için barındırıcıda "tüm yolları index.html'e yönlendir" (SPA fallback) açık olmalı. Vercel'de `vercel.json`:

```json
{ "rewrites": [{ "source": "/(.*)", "destination": "/index.html" }] }
```

## Android (sonra)

`eas build --platform android --profile production` → `.aab`; Google Play Console'a `eas submit --platform android`.

## Tasarım

Ürün tasarımı canvas'ı (12+ artboard, Letterboxd→Persona haritası, ekranlar) Claude'da yayında; karar günlüğü proje dokümanı `claude/persona-kararlar.md`.

Beyaz zemin, siyah metin, ince çizgiler, köşe yok. Tek vurgu Tiffany mavisi (#53B0AE): linkler, aktif sekme, (+) düğmesi, küçük etiketler. Başlıklar Bodoni Moda, metin DM Sans, tepede PERSONA masthead. Koyu tema otomatik (siyah zemin, aynı kurallar).

## İzin modeli

Her kullanıcı dolabının görünürlüğünü seçer: **herkese açık / takipçilerime / gizli** (varsayılan: takipçilerime). "Takipçilerime" seçildiğinde takip istekleri onay bekler. Her parça tek tek gizlenebilir. "Nereden aldım" (mağaza, fiyat, link) parçaya bağlıdır ve aynı izinlerle görünür. Kurallar hem uygulamada (`src/store.tsx → access()`) hem veritabanında (`can_view_wardrobe()` + RLS) uygulanır; istemci atlatılsa bile sunucu göstermez.

## Yol haritası

- Apple ile giriş (App Store, e-posta girişi olan uygulamalarda Sign in with Apple ister)
- Gerçek fotoğraf: kullanıcı parçasının fotoğrafı (Supabase Storage)
- Yeni persona ekleme akışı (kullanıcı önerir, editör doğrular)
- Bildirimler: takip ettiğin biri yorumuna yanıt yazınca
- Arama için Supabase full-text index
