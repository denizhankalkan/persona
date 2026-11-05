import type { Brand, Comment, Follow, Item, List, Persona, PersonaFollow, Review, Scene, ShelfEntry, Show, Style, User } from './types';

const H = 3600e3;
const NOW = Date.now();

export const BRANDS: Brand[] = [
  { id: 'zara', name: 'Zara', origin: 'İspanya · 1975', scores: { quality: 2.8, fit: 3.6, fabric: 2.1, price: 3.4 }, leftPct: 38, reviewCount: 1284, url: 'https://www.zara.com/tr/', styleIds: ['minimal', 'y2k'] },
  { id: 'chanel', name: 'Chanel', origin: 'Fransa · 1910', scores: { quality: 4.7, fit: 4.2, fabric: 4.8, price: 1.6 }, leftPct: 9, reviewCount: 412, url: 'https://www.chanel.com/tr/', styleIds: ['sessiz-luks', 'old-money'] },
  { id: 'mango', name: 'Mango', origin: 'İspanya · 1984', scores: { quality: 3.4, fit: 3.9, fabric: 3.1, price: 3.6 }, leftPct: 17, reviewCount: 903, url: 'https://shop.mango.com/tr', styleIds: ['minimal', 'sessiz-luks'] },
  { id: 'koton', name: 'Koton', origin: 'Türkiye · 1988', scores: { quality: 3.0, fit: 3.3, fabric: 2.7, price: 4.3 }, leftPct: 22, reviewCount: 1570, url: 'https://www.koton.com/', styleIds: ['y2k'] },
  { id: 'hm', name: 'H&M', origin: 'İsveç · 1947', scores: { quality: 2.6, fit: 3.2, fabric: 2.3, price: 4.1 }, leftPct: 41, reviewCount: 1109, url: 'https://www2.hm.com/tr_tr/index.html', styleIds: ['y2k', 'boho'] },
  { id: 'massimo', name: 'Massimo Dutti', origin: 'İspanya · 1985', scores: { quality: 4.0, fit: 4.1, fabric: 3.9, price: 2.9 }, leftPct: 8, reviewCount: 388, url: 'https://www.massimodutti.com/tr/', styleIds: ['sessiz-luks', 'old-money', 'minimal'] },
  { id: 'rhode', name: 'Rhode', origin: 'ABD · 2022', scores: { quality: 3.9, fit: 3.5, fabric: 3.6, price: 2.4 }, leftPct: 12, reviewCount: 640, url: 'https://www.rhodeskin.com/' },
  { id: 'dior', name: 'Dior', origin: 'Fransa · 1946', scores: { quality: 4.6, fit: 4.3, fabric: 4.7, price: 1.5 }, leftPct: 7, reviewCount: 298, url: 'https://www.dior.com/', styleIds: ['old-money'] },
  { id: 'bottega', name: 'Bottega Veneta', origin: 'İtalya · 1966', scores: { quality: 4.8, fit: 4.2, fabric: 4.9, price: 1.4 }, leftPct: 5, reviewCount: 211, url: 'https://www.bottegaveneta.com/', styleIds: ['sessiz-luks', 'minimal'] },
  { id: 'balenciaga', name: 'Balenciaga', origin: 'İspanya · 1919', scores: { quality: 4.1, fit: 3.6, fabric: 4.0, price: 1.5 }, leftPct: 19, reviewCount: 356, url: 'https://www.balenciaga.com/' },
  { id: 'miumiu', name: 'Miu Miu', origin: 'İtalya · 1993', scores: { quality: 4.3, fit: 3.9, fabric: 4.2, price: 1.7 }, leftPct: 6, reviewCount: 402, url: 'https://www.miumiu.com/', styleIds: ['coquette', 'y2k'] },
  { id: 'prada', name: 'Prada', origin: 'İtalya · 1913', scores: { quality: 4.5, fit: 4.0, fabric: 4.6, price: 1.6 }, leftPct: 8, reviewCount: 377, url: 'https://www.prada.com/', styleIds: ['minimal', 'sessiz-luks'] },
];

