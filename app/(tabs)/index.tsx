import React, { useEffect } from 'react';
import { Pressable, View } from 'react-native';
import { useRouter } from 'expo-router';
import { Screen } from '@/components/Screen';
import { Avatar, Body, Button, Display, Divider, Eyebrow, LinkText, Masthead, Section, Small, Tag } from '@/components/ui';
import { ItemStrip, ListCard, ReviewCard, ShowCard, timeAgo } from '@/components/cards';
import { ProductImage } from '@/components/ProductImage';
import { useStore } from '@/store';
import { useTheme } from '@/theme';
import type { Activity } from '@/data/types';

function ActivityRow({ a }: { a: Activity }) {
  const { c } = useTheme();
  const { userName, item, review, persona, list, snap } = useStore();
  const router = useRouter();
  const who = userName(a.userId);
  if (a.kind === 'review') {
    const r = review(a.reviewId);
    if (!r) return null;
    return <View style={{ paddingVertical: 4 }}><ReviewCard r={r} showTarget compact /></View>;
  }
  if (a.kind === 'shelf') {
    const it = item(a.itemId);
    if (!it) return null;
    const entry = snap.shelves.find((s) => s.userId === a.userId && s.itemId === a.itemId);
    return (
      <Pressable onPress={() => router.push(`/item/${it.id}`)} style={{ flexDirection: 'row', alignItems: 'center', gap: 12, paddingVertical: 4 }}>
        <Avatar name={who} size={30} />
        <View style={{ flex: 1 }}>
          <Body style={{ fontSize: 14 }}><Body weight="semi" style={{ fontSize: 14 }}>{who}</Body> {a.shelf === 'owned' ? '“bende” dedi' : 'istiyorum rafına koydu'}</Body>
          <Small>{it.name}{it.brandName ? ' · ' + it.brandName : ''} · {timeAgo(a.createdAt)}</Small>
          {entry?.store ? <Small muted={false} weight="semi" style={{ color: c.accent }}>{entry.store}{entry.priceText ? ` · ${entry.priceText}` : ''}</Small> : null}
        </View>
        <View style={{ width: 40 }}><ProductImage item={it} ratio={0.8} size={8} /></View>
      </Pressable>
    );
  }
  if (a.kind === 'comment') {
    const cm = snap.comments.find((x) => x.id === a.commentId);
    const r = cm ? review(cm.reviewId) : undefined;
    if (!cm || !r) return null;
    return (
      <Pressable onPress={() => router.push(`/review/${r.id}`)} style={{ flexDirection: 'row', alignItems: 'flex-start', gap: 12, paddingVertical: 4 }}>
        <Avatar name={who} size={30} />
        <View style={{ flex: 1 }}>
          <Body style={{ fontSize: 14 }}><Body weight="semi" style={{ fontSize: 14 }}>{who}</Body> {userName(r.userId)}’in yorumuna yazdı</Body>
          <Body numberOfLines={2} style={{ fontSize: 14 }}>“{cm.body}”</Body>
          <Small>{timeAgo(a.createdAt)}</Small>
        </View>
      </Pressable>
    );
  }
  if (a.kind === 'list') {
    const l = list(a.listId);
    if (!l) return null;
    return (
      <View style={{ gap: 8, paddingVertical: 4 }}>
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 12 }}>
          <Avatar name={who} size={30} />
          <Body style={{ fontSize: 14, flex: 1 }}><Body weight="semi" style={{ fontSize: 14 }}>{who}</Body> liste yaptı · <Small>{timeAgo(a.createdAt)}</Small></Body>
        </View>
        <ListCard l={l} wide />
      </View>
    );
  }
  const p = persona(a.personaId);
  if (!p) return null;
  return (
    <Pressable onPress={() => router.push(`/liste/dolap-${p.id}`)} style={{ flexDirection: 'row', alignItems: 'center', gap: 12, paddingVertical: 4 }}>
      <Avatar name={who} size={30} />
      <View style={{ flex: 1 }}>
        <Body style={{ fontSize: 14 }}><Body weight="semi" style={{ fontSize: 14 }}>{who}</Body> {p.shortName}’nın kimliğine bürünüyor</Body>
        <Small>{p.source}</Small>
      </View>
      <Tag label={p.kind === 'person' ? 'persona' : 'karakter'} tone="ink" />
    </Pressable>
  );
}

export default function FeedScreen() {
  const { c } = useTheme();
  const { ready, me, feed, following, snap, trending } = useStore();
  const router = useRouter();
  useEffect(() => { if (ready && !me.introSeen) router.push('/nedir'); }, [ready, me.introSeen]); // eslint-disable-line react-hooks/exhaustive-deps
  const acts = feed();
  const fol = following();
  const shows = snap.shows.slice(0, 3);
  return (
    <Screen tabbed>
      <View style={{ gap: 14 }}>
        <Masthead />
        <Divider strong />
        <View style={{ flexDirection: 'row', alignItems: 'baseline', justifyContent: 'space-between' }}>
          <Display size="lg">Akış</Display>
          <Small>{fol.length ? `${fol.length} kişiyi takip ediyorsun` : 'algoritma yok'}</Small>
        </View>
      </View>

      <View style={{ gap: 10 }}>
        <Eyebrow>Bu hafta en çok eklenenler</Eyebrow>
        <ItemStrip items={trending()} />
      </View>

      {fol.length === 0 ? (
        <>
          <View style={{ gap: 10, borderTopWidth: 1, borderTopColor: c.rule, paddingTop: 14 }}>
            <Display size="xl">Kimi takip ediyorsun?</Display>
            <Body muted>Akış, takip ettiklerinin yazdıklarından oluşur: ne eklediler, neye kaç yıldız verdiler, neyi tartışıyorlar.</Body>
            <Button label="Kişileri bul" right={`${snap.users.length} kişi`} onPress={() => router.push('/(tabs)/kesfet')} />
          </View>
          <Section title="Son defileler" right={<LinkText label="Tümü →" onPress={() => router.push('/(tabs)/kesfet')} />}>
            <View style={{ flexDirection: 'row', gap: 10 }}>{shows.map((s) => <View key={s.id} style={{ flex: 1 }}><ShowCard s={s} wide /></View>)}</View>
          </Section>
          <Section title="Son yorumlar" right={<Small>herkesten</Small>}>
            <View style={{ gap: 14 }}>
              {snap.reviews.slice(0, 6).map((r, i) => <View key={r.id} style={{ gap: 14 }}>{i ? <Divider /> : null}<ReviewCard r={r} showTarget compact /></View>)}
            </View>
          </Section>
        </>
      ) : (
        <>
          <View style={{ gap: 12, borderTopWidth: 1, borderTopColor: c.rule, paddingTop: 12 }}>
            {acts.length ? acts.map((a, i) => <View key={a.id} style={{ gap: 12 }}>{i ? <Divider /> : null}<ActivityRow a={a} /></View>) : <Small>Henüz hareket yok.</Small>}
          </View>
          <LinkText label="Daha fazla kişi bul →" onPress={() => router.push('/(tabs)/kesfet')} />
        </>
      )}
    </Screen>
  );
}
