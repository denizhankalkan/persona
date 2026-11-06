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
import { useT } from '@/i18n';

/** A friend's wardrobe, as far as she allows: her showcase, model by model, with where she bought it. No stars on people. */
export default function UserScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { c } = useTheme();
  const { user, shelvesOf, item, reviewsBy, followStatus, toggleFollow, snap, access, storesOf, signatureOf, allLists } = useStore();
  const { t } = useT();
  const router = useRouter();
  const [tab, setTab] = useState<'showcase' | 'saved' | 'lists' | 'reviews'>('showcase');
  const u = user(String(id));
  if (!u) return <Screen><Small>{t('Kişi bulunamadı.')}</Small></Screen>;
  const acc = access(u.id);
  const st = followStatus(u.id);
  const entries = shelvesOf(u.id);
  const shown = entries.filter((s) => s.shelf === (tab === 'saved' ? 'saved' : 'showcase')).map((s) => item(s.itemId)).filter(Boolean) as Item[];
  const clothing = shown.filter((i) => i.type === 'clothing');
  const other = shown.filter((i) => i.type !== 'clothing');
  const reviews = reviewsBy(u.id);
  const lists = allLists().filter((l) => l.authorId === u.id);
  const personas = snap.personaFollows.filter((f) => f.userId === u.id).map((f) => snap.personas.find((p) => p.id === f.personaId)).filter(Boolean);
  const stores = storesOf(u.id);
  const withStore = entries.filter((s) => s.shelf === 'showcase' && s.store);
  const sig = acc === 'open' ? signatureOf(u.id) : [];
  const followLabel = t(st === 'accepted' ? (u.visibility === 'public' ? 'Takiptesin ✓' : 'Arkadaşsınız ✓') : st === 'pending' ? 'İstek gönderildi…' : u.visibility === 'public' ? 'Takip et' : 'Arkadaş ol');
  const open = acc === 'open';
  return (
    <>
      <Stack.Screen options={{ title: u.name }} />
      <Screen>
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 12 }}>
          <Avatar name={u.name} size={52} />
          <View style={{ flex: 1, gap: 1 }}>
            <Display size="lg">{u.name}</Display>
            <Small>{u.handle}{u.isExample ? ' · ' + t('örnek') : ''} · {t(VISIBILITY_LABEL[u.visibility]).toLowerCase()}</Small>
            {u.bio ? <Body muted style={{ fontSize: 14 }}>{u.bio}</Body> : null}
          </View>
        </View>
        <View style={{ flexDirection: 'row', gap: 8, flexWrap: 'wrap', alignItems: 'center' }}>
          <Chip label={followLabel} on={st === 'accepted'} tone={st === 'pending' ? 'gold' : 'green'} onPress={() => toggleFollow(u.id)} />
          {personas.map((p) => <Pressable key={p!.id} onPress={() => router.push(`/liste/dolap-${p!.id}`)}><Tag label={t('{p}’ya bürünüyor', { p: p!.shortName })} tone="ink" /></Pressable>)}
        </View>
        <View style={{ flexDirection: 'row', borderTopWidth: 1, borderBottomWidth: 1, borderColor: c.line, paddingVertical: 12 }}>
          {([[open ? entries.filter((s) => s.shelf === 'showcase').length : '·', 'Vitrin'], [open ? entries.filter((s) => s.shelf === 'saved').length : '·', 'Favoriler'], [reviews.length, 'Yorum'], [lists.length, 'Liste']] as [number | string, string][]).map(([n, l]) => (
            <View key={l} style={{ flex: 1, alignItems: 'center', gap: 2 }}><Display size="md">{String(n)}</Display><Eyebrow>{t(l)}</Eyebrow></View>
          ))}
        </View>

        {acc === 'locked' || acc === 'pending' ? (
          <Card style={{ gap: 6 }}>
            <Display size="md">{t('Dolabı arkadaşlarına açık.')}</Display>
            <Body muted>{t(acc === 'pending' ? '{u} isteğini onayladığında aldıklarını model model, nereden aldığıyla göreceksin.' : '{u} dolabını yalnızca onayladığı arkadaşlarına gösteriyor. İstek gönder; kabul ederse aldıklarını model model, nereden aldığıyla görürsün.', { u: u.name })}</Body>
          </Card>
        ) : acc === 'private' ? (
          <Card style={{ gap: 6 }}>
            <Display size="md">{t('Dolabı gizli.')}</Display>
            <Body muted>{t('{u} dolabını kimseyle paylaşmıyor. Yorumları ve listeleri yine de aşağıda.', { u: u.name })}</Body>
          </Card>
        ) : (
          <>
            {sig.length ? (
              <Section title={t('İmza parçaları')} kicker>
                <View style={{ flexDirection: 'row', gap: 8 }}>
                  {sig.map((i) => <Pressable key={i.id} onPress={() => router.push(`/item/${i.id}`)} style={{ flex: 1, gap: 4 }}><ProductImage item={i} ratio={0.8} size={11} /><Small numberOfLines={2} style={{ fontSize: 10 }}>{i.name}</Small></Pressable>)}
                  {Array.from({ length: 4 - sig.length }).map((_, k) => <View key={k} style={{ flex: 1 }} />)}
                </View>
              </Section>
            ) : null}
            {stores.length ? (
              <Section title={t('Nereden alışveriş yapıyor?')} kicker right={<Small>{t('{n} parçadan', { n: withStore.length })}</Small>}>
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
                        {s.url ? <Pressable onPress={() => Linking.openURL(s.url!)}><Tag label={t('Link')} tone="green" /></Pressable> : null}
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
            {open ? <Chip label={t('Vitrin')} on={tab === 'showcase'} tone="green" onPress={() => setTab('showcase')} /> : null}
            {open ? <Chip label={t('Favoriler')} on={tab === 'saved'} onPress={() => setTab('saved')} /> : null}
            <Chip label={t('Listeleri · {n}', { n: lists.length })} on={tab === 'lists' || (!open && tab !== 'reviews')} onPress={() => setTab('lists')} />
            <Chip label={t('Yorumları · {n}', { n: reviews.length })} on={tab === 'reviews'} onPress={() => setTab('reviews')} />
          </View>
          {tab === 'reviews' ? <ReviewList reviews={reviews} showTarget empty="Henüz yorum yazmamış." />
            : tab === 'lists' || !open ? (lists.length ? <View style={{ gap: 16 }}>{lists.map((l) => <ListCard key={l.id} l={l} wide />)}</View> : <Small>{t('Henüz liste yapmamış.')}</Small>)
            : (
              <>
                {clothing.length ? <ItemGrid items={clothing} cols={3} /> : null}
                {other.length ? <View>{other.map((i) => <ItemRow key={i.id} item={i} />)}</View> : null}
                {!shown.length ? <Small>{t('Bu raf boş.')}</Small> : null}
              </>
            )}
        </View>
      </Screen>
    </>
  );
}