export const ITEMS: Item[] = [
  // Hande — Adını Feriha Koydum (2011)
  { id: 'pembe-elbise', type: 'clothing', name: 'Pudra pembe mini elbise', category: 'Elbise', brandName: 'La Mariquita', color: '#E9B4BF', year: '2011', verification: 'ok', note: 'Galata Kuledibi’ndeki butiğin tasarımı; 2011’de hayran blogunda tespit edildi.', searchQuery: 'pudra pembe mini elbise', ownedCount: 1240, styleIds: ['2011-glam', 'coquette'] },
  { id: 'deri-ceket', type: 'clothing', name: 'Taba deri ceket', category: 'Ceket', brandName: 'Emporio Armani', color: '#B8742F', year: '2011', verification: 'ok', note: 'Hayran blogu 1. bölümde Emporio Armani olarak kaydetti. Dizi 2011’de çekildiği için 2010–11 sezonu.', searchQuery: 'taba deri biker ceket kadın', ownedCount: 3410, styleIds: ['2011-glam', 'western'] },
  { id: 'kahve-canta', type: 'clothing', name: 'Kahverengi omuz çantası', category: 'Çanta', brandName: 'Prada', brandId: 'prada', color: '#4A2E22', year: '2011', verification: 'ok', note: 'Aynı sahnede ceket Emporio Armani, çanta Prada; sonraki bölümlerde Miu Miu ile dönüşümlü.', searchQuery: 'kahverengi deri omuz çantası', ownedCount: 2890, styleIds: ['2011-glam', 'old-money'] },
  { id: 'yesil-ceket', type: 'clothing', name: 'Yeşil kuşaklı ceket', category: 'Ceket', color: '#4E5A3A', year: '2011', verification: 'none', searchQuery: 'yeşil kuşaklı kısa kollu ceket', ownedCount: 610, styleIds: ['2011-glam'] },
  { id: 'kadife-elbise', type: 'clothing', name: 'Mavi mini elbise', category: 'Elbise', brandName: 'Forever New', color: '#2244B8', year: '2011', verification: 'guess', note: '2011’de hayran bloglarında markası en çok sorulan Hande parçası; Forever New olduğu tahmin edildi, doğrulanamadı.', searchQuery: 'saks mavi mini elbise', ownedCount: 860, styleIds: ['2011-glam'] },
  { id: 'kurk-hirka', type: 'clothing', name: 'Beyaz kürk detaylı hırka', category: 'Hırka', color: '#EDE6DA', year: '2011', verification: 'none', searchQuery: 'beyaz kürk yakalı hırka', ownedCount: 340, styleIds: ['2011-glam'] },
  { id: 'sari-sort', type: 'clothing', name: 'Sarı saten şort', category: 'Şort', color: '#E2B531', year: '2011', verification: 'none', searchQuery: 'sarı saten şort', ownedCount: 520, styleIds: ['2011-glam', 'y2k'] },
  { id: 'siyah-gece', type: 'clothing', name: 'Siyah derin dekolteli gece elbisesi', category: 'Elbise', color: '#15121A', year: '2011', verification: 'none', note: 'Aynı elbisenin lila rengi 2011’de bir kiralama sitesinde 3 günlüğüne 200 TL’ye kiralanıyordu.', searchQuery: 'siyah dekolteli gece elbisesi', ownedCount: 2150, styleIds: ['2011-glam'] },
  { id: 'gri-etek', type: 'clothing', name: 'Gri mini etek', category: 'Etek', brandName: 'Hakan Yıldırım for Koton', brandId: 'koton', color: '#8C8A94', year: '2011', verification: 'ok', note: 'Tasarımcı Hakan Yıldırım’ın Koton için hazırladığı koleksiyondan.', searchQuery: 'gri mini etek', ownedCount: 540, styleIds: ['2011-glam'] },
  { id: 'mavi-katkat', type: 'clothing', name: 'Mavi kat kat elbise', category: 'Elbise', brandName: 'H&M', brandId: 'hm', color: '#5B8DEF', year: '2011', verification: 'ok', note: 'O yaz en çok “nereden?” diye sorulan elbise.', searchQuery: 'mavi volanlı kat kat elbise', ownedCount: 1120, styleIds: ['2011-glam', 'boho'] },
  { id: 'fume-palto', type: 'clothing', name: 'Koyu füme palto', category: 'Palto', brandName: 'Tuba Benian', color: '#3C3744', year: '2011', verification: 'ok', note: 'Tasarımcı parçası; sezon finalinde de üzerindeydi.', searchQuery: 'füme uzun kaşe palto', ownedCount: 970, styleIds: ['2011-glam', 'minimal'] },
  { id: 'taba-mont', type: 'clothing', name: 'Taba rengi mont', category: 'Mont', color: '#A8663A', year: '2011', verification: 'none', note: 'Markası hiç bulunamadı. 2011’in cevapsız kalan sorusu.', searchQuery: 'taba rengi deri mont kadın', ownedCount: 430, styleIds: ['2011-glam', 'western'] },
  { id: 'kalp-tshirt', type: 'clothing', name: 'Siyah kalpli gri tişört', category: 'Tişört', color: '#B9B6BF', year: '2011', verification: 'none', searchQuery: 'kalp desenli gri tişört', ownedCount: 690, styleIds: ['2011-glam'] },
  { id: 'pudra-bluz', type: 'clothing', name: 'Pudra rengi sırtı açık bluz', category: 'Bluz', color: '#EFC7CF', year: '2011', verification: 'none', searchQuery: 'pudra sırt dekolteli bluz', ownedCount: 380, styleIds: ['2011-glam', 'coquette'] },
  { id: 'flowerbomb', type: 'perfume', name: 'Flowerbomb', category: 'Parfüm', brandName: 'Viktor&Rolf', color: '#F3A7C3', year: '2005', verification: 'guess', notes: 'Yasemin, frezya, paçuli', note: 'Tahmin: dizide geçmiyor. Odaya girdiğinde önce kokusu girer; Hande’nin tarzı tam olarak bu.', searchQuery: 'viktor rolf flowerbomb edp', ownedCount: 1540, url: 'https://www.viktor-rolf.com/products/flowerbomb-eau-de-parfum-100ml' },
  { id: 'coco-mademoiselle', type: 'perfume', name: 'Coco Mademoiselle', category: 'Parfüm', brandName: 'Chanel', brandId: 'chanel', color: '#F2DDC0', year: '2001', verification: 'guess', notes: 'Portakal, gül, paçuli', note: 'Tahmin: annesinin kredi kartı, kendi tavrı. 2011 Nişantaşı’nın imza kokusu.', searchQuery: 'chanel coco mademoiselle edp', ownedCount: 2210, url: 'https://www.chanel.com/tr/parfum/p/116520/coco-mademoiselle-eau-de-parfum-spray/', imageUrl: 'https://www.chanel.com/puls-img/1784207008778-vl-coco-mademoiselle-2026-1x1.png' },
  { id: '212-vip', type: 'perfume', name: '212 VIP', category: 'Parfüm', brandName: 'Carolina Herrera', color: '#C9A96E', year: '2010', verification: 'guess', notes: 'Çarkıfelek, rom, vanilya', note: 'Tahmin: dizinin yayınlandığı yıl çıktı; Reina gecelerinin kokusu.', searchQuery: 'carolina herrera 212 vip', ownedCount: 880 },
  // Lara — example public person
  { id: 'l-trench', type: 'clothing', name: 'Bej trençkot', category: 'Palto', brandName: 'Massimo Dutti', brandId: 'massimo', color: '#C9B48E', priceText: '6.990 TL', verification: 'ok', searchQuery: 'bej trençkot kadın', ownedCount: 2210, url: 'https://www.massimodutti.com/tr/kadin/ceket/trench-n5026', styleIds: ['sessiz-luks', 'old-money', 'minimal'] },
  { id: 'l-jean', type: 'clothing', name: 'Bol paça jean', category: 'Pantolon', brandName: 'Zara', brandId: 'zara', color: '#5C7AA3', priceText: '1.790 TL', verification: 'ok', searchQuery: 'bol paça jean kadın', ownedCount: 3980, url: 'https://www.zara.com/tr/tr/kadin-jean-l1119.html', styleIds: ['boho', 'y2k', 'minimal'] },
  { id: 'l-loafer', type: 'clothing', name: 'Siyah loafer', category: 'Ayakkabı', brandName: 'Massimo Dutti', brandId: 'massimo', color: '#1B1A16', priceText: '4.490 TL', verification: 'ok', searchQuery: 'siyah deri loafer kadın', ownedCount: 1760, styleIds: ['sessiz-luks', 'old-money', 'dark-academia'] },
  { id: 'l-flap', type: 'clothing', name: 'Classic flap, siyah', category: 'Çanta', brandName: 'Chanel', brandId: 'chanel', color: '#1B1A16', priceText: '430.000 TL', verification: 'ok', note: 'Her yıl zam gören tek çanta; ikinci el fiyatı sıfırdan yüksek.', searchQuery: 'chanel classic flap', ownedCount: 640, styleIds: ['old-money', 'sessiz-luks'] },
  { id: 'l-gozluk', type: 'clothing', name: 'Kedi gözü güneş gözlüğü', category: 'Gözlük', brandName: 'Celine', color: '#2A2520', priceText: '18.900 TL', verification: 'ok', searchQuery: 'celine kedi gözü güneş gözlüğü', ownedCount: 1480, styleIds: ['sessiz-luks', 'old-money'] },
  { id: 'l-lip', type: 'product', name: 'Peptide lip tint, Ribbon', category: 'Ürün', brandName: 'Rhode', brandId: 'rhode', color: '#D98A98', priceText: '1.350 TL', verification: 'ok', note: 'TikTok’ta en çok “bende” denen dudak ürünü.', searchQuery: 'rhode peptide lip tint ribbon', ownedCount: 5120, url: 'https://www.rhodeskin.com/products/peptide-lip-tint-ribbon', imageUrl: 'https://www.rhodeskin.com/cdn/shop/files/ribbon_97d9ff9b-0bf4-4762-a7c9-c8655e8b9923_480x480.jpg', styleIds: ['coquette'] },
  { id: 'l-spf', type: 'product', name: 'Güneş kremi SPF 50', category: 'Ürün', brandName: 'La Roche-Posay', color: '#EFE7DA', priceText: '890 TL', verification: 'ok', searchQuery: 'la roche posay anthelios spf 50', ownedCount: 7400 },
  { id: 'l-scent', type: 'perfume', name: 'Baccarat Rouge 540', category: 'Parfüm', brandName: 'Maison Francis Kurkdjian', color: '#D9A3A0', year: '2015', priceText: '14.500 TL', verification: 'ok', notes: 'Safran, amber, sedir', searchQuery: 'baccarat rouge 540', ownedCount: 3310, styleIds: ['sessiz-luks'] },
  // style anchors
  { id: 'kovboy-bot', type: 'clothing', name: 'Kovboy botu, taba', category: 'Ayakkabı', color: '#8A5A2B', verification: 'none', searchQuery: 'kadın kovboy botu taba deri', ownedCount: 1930, styleIds: ['western', 'boho'] },
  { id: 'suet-ceket', type: 'clothing', name: 'Püsküllü süet ceket', category: 'Ceket', color: '#9A6B3C', verification: 'none', searchQuery: 'püsküllü süet ceket kadın', ownedCount: 410, styleIds: ['western', 'boho'] },
  { id: 'maxi-etek', type: 'clothing', name: 'Dantel maxi etek', category: 'Etek', color: '#EFE3D0', verification: 'none', searchQuery: 'dantel maxi etek beyaz', ownedCount: 1120, styleIds: ['boho', 'coquette'] },
  { id: 'kasmir-kazak', type: 'clothing', name: 'Kaşmir boğazlı kazak, kum', category: 'Kazak', color: '#D6C7B0', verification: 'none', searchQuery: 'kaşmir boğazlı kazak kadın', ownedCount: 2240, styleIds: ['sessiz-luks', 'old-money', 'minimal'] },
  { id: 'kargo-pantolon', type: 'clothing', name: 'Bol kargo pantolon', category: 'Pantolon', color: '#5B5F52', verification: 'none', searchQuery: 'bol kargo pantolon kadın', ownedCount: 2670, styleIds: ['gorpcore', 'y2k'] },
  { id: 'tuvid-ceket', type: 'clothing', name: 'Tüvit kısa ceket', category: 'Ceket', color: '#D9CFC4', verification: 'none', searchQuery: 'tüvit kısa ceket kadın', ownedCount: 1470, styleIds: ['old-money', 'coquette', 'dark-academia'] },
];

