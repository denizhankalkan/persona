import React, { useState } from 'react';
import { Linking, Pressable, View } from 'react-native';
import { Stack, useLocalSearchParams, useRouter } from 'expo-router';
import { Screen } from '@/components/Screen';
import { Avatar, Body, Card, Chip, Display, Eyebrow, Section, Small, Tag } from '@/components/ui';
import { ItemGrid, ItemRow, ListCard, ReviewList } from '@/components/cards';
import { ProductImage } from '@/components/ProductImage';
import { VISIBILITY_LABEL } from '@/data/repo';
import type { Item } from '@/data/types';
import { useStore } from '@/store';
import { useTheme } from '@/theme';

/** Someone else's wardrobe, as far as they allow. No stars on people: likes and comments on pieces only. */
export default function UserScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { c } = useTheme();
  const { user, shelvesOf, item, reviewsBy, followStatus, toggleFollow, snap, access, storesOf, signatureOf, allLists } = useStore();
  const router = useRouter();
  const [tab, setTab] = useState<'owned' | 'want' | 'lists' | 'reviews'>('owned');
  const u = user(String(id));
  if (!u) return <Screen><Small>Kişi bulunamadı.</Small></Screen>;
  const acc = access(u.id);
  const st = followStatus(u.id);
  const entries = shelvesOf(u.id);
  const shown = entries.filter((s) => s.shelf === (tab === 'want' ? 'want' : 'owned')).map((s) => item(s.itemId)).filter(Boolean) as Item[];
  const clothing = shown.filter((i) => i.type === 'clothing');
  const other = shown.filter((i) => i.type !== 'clothing');
  const reviews = reviewsBy(u.id);
  const lists = allLists().filter((l) => l.authorId === u.id);
  const personas = snap.personaFollows.filter((f) => f.userId === u.id).map((f) => snap.personas.find((p) => p.id === f.personaId)).filter(Boolean);
  const stores = storesOf(u.id);
  const withStore = entries.filter((s) => s.shelf === 'owned' && s.store);
  const sig = acc === 'open' ? signatureOf(u.id) : [];
  const followLabel = st === 'accepted' ? 'Takiptesin ✓' : st === 'pending' ? 'İstek gönderildi…' : u.visibility === 'public' ? 'Takip et' : 'Takip isteği gönder';
  const open = acc === 'open';
  return (
    <>
      <Stack.Screen options={{ title: u.name }} />
      <Screen>
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 12 }}>
          <Avatar name={u.name} size={52} />
          <View style={{ flex: 1, gap: 1 }}>
            <Display size="lg">{u.name}</Display>
            <Small>{u.handle}{u.isExample ? ' · örnek' : ''} · {VISIBILITY_LABEL[u.visibility].toLowerCase()}</Small>
            {u.bio ? <Body muted style={{ fontSize: 14 }}>{u.bio}</Body> : null}
          </View>
        </View>
        <View style={{ flexDirection: 'row', gap: 8, flexWrap: 'wrap', alignItems: 'center' }}>
          <Chip label={followLabel} on={st === 'accepted'} tone={st === 'pending' ? 'gold' : 'green'} onPress={() => toggleFollow(u.id)} />
          {personas.map((p) => <Pressable key={p!.id} onPress={() => router.push(`/liste/dolap-${p!.id}`)}><Tag label={`${p!.shortName}’ya bürünüyor`} tone="ink" /></Pressable>)}
        </View>
        <View style={{ flexDirection: 'row', borderTopWidth: 1, borderBottomWidth: 1, borderColor: c.line, paddingVertical: 12 }}>
          {[[open ? entries.filter((s) => s.shelf === 'owned').length : '·', 'Bende'], [open ? entries.filter((s) => s.shelf === 'want').length : '·', 'İstiyorum'], [reviews.length, 'Yorum'], [lists.length, 'Liste']].map(([n, l]) => (
            <View key={String(l)} style={{ flex: 1, alignItems: 'center', gap: 2 }}><Display size="md">{String(n)}</Display><Eyebrow>{String(l)}</Eyebrow></View>
          ))}
        </View>

        {acc === 'locked' || acc === 'pending' ? (
          <Card style={{ gap: 6 }}>
            <Display size="md">Dolabı takipçilerine açık.</Display>
            <Body muted>{acc === 'pending' ? `${u.name} isteğini onayladığında raflarını ve nereden aldıklarını göreceksin.` : `${u.name} dolabını yalnızca onayladığı kişilere gösteriyor. İstek gönder; kabul ederse raflarını ve nereden aldıklarını görürsün.`}</Body>
          </Card>
        ) : acc === 'private' ? (
          <Card style={{ gap: 6 }}>
            <Display size="md">Dolabı gizli.</Display>
            <Body muted>{u.name} dolabını kimseyle paylaşmıyor. Yorumları ve listeleri yine de aşağıda.</Body>
          </Card>
        ) : (
          <>
            {sig.length ? (
              <Section title="İmza parçaları" kicker>
                <View style={{ flexDirection: 'row', gap: 8 }}>
                  {sig.map((i) => <Pressable key={i.id} onPress={() => router.push(`/item/${i.id}`)} style={{ flex: 1, gap: 4 }}><ProductImage item={i} ratio={0.8} size={11} /><Small numberOfLines={2} style={{ fontSize: 10 }}>{i.name}</Small></Pressable>)}
                  {Array.from({ length: 4 - sig.length }).map((_, k) => <View key={k} style={{ flex: 1 }} />)}
                </View>
              </Section>
            ) : null}
            {stores.length ? (
              <Section title="Nereden alışveriş yapıyor?" kicker right={<Small>{withStore.length} parçadan</Small>}>
                <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 6 }}>{stores.map((s) => <Tag key={s.store} label={`${s.store} · ${s.n}`} tone="green" />)}</View>
                <View>
                  {withStore.slice(0, 6).map((s) => {
                    const it = item(s.itemId); if (!it) return null;
                    return (
                      <Pressable key={s.itemId} onPress={() => router.push(`/item/${it.id}`)} style={{ flexDirection: 'row', alignItems: 'center', gap: 10, borderBottomWidth: 1, borderBottomColor: c.line, paddingVertical: 8 }}>
                        <View style={{ width: 34 }}><ProductImage item={it} ratio={0.8} size={8} /></View>
                        <View style={{ flex: 1 }}>
                          <Body weight="semi" style={{ fontSize: 14, lineHeight: 18 }}>{it.name}</Body>
                          <Small>{s.store}{s.priceText ? ` · ${s.priceText}` : ''}</Small>
                        </View>
                        {s.url ? <Pressable onPress={() => Linking.openURL(s.url!)}><Tag label="Link" tone="green" /></Pressable> : null}
                      </Pressable>
                    );
                  })}
                </View>
              </Section>
            ) : null}
          </>
        )}

        <View style={{ gap: 14 }}>
          <View style={{ flexDirection: 'row', gap: 6, flexWrap: 'wrap' }}>
            {open ? <Chip label="Bende" on={tab === 'owned'} tone="green" onPress={() => setTab('owned')} /> : null}
            {open ? <Chip label="İstiyorum" on={tab === 'want'} onPress={() => setTab('want')} /> : null}
            <Chip label={`Listeleri · ${lists.length}`} on={tab === 'lists' || !open && tab !== 'reviews'} onPress={() => setTab('lists')} />
            <Chip label={`Yorumları · ${reviews.length}`} on={tab === 'reviews'} onPress={() => setTab('reviews')} />
          </View>
          {tab === 'reviews' ? <ReviewList reviews={reviews} showTarget empty="Henüz yorum yazmamış." />
            : tab === 'lists' || !open ? (lists.length ? <View style={{ gap: 16 }}>{lists.map((l) => <ListCard key={l.id} l={l} wide />)}</View> : <Small>Henüz liste yapmamış.</Small>)
            : (
              <>
                {clothing.length ? <ItemGrid items={clothing} cols={3} /> : null}
                {other.length ? <View>{other.map((i) => <ItemRow key={i.id} item={i} />)}</View> : null}
                {!shown.length ? <Small>Bu raf boş.</Small> : null}
              </>
            )}
        </View>
      </Screen>
    </>
  );
}
