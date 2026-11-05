import React, { useState } from 'react';
import { Pressable, View } from 'react-native';
import { Stack, useRouter } from 'expo-router';
import { Screen } from '@/components/Screen';
import { Body, Button, Chip, Display, Eyebrow, Field, Section, Small, StarPicker } from '@/components/ui';
import { ItemRow } from '@/components/cards';
import { Photo } from '@/components/ProductImage';
import { useStore } from '@/store';
import { useTheme } from '@/theme';
import type { Item, ItemType } from '@/data/types';

const CATS = ['Elbise', 'Ceket', 'Palto', 'Pantolon', 'Etek', 'Gömlek', 'Kazak', 'Ayakkabı', 'Çanta', 'Gözlük', 'Takı', 'Parfüm', 'Ürün'];
const typeOf = (cat: string): ItemType => (cat === 'Parfüm' ? 'perfume' : cat === 'Ürün' ? 'product' : 'clothing');
const isUrl = (s: string) => /^https?:\/\/\S+$/i.test(s.trim());

/**
 * Letterboxd's +: paste the official product link (photo and name come from it) or search
 * the catalog; then shelf, stars, two lines, where you bought it, visibility.
 */
export default function AddScreen() {
  const { c } = useTheme();
  const { allItems, addItem, setShelf, addReview, snap } = useStore();
  const router = useRouter();
  const [q, setQ] = useState('');
  const [draft, setDraft] = useState<{ url?: string; name: string; brand: string; cat: string; price: string } | null>(null);
  const [created, setCreated] = useState<Item | null>(null);
  const [shelf, setShelfState] = useState<'owned' | 'want' | null>('owned');
  const [rating, setRating] = useState(0);
  const [body, setBody] = useState('');
  const [store, setStore] = useState('');
  const [hidden, setHidden] = useState(false);
  const [busy, setBusy] = useState(false);

  const query = q.trim().toLowerCase();
  const results = query && !isUrl(q) ? allItems().filter((i) => (i.name + ' ' + (i.brandName ?? '') + ' ' + i.category).toLowerCase().includes(query)).slice(0, 6) : [];
  const brands = snap.brands;

  const start = () => {
    const url = isUrl(q) ? q.trim() : undefined;
    let brand = '';
    if (url) { const host = url.replace(/^https?:\/\/(www\.|shop\.|www2\.)?/, '').split('/')[0]; brand = brands.find((b) => host.includes(b.id) || host.includes(b.name.toLowerCase().replace(/\s/g, '')))?.name ?? ''; }
    setDraft({ url, name: url ? '' : q.trim(), brand, cat: 'Elbise', price: '' });
  };
  const create = async () => {
    if (!draft || !draft.name.trim() || busy) return;
    setBusy(true);
    const brandId = brands.find((b) => b.name.toLowerCase() === draft.brand.trim().toLowerCase())?.id;
    const it = await addItem({ type: typeOf(draft.cat), name: draft.name.trim(), category: draft.cat, brandName: draft.brand.trim() || undefined, brandId, color: '#F3F3F3', priceText: draft.price.trim() || undefined, url: draft.url });
    setCreated(it); setBusy(false);
  };
  const finish = async () => {
    if (!created || busy) return;
    setBusy(true);
    if (shelf) await setShelf(created.id, shelf, shelf === 'owned' ? { store: store.trim() || undefined, priceText: created.priceText, hidden } : {});
    if (rating > 0 && body.trim().length > 3) await addReview({ targetType: 'item', targetId: created.id, rating, body: body.trim() });
    setBusy(false);
    router.replace(`/item/${created.id}`);
  };

  return (
    <>
      <Stack.Screen options={{ title: 'Ekle', headerRight: () => (created ? <Pressable onPress={finish}><Small weight="bold" muted={false} style={{ color: c.accent, letterSpacing: 1.4, textTransform: 'uppercase', fontSize: 11 }}>Kaydet</Small></Pressable> : null) }} />
      <Screen>
        {!draft ? (
          <>
            <View style={{ gap: 6 }}>
              <Eyebrow>Resmi ürün linki ya da ara</Eyebrow>
              <Field value={q} onChangeText={setQ} placeholder="zara.com/… · ya da “bej trençkot”" autoCapitalize="none" keyboardType="url" />
              <Small>Linki yapıştırırsan fotoğraf ve marka resmi sayfadan gelir. Katalog buradan büyür.</Small>
            </View>
            {results.length ? (
              <Section title="Katalogda var" right={<Small>dokun, rafına koy</Small>}>
                <View>{results.map((i) => <ItemRow key={i.id} item={i} />)}</View>
              </Section>
            ) : null}
            {q.trim() ? <Button label={isUrl(q) ? 'Linkten ekle' : `“${q.trim()}” yeni parça olarak ekle`} onPress={start} /> : null}
            <View style={{ gap: 8, borderTopWidth: 1, borderTopColor: c.rule, paddingTop: 14 }}>
              <Eyebrow color={c.fg}>Nasıl çalışır</Eyebrow>
              <Body muted>1. Link yapıştır ya da ara. 2. Fotoğraf ve isim gelir, onayla. 3. Bende / İstiyorum, yıldız, iki satır. 4. Nereden aldım ve görünürlük.</Body>
            </View>
          </>
        ) : !created ? (
          <>
            <View style={{ flexDirection: 'row', gap: 14 }}>
              <View style={{ width: 120 }}><Photo id={'draft'} url={draft.url} label={draft.brand || 'Parça'} ratio={0.8} size={14} /></View>
              <View style={{ flex: 1, gap: 8 }}>
                <Eyebrow>Onayla</Eyebrow>
                <Field value={draft.name} onChangeText={(name) => setDraft({ ...draft, name })} placeholder="Parçanın adı — bej trençkot" />
                <Field value={draft.brand} onChangeText={(brand) => setDraft({ ...draft, brand })} placeholder="Marka" />
                <Field value={draft.price} onChangeText={(price) => setDraft({ ...draft, price })} placeholder="Fiyat (isteğe bağlı)" />
              </View>
            </View>
            <View style={{ gap: 8 }}>
              <Eyebrow>Kategori</Eyebrow>
              <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 6 }}>{CATS.map((k) => <Chip key={k} label={k} on={draft.cat === k} onPress={() => setDraft({ ...draft, cat: k })} />)}</View>
            </View>
            {draft.url ? <Small>{draft.url}</Small> : null}
            <Button label={busy ? 'Ekleniyor…' : 'Devam'} disabled={!draft.name.trim() || busy} onPress={create} />
            <Pressable onPress={() => setDraft(null)}><Small>← Geri</Small></Pressable>
          </>
        ) : (
          <>
            <View style={{ flexDirection: 'row', gap: 14, alignItems: 'center' }}>
              <View style={{ width: 72 }}><Photo id={created.id} url={created.url} imageUrl={created.imageUrl} label={created.brandName ?? created.category} ratio={0.8} size={10} /></View>
              <View style={{ flex: 1 }}><Display size="md">{created.name}</Display><Small>{created.brandName ?? created.category}{created.priceText ? ' · ' + created.priceText : ''}</Small></View>
            </View>
            <View style={{ gap: 8 }}>
              <Eyebrow>Raf</Eyebrow>
              <View style={{ flexDirection: 'row', gap: 6 }}>
                <Chip label="Bende" on={shelf === 'owned'} tone="green" onPress={() => setShelfState(shelf === 'owned' ? null : 'owned')} />
                <Chip label="İstiyorum" on={shelf === 'want'} onPress={() => setShelfState(shelf === 'want' ? null : 'want')} />
              </View>
            </View>
            <View style={{ gap: 8 }}>
              <Eyebrow>Yıldız ve iki satır</Eyebrow>
              <StarPicker value={rating} onChange={setRating} />
              <Field multiline value={body} onChangeText={setBody} maxLength={600} placeholder="Nasıl oturdu, nerede giydin, tekrar alır mıydın?" />
            </View>
            {shelf === 'owned' ? (
              <View style={{ gap: 8 }}>
                <Eyebrow color={c.accent}>Nereden aldın?</Eyebrow>
                <Field value={store} onChangeText={setStore} placeholder="Mağaza, şube ya da site — Zara İstinye Park, ikinci el, Trendyol…" />
                <View style={{ flexDirection: 'row', gap: 6, alignItems: 'center' }}>
                  <Chip label={hidden ? 'Gizli ●' : 'Takip edenler görür'} on={hidden} tone="ink" onPress={() => setHidden((v) => !v)} />
                  <Small>Her parça tek tek gizlenebilir.</Small>
                </View>
              </View>
            ) : null}
            <Button label={busy ? 'Kaydediliyor…' : 'Kaydet'} onPress={finish} disabled={busy} />
          </>
        )}
      </Screen>
    </>
  );
}