export const SHOWS: Show[] = [
  { id: 'chanel-ss26', brandId: 'chanel', brandName: 'Chanel', season: 'İlkbahar/Yaz 2026', city: 'Paris', when: 'Ekim 2025', designer: 'Matthieu Blazy', tagline: 'Blazy’nin ilk Chanel’i.', note: 'Grand Palais. Bottega Veneta’dan gelen tasarımcının evdeki ilk hazır giyim koleksiyonu.', reviewCount: 2140, avg: 4.4, styleIds: ['sessiz-luks', 'minimal'] },
  { id: 'dior-ss26', brandId: 'dior', brandName: 'Dior', season: 'İlkbahar/Yaz 2026', city: 'Paris', when: 'Ekim 2025', designer: 'Jonathan Anderson', tagline: 'Anderson’ın ilk kadın koleksiyonu.', note: 'Loewe’den gelen tasarımcının Dior kadını için ilk defilesi.', reviewCount: 1980, avg: 3.9, styleIds: ['coquette', 'old-money'] },
  { id: 'bottega-ss26', brandId: 'bottega', brandName: 'Bottega Veneta', season: 'İlkbahar/Yaz 2026', city: 'Milano', when: 'Eylül 2025', designer: 'Louise Trotter', tagline: 'Trotter’ın ilk koleksiyonu.', reviewCount: 860, avg: 4.1, styleIds: ['sessiz-luks', 'minimal'] },
  { id: 'balenciaga-ss26', brandId: 'balenciaga', brandName: 'Balenciaga', season: 'İlkbahar/Yaz 2026', city: 'Paris', when: 'Ekim 2025', designer: 'Pierpaolo Piccioli', tagline: 'Piccioli’nin ilk Balenciaga’sı.', reviewCount: 1210, avg: 3.6 },
  { id: 'miumiu-ss26', brandId: 'miumiu', brandName: 'Miu Miu', season: 'İlkbahar/Yaz 2026', city: 'Paris', when: 'Ekim 2025', designer: 'Miuccia Prada', reviewCount: 1530, avg: 4.2, styleIds: ['coquette'] },
  { id: 'prada-ss26', brandId: 'prada', brandName: 'Prada', season: 'İlkbahar/Yaz 2026', city: 'Milano', when: 'Eylül 2025', designer: 'Miuccia Prada & Raf Simons', reviewCount: 1105, avg: 3.8, styleIds: ['minimal'] },
  { id: 'chanel-fw26', brandId: 'chanel', brandName: 'Chanel', season: 'Sonbahar/Kış 2026', city: 'Paris', when: 'Mart 2026', designer: 'Matthieu Blazy', tagline: 'İkinci koleksiyon: ilk kıştan sonra ne?', reviewCount: 640, avg: 4.0, styleIds: ['sessiz-luks'] },
];

