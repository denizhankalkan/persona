import React, { createContext, useContext } from 'react';
import { getLocales } from 'expo-localization';

/**
 * UI language. Turkish is the source text (the key); other languages map from it, so a
 * missing translation falls back to Turkish instead of a code. User content (reviews,
 * bios, notes) is never translated. Catalog tokens (seasons, months, cities) go through tx().
 */
export type Lang = 'tr' | 'en' | 'fr' | 'ru';
export const LANGS: { code: Lang; label: string; ready: boolean }[] = [
  { code: 'tr', label: 'Türkçe', ready: true },
  { code: 'en', label: 'English', ready: true },
  { code: 'fr', label: 'Français', ready: false },
  { code: 'ru', label: 'Русский', ready: false },
];

export function deviceLang(): Lang {
  try {
    const code = (getLocales()[0]?.languageCode ?? 'tr').toLowerCase();
    const hit = LANGS.find((l) => l.code === code && l.ready);
    return hit ? hit.code : 'en';
  } catch { return 'tr'; }
}

const EN: Record<string, string> = {
  // tabs & chrome
  'Akış': 'Feed', 'Keşfet': 'Discover', 'Ekranda': 'On Screen', 'Dolabım': 'My Wardrobe', 'Ekle': 'Add', 'Geri': 'Back',
  'Persona nedir?': 'What is Persona?', 'Dolap': 'Wardrobe', 'Parça': 'Piece', 'Marka': 'Brand', 'Defile': 'Collection', 'Stil': 'Style', 'Liste': 'List', 'Tartışma': 'Discussion', 'Hesap': 'Account', 'Gizlilik': 'Privacy',
  'Koleksiyon': 'Collection', 'Model': 'Model',
  // feed
  'algoritma yok': 'no algorithm', '{n} kişiyi takip ediyorsun': 'following {n} people',
  'Bu hafta en çok vitrine eklenenler': 'Most showcased this week',
  'Kimi takip ediyorsun?': 'Who do you follow?',
  'Akış, takip ettiklerinin yazdıklarından oluşur: ne eklediler, neye kaç yıldız verdiler, neyi tartışıyorlar.': 'The feed is what the people you follow do: what they showcased, what they rated, what they argue about.',
  'Kişileri bul': 'Find people', '{n} kişi': '{n} people', 'Son defileler': 'Latest collections', 'Tümü →': 'All →', 'Son yorumlar': 'Latest reviews', 'herkesten': 'from everyone',
  'Henüz hareket yok.': 'Nothing yet.', 'Daha fazla kişi bul →': 'Find more people →',
  'vitrinine ekledi': 'added to their showcase', 'kaydetti': 'saved', 'yorumladı': 'reviewed', 'yazdı': 'wrote',
  '{who}’in yorumuna yazdı': 'replied to {who}’s review', 'liste yaptı': 'made a list', '{p}’nın kimliğine bürünüyor': 'is becoming {p}',
  'persona': 'persona', 'karakter': 'character',
  // discover
  'Parça, marka, defile, stil, liste, kişi': 'Piece, brand, collection, style, list, person',
  'Parçalar': 'Pieces', 'Listeler': 'Lists', 'karakter dolapları, personalar, editör': 'character wardrobes, personas, editors',
  'Defileler': 'Collections', 'sezon sezon': 'season by season', 'Stiller': 'Styles', 'trend mi, kalıcı mı?': 'trend or forever?',
  'Markalar': 'Brands', 'sadığım · ara sıra · koptum': 'loyal · sometimes · left', 'Bu hafta popüler parçalar': 'Popular pieces this week',
  'Arkadaşlar ve kişiler': 'Friends and people', 'aldıklarını, izin verdikleri kadar': 'what they bought, as far as they allow',
  'Bulunamadı. Gerçek sürümde davet linki gönderebileceksin.': 'Not found. In the release you will be able to send an invite link.',
  '“{q}” katalogda yok.': '“{q}” is not in the catalog.', 'Ekle →': 'Add →',
  'Takiptesin ✓': 'Following ✓', 'Arkadaşsınız ✓': 'Friends ✓', 'İstek gönderildi': 'Request sent', 'İstek gönderildi…': 'Request sent…', 'Takip et': 'Follow', 'Arkadaş ol': 'Add friend',
  // on screen
  'Dizilerde ve filmlerde giyilenler': 'Worn on TV and in film', 'Karakterin dolabına gir, parçayı bul, nereden alınır gör.': 'Open a character’s wardrobe, find the piece, see where to buy it.',
  'Dizi · {y}': 'Series · {y}', 'Film · {y}': 'Film · {y}', 'Hangi dizi, hangi karakter?': 'Which series, which character?', 'Öner': 'Suggest', 'Önerin alındı: {s}': 'Got it: {s}',
  'Yakında': 'Coming soon', '{n} parça': '{n} pieces', '{n} model': '{n} models',
  // wardrobe
  'Senin dolabın': 'Your wardrobe', 'Düzenle': 'Edit', 'Vazgeç': 'Cancel', '{n} parça gizli': '{n} pieces hidden',
  'Adın': 'Your name', '@kullanıcıadı': '@username', 'Bir satır: Kadıköy, Zara’dan koptum…': 'One line: Kadıköy, left Zara…',
  'Dolabımı kim görsün?': 'Who can see my wardrobe?', 'Dil': 'Language', 'yakında': 'soon', 'Kaydet': 'Save',
  'Gizlilik politikası →': 'Privacy policy →', 'Hesap →': 'Account →',
  'Vitrin': 'Showcase', 'Favoriler': 'Favorites', 'Yorum': 'Reviews', 'Takip istekleri': 'Follow requests',
  'Dolabını ve nereden aldıklarını görmek istiyor.': 'Wants to see your wardrobe and where you bought things.', 'Onayla': 'Accept', 'Reddet': 'Decline',
  'İmza parçalarım': 'My signature pieces', 'Tamam': 'Done', 'Değiştir': 'Change', 'Seç': 'Pick', 'Dördünü seç; vitrinindekilerden.': 'Pick four from your showcase.', 'Önce vitrinine bir parça ekle.': 'Add a piece to your showcase first.',
  'Nereden alışveriş yapıyorum': 'Where I shop', '{n} parçada yazmadın': 'missing on {n} pieces',
  'Parçalarına nereden aldığını yazınca burada toplanır. Takip ettiklerin görür; istediğini gizlersin.': 'Write where you bought each piece and it adds up here. Your followers see it; hide whatever you want.',
  'Vitrinim · {n}': 'Showcase · {n}', 'Favorilerim · {n}': 'Favorites · {n}', 'Listelerim': 'My lists', 'Yorumlarım': 'My reviews',
  'Henüz liste yapmadın. Bir parçanın sayfasında “Listeye” de.': 'No lists yet. Tap “To a list” on a piece.',
  'Henüz yorum yazmadın. Bir modele ya da koleksiyona gir.': 'No reviews yet. Open a model or a collection.',
  'Vitrine eklediğin her şey burada birikir.': 'Everything you showcase collects here.', 'Kaydettiklerin burada bekler.': 'What you save waits here.',
  'Fotoğraf çekmene gerek yok. Bir listeye gir, parçaya dokun; ya da + ile ekle.': 'No photos to take. Open a list, tap a piece; or add with +.',
  'Hande’nin dolabına git →': 'Go to Hande’s wardrobe →', 'Büründüğün personalar': 'Personas you’re becoming', 'Dolabı →': 'Wardrobe →',
  'Takip ettiklerin': 'People you follow', 'Kişi bul →': 'Find people →',
  'Kimseyi takip etmiyorsun. Takip ettiklerinin dolabını, nereden aldıklarını ve yorumlarını görürsün.': 'You follow no one yet. You will see their wardrobes, where they bought things and their reviews.',
  'Herkese açık': 'Public', 'Takipçilerime': 'Followers', 'Gizli': 'Private',
  'Dolabın, nereden aldıkların ve yorumların herkese görünür.': 'Your wardrobe, where you shop and your reviews are visible to everyone.',
  'Yalnızca onayladığın takipçiler görür. Takip istekleri sana gelir.': 'Only followers you approve can see. Requests come to you.',
  'Kimse görmez. Yorumların yine de herkese açık kalır.': 'No one sees it. Your reviews stay public.',
  // add
  'Resmi ürün linki ya da ara': 'Official product link, or search', 'zara.com/… · ya da “bej trençkot”': 'zara.com/… · or “beige trench”',
  'Linki yapıştırırsan fotoğraf ve marka resmi sayfadan gelir. Katalog buradan büyür.': 'Paste the link and the photo and brand come from the official page. The catalog grows from here.',
  'Katalogda var': 'Already in the catalog', 'dokun, vitrine ekle': 'tap to showcase', 'Linkten ekle': 'Add from link', '“{q}” yeni parça olarak ekle': 'Add “{q}” as a new piece',
  'Nasıl çalışır': 'How it works', '1. Link yapıştır ya da ara. 2. Fotoğraf ve isim gelir, onayla. 3. Vitrine ekle ya da kaydet, yıldız, iki satır. 4. Nereden aldım ve görünürlük.': '1. Paste a link or search. 2. Photo and name arrive, confirm. 3. Showcase or save, stars, two lines. 4. Where you bought it and who sees it.',
  'Onayla ve devam': 'Confirm', 'Parçanın adı — bej trençkot': 'Name of the piece — beige trench', 'Fiyat (isteğe bağlı)': 'Price (optional)', 'Kategori': 'Category', 'Devam': 'Continue', 'Ekleniyor…': 'Adding…', '← Geri': '← Back',
  'Vitrine ekle': 'Add to showcase', 'Vitrinde ✓': 'Showcased ✓', 'Kaydedildi ♥': 'Saved ♥',
  'Yıldız ve iki satır': 'Stars and two lines', 'Nasıl oturdu, nerede giydin, tekrar alır mıydın?': 'How did it fit, where did you wear it, would you buy it again?',
  'Nereden aldın?': 'Where did you buy it?', 'Mağaza, şube ya da site — Zara İstinye Park, ikinci el, Trendyol…': 'Store, branch or site — Zara İstinye Park, second-hand, Trendyol…',
  'Gizli ●': 'Hidden ●', 'Takip edenler görür': 'Followers can see', 'Her parça tek tek gizlenebilir.': 'Any piece can be hidden on its own.', 'Kaydediliyor…': 'Saving…',
  'Elbise': 'Dress', 'Ceket': 'Jacket', 'Palto': 'Coat', 'Pantolon': 'Trousers', 'Etek': 'Skirt', 'Gömlek': 'Shirt', 'Kazak': 'Knit', 'Ayakkabı': 'Shoes', 'Çanta': 'Bag', 'Gözlük': 'Eyewear', 'Takı': 'Jewellery', 'Parfüm': 'Perfume', 'Ürün': 'Product',
  // piece
  'Fotoğrafı değiştir': 'Change photo', 'Fotoğraf ekle': 'Add photo', 'Resmi sayfa →': 'Official page →', 'Resmi link ekle': 'Add official link', 'Linki değiştir': 'Change link', 'Fotoğrafı kaldır': 'Remove photo',
  'Markanın ürün sayfası linki': 'The brand’s product page link',
  'Fotoğraf markanın resmi ürün sayfasından gelir: linki yapıştır, görsel kendiliğinden gelsin. Dizi karesi için galeriden ekle.': 'The photo comes from the brand’s official product page: paste the link and the image follows. For a TV frame, add from your gallery.',
  '{n} vitrinde': 'in {n} showcases', 'Listeye': 'To a list', 'ekle': 'add', 'Hangi listeye?': 'Which list?', 'Yeni liste — Kış 2026 kapsülüm': 'New list — Winter 2026 capsule', 'Oluştur': 'Create',
  'Nereden aldılar?': 'Where did they buy it?', 'izin verdikleri kadar': 'as far as they allow', 'Link': 'Link',
  'Benzerini ara →': 'Search similar →', 'Resmi sayfa': 'Official page',
  'Sıkanlar ne diyor': 'What wearers say', 'Giyenler ne diyor': 'What wearers say', 'Listelerde ve stillerde': 'In lists and styles',
  'Parça bulunamadı.': 'Piece not found.',
  // brand
  'Marka bulunamadı.': 'Brand not found.', '{n} görüş': '{n} opinions', 'koptu': 'left', 'ortalama': 'average', 'parça': 'pieces',
  'Sadığım': 'Loyal', 'Ara sıra': 'Sometimes', 'Koptum': 'Left', 'Sadığım / ara sıra / koptum: yorumunu yazarken seç.': 'Loyal / sometimes / left: pick it when you write.',
  'Parçalarından hesaplanan puan': 'Score computed from its pieces', 'Kalıp': 'Fit', 'Fiyat': 'Price', 'Kalite': 'Quality', 'Kumaş': 'Fabric',
  'En çok eklenen parçaları': 'Most showcased pieces', 'Defileleri': 'Collections', 'Stilleri': 'Styles', '{b} resmi sitesi →': '{b} official site →',
  'markayı konuşanlar': 'people talking about the brand',
  'Markaya yıldız verilmez; puanı parçalarının puanından hesaplanır. Burada kalıp, kumaş, fiyat ve tutum konuşulur.': 'Brands get no stars; their score is computed from their pieces. Fit, fabric, price and attitude are discussed here.',
  // show
  'Defile bulunamadı.': 'Collection not found.', 'Resmi defile sayfası →': 'Official show page →', 'Kare ekle': 'Add frame',
  'Markanın defile sayfası ya da Vogue Runway linki': 'The brand’s show page link',
  'Görsel markanın resmi defile sayfasından gelir; linki yapıştır. Çizim yok.': 'Images come from the brand’s official show page; paste the link. No drawings.',
  'Görünümler': 'Looks', 'Resmi sayfadan ya da senin eklediğin kareden.': 'From the official page or frames you add.', 'Görünüm {n}': 'Look {n}', 'kare ekle': 'add frame',
  'Koleksiyon ne diyor?': 'What does the collection say?', 'izleyenler': 'viewers', 'Aynı sezon, aynı ev': 'Same season, same house',
  'Defile puanı koleksiyona, tasarımcıya değil: giyer miydin, ne söyledi, öncekine göre ne değişti?': 'The score is for the collection, not the designer: would you wear it, what did it say, what changed since last time?',
  // style
  'Stil bulunamadı.': 'Style not found.', 'İmza parçalar': 'Signature pieces', 'Katalogda bu stil': 'This style in the catalog', 'Podyumda': 'On the runway',
  'Trend mi, kalıcı mı?': 'Trend or forever?', 'tartışma; yıldız parçalara': 'discussion; stars go to pieces', 'Listelerde': 'In lists',
  // list
  'Liste bulunamadı.': 'List not found.', 'Karakter dolabı': 'Character wardrobe', 'Herkese açık persona': 'Public persona', 'Editör': 'Editor',
  '{p} ne alıyor?': 'What does {p} buy?', '{p} ne giyerdi?': 'What would {p} wear?', 'örnek profil': 'example profile', 'örnek': 'example', '{n} kayıt': '{n} saves',
  'Bürünüyorsun ✓': 'Becoming ✓', 'Kimliğine bürün': 'Become her', 'Kaydettin ♥': 'Saved ♥', 'Paylaş': 'Share', 'bu dolaptan vitrininde {n} parça': '{n} pieces from this wardrobe in your showcase',
  'Nereden alışveriş yapıyor?': 'Where does she shop?', 'paylaştığı kadar': 'as much as she shares', 'Vitrini': 'Showcase', 'Giydikleri': 'What she wore',
  'her biri puanlanır': 'each one rated', 'Liste boş.': 'The list is empty.',
  'Parça eklemek için parçanın sayfasında “Listeye” de; çıkarmak için aşağıda.': 'To add, tap “To a list” on a piece; to remove, below.',
  'Fotoğraflar: bir parçaya girip resmi ürün linkini ya da dizi karesini ekleyebilirsin.': 'Photos: open a piece and add the official product link or a frame from the show.',
  'Dolap hakkında': 'About the wardrobe', 'Liste hakkında': 'About the list', '{u}’in dolabı →': '{u}’s wardrobe →',
  'Persona’da “{t}”: {n} parça.': '“{t}” on Persona: {n} pieces.',
  // user
  'Kişi bulunamadı.': 'Person not found.', '{p}’ya bürünüyor': 'becoming {p}', 'Dolabı arkadaşlarına açık.': 'Wardrobe open to friends.',
  '{u} isteğini onayladığında aldıklarını model model, nereden aldığıyla göreceksin.': 'When {u} approves, you will see what she bought, model by model, with where.',
  '{u} dolabını yalnızca onayladığı arkadaşlarına gösteriyor. İstek gönder; kabul ederse aldıklarını model model, nereden aldığıyla görürsün.': '{u} shows her wardrobe only to approved friends. Send a request; if she accepts you will see what she bought, model by model, with where.',
  'Dolabı gizli.': 'Wardrobe is private.', '{u} dolabını kimseyle paylaşmıyor. Yorumları ve listeleri yine de aşağıda.': '{u} shares her wardrobe with no one. Her reviews and lists are still below.',
  'İmza parçaları': 'Signature pieces', '{n} parçadan': 'from {n} pieces', 'Listeleri · {n}': 'Lists · {n}', 'Yorumları · {n}': 'Reviews · {n}',
  'Henüz yorum yazmamış.': 'No reviews yet.', 'Henüz liste yapmamış.': 'No lists yet.', 'Bu raf boş.': 'Empty.',
  'herkese açık': 'public', 'takipçilerime': 'followers', 'gizli': 'private',
  // review
  'Yorum bulunamadı.': 'Review not found.', 'Sil': 'Delete', '{n} yanıt': '{n} replies', 'Henüz yanıt yok. İlk sen yaz.': 'No replies yet. Be the first.',
  'Katıl: aynı fikirde misin, değil misin, neden?': 'Join in: do you agree, and why?', 'Yanıtla': 'Reply',
  'Sen ne düşünüyorsun?': 'What do you think?', 'Tartışmaya katıl': 'Join the discussion', 'Yorumu kaydet': 'Save review', 'Yaz': 'Post',
  'Yıldız yalnızca modele ve koleksiyona verilir; {x} puanı parçalarından hesaplanır.': 'Stars go only to models and collections; the {x} score is computed from its pieces.',
  'markanın': 'brand’s', 'stilin': 'style’s', 'listenin': 'list’s',
  'İki satır yeter: nasıl oturdu, nerede giydin, tekrar alır mıydın?': 'Two lines will do: how did it fit, where did you wear it, would you buy it again?',
  'Kalıp, kumaş, fiyat. Neden sadıksın ya da neden koptun?': 'Fit, fabric, price. Why loyal, or why did you leave?',
  'Koleksiyon ne söyledi? Giyer miydin? Önceki sezona göre?': 'What did the collection say? Would you wear it? Compared to last season?',
  'Bu stil kime, ne zaman iyi? Trend mi, kalıcı mı?': 'Who is this style for, and when? Trend or forever?',
  'Liste işe yarıyor mu, eksik ne, hangi parça fazla?': 'Does the list work, what is missing, which piece is one too many?',
  'Yorumlar': 'Reviews', 'önce takip ettiklerin': 'people you follow first', 'Yorumunu yazdın; tartışmak için üstüne dokun.': 'You wrote yours; tap it to discuss.', 'İlk yorumu sen yaz.': 'Write the first review.',
  'Henüz puan yok.': 'No score yet.', 'parçalarından hesaplandı': 'computed from its pieces', 'tartış →': 'discuss →', 'yanıt': 'replies',
  '{n} sa önce': '{n}h ago', '{n} gün önce': '{n}d ago', '{n} ay önce': '{n}mo ago', '{n} sa': '{n}h', '{n} gün': '{n}d',
  'Beğen': 'Like', 'Beğenmekten vazgeç': 'Unlike',
  // photo
  'yükleniyor': 'loading', 'fotoğraf yüklenemedi': 'photo unavailable', 'resmi sayfadan': 'from official page', 'fotoğraf yok': 'no photo', 'ürün fotoğrafı': 'product photo',
  // purchase form
  'Görünür': 'Visible', 'Takip ettiklerin görüyor. Değiştirmek için dokun.': 'Your followers can see it. Tap to change.',
  'Mağaza, şube ya da site': 'Store, branch or site', 'Fiyat — 4.500 TL': 'Price — 4.500 TL', 'Ürün linki (isteğe bağlı)': 'Product link (optional)',
  'Bu parçayı kimse görmesin': 'Hide this piece from everyone', 'Bu parça gizli; yalnızca sen görüyorsun.': 'This piece is hidden; only you can see it.',
  // intro
  'Modanın Letterboxd’u.': 'The Letterboxd of fashion.',
  'Kitap için Goodreads, film için Letterboxd vardı. Moda konuşmak için Instagram ve forumlar kalmıştı. Persona: giydiğini vitrine koy, puanla, yaz; takip ettiklerin ne giyiyor, nereden alıyor, gör.': 'Books had Goodreads, films had Letterboxd. Fashion was left with Instagram and forums. Persona: showcase what you wear, rate it, write; see what the people you follow wear and where they buy it.',
  'Vitrine koy': 'Showcase', 'Aldığını göster.': 'Show what you bought.', 'Parça, nereden aldın, kaça. Fotoğraf çekmek yok; resmi ürün linki yeter. İzin verdiğin kadar görünür.': 'The piece, where you bought it, for how much. No photos to take; the official product link is enough. Visible as far as you allow.',
  'Puanla': 'Rate', 'Modele ve koleksiyona yıldız.': 'Stars for models and collections.',
  'Letterboxd’da film ne ise bizde model o: Sézane’ın trençkotu, Chanel’in son koleksiyonu. Marka ve stil sayfaları parçalardan hesaplanır, tartışılır.': 'What a film is to Letterboxd, a model is to us: Sézane’s trench, Chanel’s latest collection. Brand and style pages are computed from pieces, and argued over.',
  'Takip et ': 'Follow', 'O kadın ne alıyor?': 'What does that woman buy?',
  'Dizi karakteri, herkese açık persona ya da takip ettiğin biri: dolabı, nereden aldığı, ne düşündüğü. Kıyas yok, algoritma yok.': 'A TV character, a public persona or someone you follow: her wardrobe, where she shops, what she thinks. No comparison, no algorithm.',
  'Konuş': 'Talk', 'Beğendin. Kimle konuşacaksın?': 'You love it. Who will you talk to?',
  'Her yorumun altında tartışma. Konuşma bir parçaya, markaya ya da listeye bağlıdır; kaybolmaz, aranır.': 'A discussion under every review. The conversation belongs to a piece, a brand or a list; it does not vanish, it can be searched.',
  'Hande’nin dolabıyla başla': 'Start with Hande’s wardrobe', '1 dakika': '1 minute', 'Önce bir bakayım': 'Let me look first',
  // ui
  'Puan dağılımı': 'Rating distribution', 'yorum': 'reviews', 'Liste ': 'Lists', '{n} yıldız': '{n} stars',
};

