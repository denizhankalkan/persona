import React, { useState } from 'react';
import { Linking, Platform, Pressable, View } from 'react-native';
import { Stack, useLocalSearchParams, useRouter } from 'expo-router';
import * as ImagePicker from 'expo-image-picker';
import { Screen } from '@/components/Screen';
import { Avatar, Body, Chip, Display, Eyebrow, Field, LinkText, Section, Small, Tag } from '@/components/ui';
import { ProductImage } from '@/components/ProductImage';
import { fmt } from '@/components/cards';
import { RatingLine, Reviews } from '@/components/Reviews';
import { PurchaseForm } from '@/components/PurchaseForm';
import { useStore } from '@/store';
import { useTheme } from '@/theme';

export default function ItemScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { c } = useTheme();
  const { item, myShelf, myEntry, setShelf, purchasesOf, me, snap, setPhoto, setLink, listsWith, addList, toggleListItem, style } = useStore();
  const router = useRouter();
  const it = item(String(id));
  const [linkDraft, setLinkDraft] = useState('');
  const [addingLink, setAddingLink] = useState(false);
  const [listing, setListing] = useState(false);
  const [newList, setNewList] = useState('');
  if (!it) return <Screen><Small>Parça bulunamadı.</Small></Screen>;
  const subject = { kind: 'item' as const, id: it.id };
  const shelf = myShelf(it.id);
  const entry = myEntry(it.id);
  const purchases = purchasesOf(it.id);
  const personas = snap.personas.filter((p) => p.itemIds.includes(it.id));
  const personaPurchases = personas.filter((p) => p.purchases?.[it.id]).map((p) => ({ p, pu: p.purchases![it.id] }));
  const link = me.links?.[it.id] ?? it.url;
  const hasPhoto = Boolean(me.photos?.[it.id] || it.imageUrl || link);
  const inLists = listsWith(it.id);
  const styles = (it.styleIds ?? []).map(style).filter(Boolean);

  const pickPhoto = async () => {
    const perm = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!perm.granted && Platform.OS !== 'web') return;
    const res = await ImagePicker.launchImageLibraryAsync({ mediaTypes: ['images'], quality: 0.7, base64: true, allowsEditing: true, aspect: [4, 5] });
    if (res.canceled || !res.assets?.[0]) return;
    const a = res.assets[0];
    const uri = a.base64 ? `data:${a.mimeType ?? 'image/jpeg'};base64,${a.base64}` : a.uri;
    await setPhoto(it.id, uri);
  };
  const saveLink = async () => {
    const u = linkDraft.trim();
    if (!/^https?:\/\//.test(u)) return;
    await setLink(it.id, u); setLinkDraft(''); setAddingLink(false);
  };
  const searchUrl = 'https://www.google.com/search?tbm=shop&q=' + encodeURIComponent(it.searchQuery);

  return (
    <>
      <Stack.Screen options={{ title: it.category }} />
      <Screen>
        <View style={{ flexDirection: 'row', gap: 14 }}>
          <View style={{ width: 150 }}><ProductImage item={it} ratio={0.8} size={16} /></View>
          <View style={{ flex: 1, gap: 6, justifyContent: 'center' }}>
            {it.brandId ? <LinkText label={`${it.brandName} →`} onPress={() => router.push(`/marka/${it.brandId}`)} /> : <Eyebrow>{it.brandName ?? it.category}</Eyebrow>}
            <Display size="lg">{it.name}</Display>
            <Small>{[it.year, it.priceText, personas.length ? personas.map((p) => p.shortName).join(', ') : null].filter(Boolean).join(' · ')}</Small>
            <RatingLine subject={subject} size={14} />
          </View>
        </View>

        <View style={{ flexDirection: 'row', gap: 8, flexWrap: 'wrap' }}>
          <Chip label={me.photos?.[it.id] ? 'Fotoğrafı değiştir' : 'Fotoğraf ekle'} onPress={pickPhoto} />
          <Chip label={link ? 'Resmi sayfa →' : 'Resmi link ekle'} tone="green" onPress={() => (link && !addingLink ? Linking.openURL(link) : setAddingLink((v) => !v))} />
          {link ? <Chip label="Linki değiştir" onPress={() => setAddingLink((v) => !v)} /> : null}
          {me.photos?.[it.id] ? <Chip label="Fotoğrafı kaldır" onPress={() => setPhoto(it.id, null)} /> : null}
        </View>
        {addingLink ? (
          <View style={{ flexDirection: 'row', gap: 8 }}>
            <Field style={{ flex: 1 }} value={linkDraft} onChangeText={setLinkDraft} placeholder="Markanın ürün sayfası linki" autoCapitalize="none" keyboardType="url" />
            <Chip label="Kaydet" on onPress={saveLink} />
          </View>
        ) : null}
        {!hasPhoto ? <Small>Fotoğraf markanın resmi ürün sayfasından gelir: linki yapıştır, görsel kendiliğinden gelsin. Dizi karesi için galeriden ekle.</Small> : null}
        {it.notes ? <Body muted>{it.notes}</Body> : null}
        {it.note ? <Small>{it.note}</Small> : null}

        <View style={{ flexDirection: 'row', gap: 8 }}>
          <Pressable onPress={() => setShelf(it.id, shelf === 'owned' ? null : 'owned')} style={{ flex: 1, padding: 12, backgroundColor: shelf === 'owned' ? c.ink : c.accent }}>
            <Display size="sm" style={{ color: shelf === 'owned' ? c.inkFg : c.accentInk }}>{shelf === 'owned' ? 'Bende ✓' : 'Bende'}</Display>
            <Small style={{ color: shelf === 'owned' ? c.inkFg : c.accentInk, opacity: 0.85 }}>{fmt(it.ownedCount + (shelf === 'owned' ? 1 : 0))} kişide</Small>
          </Pressable>
          <Pressable onPress={() => setShelf(it.id, shelf === 'want' ? null : 'want')} style={{ flex: 1, padding: 12, backgroundColor: c.surface, borderWidth: 1, borderColor: shelf === 'want' ? c.fg : c.line }}>
            <Display size="sm">{shelf === 'want' ? 'İstiyorum ♥' : 'İstiyorum'}</Display>
            <Small>rafına koy</Small>
          </Pressable>
          <Pressable onPress={() => setListing((v) => !v)} style={{ flex: 1, padding: 12, backgroundColor: c.surface, borderWidth: 1, borderColor: listing ? c.fg : c.line }}>
            <Display size="sm">Listeye</Display>
            <Small>ekle</Small>
          </Pressable>
        </View>
        {shelf === 'owned' && entry ? <PurchaseForm entry={entry} /> : null}

        {listing ? (
          <View style={{ gap: 8, borderWidth: 1, borderColor: c.line, padding: 12 }}>
            <Eyebrow>Hangi listeye?</Eyebrow>
            <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 6 }}>
              {me.lists.map((l) => <Chip key={l.id} label={l.title} on={l.itemIds.includes(it.id)} tone="green" onPress={() => toggleListItem(l.id, it.id)} />)}
            </View>
            <View style={{ flexDirection: 'row', gap: 8 }}>
              <Field style={{ flex: 1 }} value={newList} onChangeText={setNewList} placeholder="Yeni liste — Kış 2026 kapsülüm" />
              <Chip label="Oluştur" on onPress={async () => { if (!newList.trim()) return; await addList({ title: newList.trim(), itemIds: [it.id] }); setNewList(''); }} />
            </View>
          </View>
        ) : null}

        {(purchases.length || personaPurchases.length) ? (
          <Section title="Nereden aldılar?" ornament right={<Small>izin verdikleri kadar</Small>}>
            <View>
              {personaPurchases.map(({ p, pu }) => (
                <Pressable key={p.id} onPress={() => router.push(`/liste/dolap-${p.id}`)} style={{ flexDirection: 'row', alignItems: 'center', gap: 12, borderBottomWidth: 1, borderBottomColor: c.line, paddingVertical: 10 }}>
                  <Avatar name={p.shortName} size={30} />
                  <View style={{ flex: 1 }}><Body weight="semi" style={{ fontSize: 14 }}>{p.shortName} <Small>{p.handle ?? ''}</Small></Body><Small muted={false}>{pu.store}{pu.priceText ? ` · ${pu.priceText}` : ''}</Small></View>
                  <Tag label="Herkese açık" tone="green" />
                </Pressable>
              ))}
              {purchases.map(({ user: u, entry: e }) => (
                <Pressable key={u.id} onPress={() => router.push(`/user/${u.id}`)} style={{ flexDirection: 'row', alignItems: 'center', gap: 12, borderBottomWidth: 1, borderBottomColor: c.line, paddingVertical: 10 }}>
                  <Avatar name={u.name} size={30} />
                  <View style={{ flex: 1 }}><Body weight="semi" style={{ fontSize: 14 }}>{u.name} <Small>{u.handle}</Small></Body><Small muted={false}>{e.store}{e.priceText ? ` · ${e.priceText}` : ''}</Small></View>
                  {e.url ? <Pressable onPress={() => Linking.openURL(e.url!)}><Tag label="Link" tone="green" /></Pressable> : null}
                </Pressable>
              ))}
            </View>
          </Section>
        ) : null}

        <View style={{ flexDirection: 'row', gap: 16, flexWrap: 'wrap' }}>
          {link ? <LinkText label={`${it.brandName ?? 'Resmi sayfa'} →`} onPress={() => Linking.openURL(link)} /> : null}
          <LinkText label="Benzerini ara →" onPress={() => Linking.openURL(searchUrl)} style={{ color: c.muted }} />
        </View>

        <Reviews subject={subject} title={it.type === 'perfume' ? 'Sıkanlar ne diyor' : 'Giyenler ne diyor'} />

        {inLists.length || styles.length ? (
          <Section title="Listelerde ve stillerde" kicker>
            <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 6 }}>
              {inLists.map((l) => <Chip key={l.id} label={l.title} onPress={() => router.push(`/liste/${l.id}`)} />)}
              {styles.map((s) => <Chip key={s!.id} label={s!.name} tone="green" onPress={() => router.push(`/stil/${s!.id}`)} />)}
            </View>
          </Section>
        ) : null}
      </Screen>
    </>
  );
}