export const STYLES: Style[] = [
  { id: 'boho', name: 'Boho', aka: 'Bohem', summary: 'Dantel, süet, maxi etek, püskül. 2005’in festival üniforması 2025’te podyuma geri döndü; herkes aynı anda giyince “stil” mi “trend” mi tartışması başladı.', keyPieces: ['dantel maxi etek', 'süet ceket', 'kovboy botu', 'bol jean', 'kat kat elbise'], era: '1970 · 2005 · 2025', itemIds: ['maxi-etek', 'suet-ceket', 'kovboy-bot', 'l-jean', 'mavi-katkat'], brandIds: ['hm'], reviewCount: 1860, avg: 2.9 },
  { id: 'western', name: 'Western', aka: 'Kovboy', summary: 'Bot, kemer tokası, deri, püskül. Boho’nun sert kardeşi; bir parçası yeter, hepsi birden kostüm olur.', keyPieces: ['kovboy botu', 'püsküllü süet ceket', 'deri ceket', 'kalın kemer', 'denim gömlek'], era: '2023 →', itemIds: ['kovboy-bot', 'suet-ceket', 'deri-ceket', 'taba-mont'], brandIds: [], reviewCount: 1120, avg: 3.4 },
  { id: 'sessiz-luks', name: 'Sessiz lüks', aka: 'Quiet luxury', summary: 'Logo yok, kumaş var. Kaşmir, bej, siyah loafer. Pahalı görünmenin değil, pahalı olmanın estetiği; o yüzden kopyası hemen belli oluyor.', keyPieces: ['kaşmir kazak', 'bej trençkot', 'loafer', 'yapısız blazer', 'tek bir iyi çanta'], era: '2022 →', itemIds: ['kasmir-kazak', 'l-trench', 'l-loafer', 'l-flap', 'l-gozluk', 'l-scent'], brandIds: ['massimo', 'bottega', 'chanel', 'prada'], reviewCount: 2430, avg: 4.1 },
  { id: 'old-money', name: 'Old money', summary: 'Tenis kulübü, yat, Hamptons. Sessiz lüksün kodlu hâli: kıyafet değil, aidiyet iddiası.', keyPieces: ['tüvit ceket', 'inci', 'polo', 'bej pantolon', 'yapılı çanta'], era: '2022 →', itemIds: ['tuvid-ceket', 'l-flap', 'kahve-canta', 'kasmir-kazak'], brandIds: ['chanel', 'dior', 'massimo'], reviewCount: 1540, avg: 3.2 },
  { id: 'y2k', name: 'Y2K', summary: 'Düşük bel, mini, parlak, kargo. 2000’lerin başı; giyenlerin çoğu o yıllarda doğmuştu.', keyPieces: ['düşük bel jean', 'mini etek', 'baguette çanta', 'kargo pantolon', 'crop top'], era: '1999–2004 · 2021 →', itemIds: ['sari-sort', 'kargo-pantolon', 'l-jean'], brandIds: ['zara', 'koton', 'hm', 'miumiu'], reviewCount: 1990, avg: 3.3 },
  { id: 'coquette', name: 'Coquette', summary: 'Fiyonk, dantel, pudra pembe, bale ayakkabısı. Kızsılığın ironik ve ironik olmayan hâli aynı anda.', keyPieces: ['fiyonk', 'bale ayakkabısı', 'dantel bluz', 'pembe', 'inci'], era: '2023 →', itemIds: ['pembe-elbise', 'pudra-bluz', 'maxi-etek', 'tuvid-ceket', 'l-lip'], brandIds: ['miumiu'], reviewCount: 1310, avg: 3.5 },
  { id: 'gorpcore', name: 'Gorpcore', summary: 'Dağa çıkmadan dağ kıyafeti. Teknik ceket, kargo, trekking ayakkabısı; şehirde giyilen performans.', keyPieces: ['teknik ceket', 'kargo pantolon', 'trekking ayakkabısı', 'polar', 'bel çantası'], era: '2017 →', itemIds: ['kargo-pantolon'], brandIds: [], reviewCount: 720, avg: 3.6 },
  { id: 'minimal', name: 'Minimalizm', summary: 'Siyah, beyaz, gri; düz çizgi; az parça. 90’ların Jil Sander’i ve Calvin Klein’ı; bugün “kapsül dolap”.', keyPieces: ['beyaz gömlek', 'siyah pantolon', 'uzun palto', 'düz loafer', 'tek renk'], era: '1990 →', itemIds: ['fume-palto', 'kasmir-kazak', 'l-trench', 'l-jean'], brandIds: ['zara', 'mango', 'massimo', 'bottega', 'prada'], reviewCount: 1270, avg: 4.3 },
  { id: 'dark-academia', name: 'Dark academia', summary: 'Tüvit, yün, loafer, kütüphane. Sonbahar başlayınca her yıl geri gelir.', keyPieces: ['tüvit ceket', 'loafer', 'pileli etek', 'yün yelek', 'koyu kahverengi'], era: '2020 →', itemIds: ['tuvid-ceket', 'l-loafer'], brandIds: [], reviewCount: 540, avg: 3.8 },
  { id: '2011-glam', name: '2011 glam', aka: 'Dizi kızı', summary: 'Mini, topuklu, derin dekolte, pudra pembe, tasarım çanta. Türk dizilerinin 2010–2012 dönemi; Hande’nin dolabı bu stilin sözlüğü.', keyPieces: ['mini elbise', 'deri ceket', 'tasarım çanta', 'topuklu', 'pembe'], era: '2010–2012', itemIds: ['pembe-elbise', 'deri-ceket', 'kahve-canta', 'siyah-gece', 'gri-etek', 'mavi-katkat'], brandIds: ['koton'], reviewCount: 410, avg: 3.9 },
];