const DICT: Partial<Record<Lang, Record<string, string>>> = { en: EN, fr: {}, ru: {} };

/** catalog tokens that live in seed data as Turkish */
const TOKENS_EN: [RegExp, string][] = [
  [/İlkbahar\/Yaz/g, 'Spring/Summer'], [/Sonbahar\/Kış/g, 'Fall/Winter'], [/Milano/g, 'Milan'],
  [/\bOcak\b/g, 'January'], [/\bŞubat\b/g, 'February'], [/\bMart\b/g, 'March'], [/\bNisan\b/g, 'April'], [/\bMayıs\b/g, 'May'], [/\bHaziran\b/g, 'June'], [/\bTemmuz\b/g, 'July'], [/\bAğustos\b/g, 'August'], [/\bEylül\b/g, 'September'], [/\bEkim\b/g, 'October'], [/\bKasım\b/g, 'November'], [/\bAralık\b/g, 'December'],
  [/\bgörüş\b/g, 'opinions'], [/\bparça\b/g, 'pieces'], [/İspanya/g, 'Spain'], [/Fransa/g, 'France'], [/İtalya/g, 'Italy'], [/Türkiye/g, 'Türkiye'], [/İsveç/g, 'Sweden'], [/ABD/g, 'USA'],
  [/\bBölüm\b/g, 'Episode'], [/\bbölüm\b/g, 'episode'], [/Doğum günü/g, 'Birthday'],
];

function interpolate(s: string, vars?: Record<string, string | number>) {
  if (!vars) return s;
  return s.replace(/\{(\w+)\}/g, (_, k) => (vars[k] === undefined ? `{${k}}` : String(vars[k])));
}

export function translate(lang: Lang, tr: string, vars?: Record<string, string | number>) {
  const hit = lang === 'tr' ? undefined : DICT[lang]?.[tr];
  return interpolate(hit ?? tr, vars);
}
export function translateCatalog(lang: Lang, s: string) {
  if (lang === 'tr' || !s) return s;
  let out = s;
  TOKENS_EN.forEach(([re, to]) => { out = out.replace(re, to); });
  return out;
}

export const LangContext = createContext<Lang>('tr');
export const LangProvider = LangContext.Provider;

export function useT() {
  const lang = useContext(LangContext);
  return {
    lang,
    t: (tr: string, vars?: Record<string, string | number>) => translate(lang, tr, vars),
    tx: (s: string) => translateCatalog(lang, s),
  };
}