export const PERSONAS: Persona[] = [
  {
    id: 'hande', kind: 'character', name: 'Hande Gezgin', shortName: 'Hande', source: 'Adını Feriha Koydum · Show TV · 2011',
    bio: 'İstinye Park’ta dolaşan, Emir’e âşık, Feriha’ya düşman. Dizinin en çok sorulan dolabı.',
    tags: ['2011 glam', 'pembe', 'derin dekolte', 'mini + topuklu', 'tasarım çanta'], colors: ['#E9B4BF', '#000000'], styleIds: ['2011-glam', 'coquette'],
    itemIds: ['pembe-elbise', 'deri-ceket', 'kahve-canta', 'yesil-ceket', 'kadife-elbise', 'kurk-hirka', 'sari-sort', 'siyah-gece', 'gri-etek', 'mavi-katkat', 'fume-palto', 'taba-mont', 'kalp-tshirt', 'pudra-bluz', 'flowerbomb', 'coco-mademoiselle', '212-vip'],
  },
  {
    id: 'lara', kind: 'person', name: 'Lara Demirci', shortName: 'Lara', handle: '@laradmrc', followers: '412K', source: 'İçerik üreticisi · herkese açık persona',
    bio: 'Nişantaşı’nda yaşayan, sabah rutinini ve alışveriş torbalarını paylaşan içerik üreticisi. Bu profil örnek; gerçek uygulamada kişi profilini kendisi sahiplenir.',
    tags: ['sessiz lüks', 'bej + siyah', 'loafer', 'SPF her gün'], colors: ['#C9B48E', '#53B0AE'], isExample: true, styleIds: ['sessiz-luks', 'old-money'],
    itemIds: ['l-trench', 'l-jean', 'l-loafer', 'l-flap', 'l-gozluk', 'l-lip', 'l-spf', 'l-scent'],
    purchases: {
      'l-trench': { store: 'Massimo Dutti, Zorlu', priceText: '6.990 TL' },
      'l-jean': { store: 'Zara, İstinye Park', priceText: '1.790 TL' },
      'l-loafer': { store: 'Massimo Dutti, online', priceText: '4.490 TL' },
      'l-flap': { store: 'Chanel, Paris Rue Cambon', priceText: '2022’de 8.800 €' },
      'l-gozluk': { store: 'Beymen, Zorlu', priceText: '18.900 TL' },
      'l-lip': { store: 'Sephora, online', priceText: '1.350 TL' },
      'l-spf': { store: 'Eczane', priceText: '890 TL' },
      'l-scent': { store: 'Harvey Nichols, İstinye Park', priceText: '14.500 TL' },
    },
  },
];

export const SCENES: Scene[] = [
  { id: 'ep1', personaId: 'hande', episode: '1. Bölüm', title: 'İlk sahne', where: 'Kafe; Emir ve Koray’la', itemIds: ['pembe-elbise', 'deri-ceket', 'kahve-canta'] },
  { id: 'ep5', personaId: 'hande', episode: '5. Bölüm', title: 'Kampüs koridoru', where: 'Feriha’yla yan yana', itemIds: ['yesil-ceket'] },
  { id: 'mavi', personaId: 'hande', episode: 'Bölüm ?', title: 'Mavi elbise günü', where: 'Kampüs', itemIds: ['kadife-elbise', 'kurk-hirka'] },
  { id: 'sari', personaId: 'hande', episode: 'Bölüm ?', title: 'Sarı şort', where: 'Sokak, arabanın yanında', itemIds: ['sari-sort'] },
  { id: 'dogum', personaId: 'hande', episode: 'Doğum günü', title: 'Emir’in doğum günü', where: 'Hazırlık ve gece', itemIds: ['gri-etek', 'siyah-gece'] },
];

export const LISTS: List[] = [
  { id: 'dolap-hande', title: 'Hande’nin dolabı', authorId: 'editor', personaId: 'hande', description: 'Adını Feriha Koydum, 2011. Bölüm bölüm ne giydi; markası bulunanlar ve bulunamayanlar.', itemIds: PERSONAS[0].itemIds, notes: { 'pembe-elbise': '1. bölüm, kafede', 'deri-ceket': '1. bölüm, Emir’le ilk karşılaşma', 'kahve-canta': '1. bölüm', 'yesil-ceket': '5. bölüm, kampüs', 'siyah-gece': 'Emir’in doğum günü', 'taba-mont': 'markası hâlâ bilinmiyor' }, saves: 4120, createdAt: NOW - 400 * H },
  { id: 'dolap-lara', title: 'Lara’nın dolabı', authorId: 'editor', personaId: 'lara', description: 'Herkese açık persona: ne alıyor, nereden alıyor, kaça.', itemIds: PERSONAS[1].itemIds, saves: 1890, createdAt: NOW - 300 * H },
  { id: 'kis-kapsulu', title: 'Kış 2026 kapsülüm', authorId: 'melis', description: 'On parça, bütün kış. Hepsi bende; çoğu ikinci el.', itemIds: ['deri-ceket', 'l-trench', 'kasmir-kazak', 'l-jean', 'l-loafer', 'fume-palto'], notes: { 'kasmir-kazak': 'ikinci el, 1.400 TL', 'deri-ceket': 'üçüncü kış' }, saves: 212, createdAt: NOW - 30 * H },
  { id: 'ilk-maas', title: 'İlk maaşla alınacak 5 şey', authorId: 'ece', description: 'Pahalı değil, kalıcı. Yirmi yaşındaki bana liste.', itemIds: ['l-trench', 'l-loafer', 'kasmir-kazak', 'l-spf', 'l-jean'], saves: 578, createdAt: NOW - 70 * H },
  { id: 'boho-2025', title: 'Boho’nun dönüşü: tutanlar, tutmayanlar', authorId: 'zeynep', description: 'Bu yaz herkes aynı eteği giydi. Hangileri kalır?', itemIds: ['maxi-etek', 'suet-ceket', 'kovboy-bot', 'mavi-katkat'], saves: 143, createdAt: NOW - 12 * H },
];

export const USERS: User[] = [
  { id: 'melis', name: 'Melis', handle: '@melis.k', bio: 'Kadıköy. Zara’dan koptum, Mango’ya geçtim.', visibility: 'public', isExample: true, signature: ['deri-ceket', 'l-trench', 'flowerbomb', 'gri-etek'] },
  { id: 'ece', name: 'Ece', handle: '@ece', bio: 'Beşiktaş. Deri ceket koleksiyoncusu.', visibility: 'public', isExample: true, signature: ['deri-ceket', 'mavi-katkat', 'l-jean', 'siyah-gece'] },
  { id: 'zeynep', name: 'Zeynep', handle: '@zeynep_a', bio: 'Nişantaşı. Parfüm önce, kıyafet sonra.', visibility: 'followers', isExample: true, signature: ['flowerbomb', 'l-loafer', 'l-gozluk', 'pembe-elbise'] },
  { id: 'selin', name: 'Selin', handle: '@selin.b', bio: 'Vintage Chanel takipçisi. Dolabım takipçilerime açık.', visibility: 'followers', isExample: true, signature: ['l-flap', 'coco-mademoiselle', 'fume-palto'] },
];

const P: Record<string, Partial<ShelfEntry>> = {
  'melis:deri-ceket': { store: 'Zara, Kadıköy', priceText: '2.499 TL' },
  'melis:kahve-canta': { store: 'İkinci el, Dolap', priceText: '3.200 TL' },
  'melis:gri-etek': { store: 'Koton, online', priceText: '540 TL' },
  'melis:pembe-elbise': { store: 'Trendyol', priceText: '1.190 TL' },
  'melis:fume-palto': { store: 'Mango, Akasya', priceText: '4.999 TL' },
  'melis:flowerbomb': { store: 'Sephora, İstinye Park', priceText: '6.200 TL (100 ml)' },
  'melis:l-trench': { store: 'Massimo Dutti, online', priceText: '6.990 TL' },
  'melis:l-lip': { store: 'Sephora, online', priceText: '1.350 TL' },
  'melis:l-spf': { store: 'Eczane', priceText: '890 TL' },
  'melis:kasmir-kazak': { store: 'İkinci el, Vinted', priceText: '1.400 TL' },
  'ece:deri-ceket': { store: 'Mango, Zorlu', priceText: '4.500 TL', url: 'https://shop.mango.com/tr' },
  'ece:mavi-katkat': { store: 'H&M, Cevahir', priceText: '899 TL' },
  'ece:siyah-gece': { store: 'Kiralık, davetcokelbisemyok', priceText: '3 gün 1.900 TL' },
  'ece:l-jean': { store: 'Zara, Zorlu', priceText: '1.790 TL' },
  'ece:l-spf': { store: 'Watsons', priceText: '940 TL' },
  'ece:kalp-tshirt': { hidden: true },
  'zeynep:flowerbomb': { store: 'Duty free, IST', priceText: '140 €' },
  'zeynep:l-loafer': { store: 'Massimo Dutti, Nişantaşı', priceText: '4.490 TL' },
  'zeynep:l-gozluk': { store: 'Beymen, online', priceText: '18.900 TL' },
  'zeynep:maxi-etek': { store: 'Zara, Nişantaşı', priceText: '1.290 TL' },
  'selin:l-flap': { store: 'Vestiaire Collective (ikinci el)', priceText: '2019 üretim, 4.100 €' },
  'selin:coco-mademoiselle': { store: 'Chanel, Nişantaşı', priceText: '9.800 TL' },
};
const sh = (userId: string, itemId: string, shelf: 'owned' | 'want', createdAt: number): ShelfEntry => ({ userId, itemId, shelf, createdAt, ...(P[userId + ':' + itemId] ?? {}) });

export const SHELVES: ShelfEntry[] = [
  ...['deri-ceket', 'kahve-canta', 'gri-etek', 'pembe-elbise', 'fume-palto', 'mavi-katkat', 'flowerbomb', 'l-trench', 'l-lip', 'l-spf', 'kasmir-kazak'].map((itemId, i) => sh('melis', itemId, 'owned', NOW - (20 + i * 30) * H)),
  sh('melis', 'l-flap', 'want', NOW - 5 * H),
  ...['deri-ceket', 'mavi-katkat', 'kalp-tshirt', 'siyah-gece', 'coco-mademoiselle', 'l-jean', 'l-spf'].map((itemId, i) => sh('ece', itemId, 'owned', NOW - (9 + i * 40) * H)),
  sh('ece', 'l-loafer', 'want', NOW - 2 * H),
  ...['pembe-elbise', 'sari-sort', 'flowerbomb', 'l-jean', 'l-loafer', 'l-gozluk', 'maxi-etek'].map((itemId, i) => sh('zeynep', itemId, 'owned', NOW - (30 + i * 50) * H)),
  ...['l-flap', 'coco-mademoiselle', 'fume-palto'].map((itemId, i) => sh('selin', itemId, 'owned', NOW - (60 + i * 70) * H)),
];

export const REVIEWS: Review[] = [
  // pieces
  { id: 'r1', userId: 'melis', targetType: 'item', targetId: 'pembe-elbise', rating: 5, body: 'Mezuniyet sonrası için aldım, tam 2011 hissi. Boyu kısa, topukla şahane.', createdAt: NOW - 26 * H, likes: 12 },
  { id: 'r2', userId: 'zeynep', targetType: 'item', targetId: 'deri-ceket', rating: 4, body: 'Üç kıştır giyiyorum. Hande gibi beyaz tişört üstüne, bitti.', createdAt: NOW - 50 * H, likes: 31 },
  { id: 'r3', userId: 'ece', targetType: 'item', targetId: 'deri-ceket', rating: 5, body: 'Dolabımdaki en çok giydiğim parça. Her şeyle gidiyor.', createdAt: NOW - 8 * H, likes: 9 },
  { id: 'r4', userId: 'selin', targetType: 'item', targetId: 'siyah-gece', rating: 4, body: 'Davette herkes sordu. Dekolte iddialı, bant şart.', createdAt: NOW - 90 * H, likes: 7 },
  { id: 'r5', userId: 'ece', targetType: 'item', targetId: 'l-lip', rating: 4, body: 'Renk tutuyor, kuru etmiyor. Fiyatı dudak ürünü için fazla.', createdAt: NOW - 3 * H, likes: 4 },
  { id: 'r6', userId: 'selin', targetType: 'item', targetId: 'l-flap', rating: 5, body: 'On yıl sonra da aynı çanta. Zammı düşünmeden al.', createdAt: NOW - 120 * H, likes: 44 },
  { id: 'r7', userId: 'zeynep', targetType: 'item', targetId: 'flowerbomb', rating: 5, body: 'Kalıcılığı 10 saat. Kışın daha iyi, yazda biraz ağır.', createdAt: NOW - 14 * H, likes: 18 },
  { id: 'r15', userId: 'melis', targetType: 'item', targetId: 'l-flap', rating: 4, body: 'İstiyorum rafımda bir yıldır duruyor. Zam gelmeden mi, ikinci el mi? Bunu tartışalım.', createdAt: NOW - 1 * H, likes: 3 },
  { id: 'r16', userId: 'zeynep', targetType: 'item', targetId: 'maxi-etek', rating: 3, body: 'Güzel ama bu yaz sokakta beş kişide gördüm. Seneye giyer miyim, emin değilim.', createdAt: NOW - 11 * H, likes: 6 },
  // brands
  { id: 'b1', userId: 'melis', targetType: 'brand', targetId: 'zara', rating: 2, brandStatus: 'left', body: 'Kalıpları hâlâ en iyisi ama üç yıkamada her şey boncuklanıyor. Etiketi çevir: polyester.', createdAt: NOW - 24 * H, likes: 23 },
  { id: 'b2', userId: 'ece', targetType: 'brand', targetId: 'mango', rating: 4, brandStatus: 'loyal', body: 'Deri ve yün parçaları Zara’nın iki katı dayanıyor. Basic’leri almayın, dış giyimi alın.', createdAt: NOW - 40 * H, likes: 15 },
  { id: 'b3', userId: 'selin', targetType: 'brand', targetId: 'chanel', rating: 4, brandStatus: 'sometimes', body: 'Çanta ve parfüm beş yıldız; hazır giyim fiyatı artık savunulamaz. İkinci el şart oldu.', createdAt: NOW - 200 * H, likes: 27 },
  { id: 'b4', userId: 'zeynep', targetType: 'brand', targetId: 'massimo', rating: 5, brandStatus: 'loyal', body: 'Sessiz lüksün ulaşılabilir hâli. Loafer ve trençkot için başka yere bakmıyorum.', createdAt: NOW - 150 * H, likes: 11 },
  // shows
  { id: 's1', userId: 'selin', targetType: 'show', targetId: 'chanel-ss26', rating: 5, body: 'Blazy Chanel’i sokağa indirdi: tüvit var ama kostüm yok. Lagerfeld sonrası ilk kez “bunu giyerim” dedim.', createdAt: NOW - 700 * H, likes: 58 },
  { id: 's2', userId: 'zeynep', targetType: 'show', targetId: 'chanel-ss26', rating: 4, body: 'Güzel, akıllı, satılabilir. Beklediğim kadar cesur değil; ikinci koleksiyonu bekliyorum.', createdAt: NOW - 690 * H, likes: 19 },
  { id: 's3', userId: 'ece', targetType: 'show', targetId: 'dior-ss26', rating: 3, body: 'Anderson’ın Loewe mizahı Dior’da yarım kalmış gibi. Erkek koleksiyonu daha netti.', createdAt: NOW - 710 * H, likes: 22 },
  { id: 's4', userId: 'melis', targetType: 'show', targetId: 'miumiu-ss26', rating: 4, body: 'Miuccia her sezon aynı kızı yeniden kuruyor ve ben her sezon o kız olmak istiyorum.', createdAt: NOW - 705 * H, likes: 34 },
  { id: 's5', userId: 'selin', targetType: 'show', targetId: 'bottega-ss26', rating: 4, body: 'Trotter deriyi Blazy kadar iyi anlıyor. Sessiz ama kendinden emin bir başlangıç.', createdAt: NOW - 1200 * H, likes: 13 },
  // styles
  { id: 'st1', userId: 'zeynep', targetType: 'style', targetId: 'boho', rating: 2, body: 'Chloé podyumda güzeldi; sokakta herkes aynı dantel eteği giyince bitti. Trend, stil değil.', createdAt: NOW - 36 * H, likes: 41 },
  { id: 'st2', userId: 'melis', targetType: 'style', targetId: 'sessiz-luks', rating: 4, body: 'Dolabımı küçülttü, harcamamı büyüttü. Kaşmir bir kere alınıyor ama bir kere 9 bin.', createdAt: NOW - 60 * H, likes: 29 },
  { id: 'st3', userId: 'ece', targetType: 'style', targetId: 'western', rating: 3, body: 'Bot tek başına harika. Bot + püskül + kemer = kostüm partisi.', createdAt: NOW - 80 * H, likes: 8 },
  { id: 'st4', userId: 'selin', targetType: 'style', targetId: 'old-money', rating: 2, body: 'Zengin görünmek için giyinmek, zengin olmamanın en pahalı yolu.', createdAt: NOW - 100 * H, likes: 63 },
  { id: 'st5', userId: 'melis', targetType: 'style', targetId: '2011-glam', rating: 4, body: 'Hande’nin dolabı tam olarak bu. Bugün giysem kostüm, 2011’de giysem hayat.', createdAt: NOW - 20 * H, likes: 17 },
  // lists / wardrobes
  { id: 'l1', userId: 'ece', targetType: 'list', targetId: 'dolap-hande', rating: 5, body: 'Dizinin yarısını bu dolap için izledim. Taba montun markası bulunursa buraya yazın.', createdAt: NOW - 200 * H, likes: 52 },
  { id: 'l2', userId: 'melis', targetType: 'list', targetId: 'dolap-lara', rating: 4, body: 'Nereden aldığını yazması çok iyi; fiyatlar gerçek. Hepsi bej ama tutarlı.', createdAt: NOW - 50 * H, likes: 14 },
  { id: 'l3', userId: 'zeynep', targetType: 'list', targetId: 'ilk-maas', rating: 5, body: 'Yirmi yaşımda bunu okusaydım beş yıl kazanırdım.', createdAt: NOW - 40 * H, likes: 21 },
];

export const COMMENTS: Comment[] = [
  { id: 'c1', reviewId: 'r15', userId: 'selin', body: 'İkinci el. Sıfır fiyatı artık mantıksız; 2019 üretim bir classic al, kondisyonu iyi olsun.', createdAt: NOW - 0.8 * H },
  { id: 'c2', reviewId: 'r15', userId: 'ece', body: 'Bence zam gelmeden sıfır. İkinci elde sahte riski beni korkutuyor.', createdAt: NOW - 0.5 * H },
  { id: 'c5', reviewId: 'r3', userId: 'melis', body: 'Beyaz tişört + bu ceket; Hande’nin 1. bölümü. Bende de var.', createdAt: NOW - 7 * H },
  { id: 'c6', reviewId: 'b1', userId: 'ece', body: 'Aynen. Dış giyim hâlâ iyi ama triko bitti.', createdAt: NOW - 22 * H },
  { id: 'c7', reviewId: 's1', userId: 'melis', body: 'Katılıyorum ama fiyat etiketini görünce “sokağa indirdi” kısmı tartışılır.', createdAt: NOW - 650 * H },
  { id: 'c8', reviewId: 'st1', userId: 'melis', body: 'Boho’nun suçu yok, Zara’nın kopyasının suçu.', createdAt: NOW - 30 * H },
  { id: 'c9', reviewId: 'st4', userId: 'zeynep', body: 'Yine de tüvit ceket güzel bir ceket.', createdAt: NOW - 90 * H },
];

export const FOLLOWS: Follow[] = [
  { followerId: 'melis', followeeId: 'ece', status: 'accepted' }, { followerId: 'melis', followeeId: 'zeynep', status: 'accepted' },
  { followerId: 'ece', followeeId: 'melis', status: 'accepted' }, { followerId: 'zeynep', followeeId: 'melis', status: 'accepted' }, { followerId: 'selin', followeeId: 'melis', status: 'accepted' },
];

export const PERSONA_FOLLOWS: PersonaFollow[] = [
  { userId: 'melis', personaId: 'hande' }, { userId: 'ece', personaId: 'hande' }, { userId: 'zeynep', personaId: 'lara' }, { userId: 'selin', personaId: 'lara' },
];

export const TAGS = ['Gündüz', 'Gece', 'Davet', 'Yaz', 'Kış'];
