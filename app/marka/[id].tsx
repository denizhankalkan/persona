import React from 'react';
import { Linking, View } from 'react-native';
import { Stack, useLocalSearchParams, useRouter } from 'expo-router';
import { Screen } from '@/components/Screen';
import { Band, Bar, Body, Chip, Display, Eyebrow, LinkText, Section, Small } from '@/components/ui';
import { ItemGrid, ShowCard, fmt } from '@/components/cards';
import { RatingLine, Reviews } from '@/components/Reviews';
import { BRAND_STATUS_LABEL } from '@/data/repo';
import type { BrandStatus, Item } from '@/data/types';
import { useStore } from '@/store';
import { useTheme } from '@/theme';

/** Goodreads' author page: the brand. Loyal / sometimes / left is the one extra signal. */
export default function BrandScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { c } = useTheme();
  const { brand, snap, allItems, reviewsFor, myReviewFor, addReview, style, me, rating } = useStore();
  const router = useRouter();
  const b = brand(String(id));
  if (!b) return <Screen><Small>Marka bulunamadı.</Small></Screen>;
  const subject = { kind: 'brand' as const, id: b.id };
  const items = allItems().filter((i) => i.brandId === b.id || i.brandName === b.name).sort((a, z) => z.ownedCount - a.ownedCount) as Item[];
  const shows = snap.shows.filter((s) => s.brandId === b.id);
  const mine = myReviewFor(subject);
  const reviews = reviewsFor(subject);
  const leftN = reviews.filter((r) => r.brandStatus === 'left').length;
  const leftPct = Math.round((b.leftPct * b.reviewCount + leftN * 100) / (b.reviewCount + reviews.length));
  const styles = (b.styleIds ?? []).map(style).filter(Boolean);
  const url = me.links?.[b.id] ?? b.url;
  const setStatus = async (s: BrandStatus) => {
    if (mine) await addReview({ targetType: 'brand', targetId: b.id, rating: mine.rating, body: mine.body, brandStatus: mine.brandStatus === s ? undefined : s });
  };
  return (
    <>
      <Stack.Screen options={{ title: 'Marka' }} />
      <Screen>
        <Band>
          <Eyebrow style={{ color: c.inkMuted }}>{b.origin} · {fmt(b.reviewCount + reviews.length)} görüş</Eyebrow>
          <Display size="xxl" style={{ color: c.inkFg }}>{b.name}</Display>
          <View style={{ flexDirection: 'row', gap: 18, marginTop: 4 }}>
            <View><Display size="lg" style={{ color: leftPct >= 30 ? '#E07A6A' : c.inkFg }}>%{leftPct}</Display><Small style={{ color: c.inkMuted }}>koptu</Small></View>
            <View><Display size="lg" style={{ color: c.inkFg }}>{rating(subject).avg.toFixed(1)}</Display><Small style={{ color: c.inkMuted }}>ortalama</Small></View>
            <View><Display size="lg" style={{ color: c.inkFg }}>{items.length}</Display><Small style={{ color: c.inkMuted }}>parça</Small></View>
          </View>
        </Band>

        <View style={{ flexDirection: 'row', gap: 6 }}>
          {(Object.keys(BRAND_STATUS_LABEL) as BrandStatus[]).map((s) => <View key={s} style={{ flex: 1 }}><Chip label={BRAND_STATUS_LABEL[s] + (mine?.brandStatus === s ? ' ✓' : '')} on={mine?.brandStatus === s} onPress={mine ? () => setStatus(s) : undefined} /></View>)}
        </View>
        {!mine ? <Small>Sadığım / ara sıra / koptum: yorumunu yazarken seç.</Small> : null}

        <Section title="Parçalarından hesaplanan puan" kicker>
          <RatingLine subject={subject} />
          {([['Kalıp', b.scores.fit], ['Fiyat', b.scores.price], ['Kalite', b.scores.quality], ['Kumaş', b.scores.fabric]] as [string, number][]).map(([k, v]) => (
            <View key={k} style={{ flexDirection: 'row', alignItems: 'center', gap: 10 }}>
              <Small muted={false} weight="semi" style={{ width: 52 }}>{k}</Small>
              <Bar value={(v / 5) * 100} low={v < 2.5} />
              <Small muted={false} weight="bold" style={{ width: 28, textAlign: 'right' }}>{v.toFixed(1)}</Small>
            </View>
          ))}
        </Section>

        {items.length ? (
          <Section title="En çok eklenen parçaları" right={<Small>{items.length}</Small>}>
            <ItemGrid items={items.slice(0, 6)} cols={3} />
          </Section>
        ) : null}

        {shows.length ? (
          <Section title="Defileleri" right={<Small>sezon sezon</Small>}>
            <View style={{ flexDirection: 'row', gap: 10 }}>{shows.slice(0, 3).map((s) => <View key={s.id} style={{ flex: 1 }}><ShowCard s={s} wide /></View>)}</View>
          </Section>
        ) : null}

        {styles.length ? (
          <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 6, alignItems: 'center' }}>
            <Eyebrow>Stilleri</Eyebrow>
            {styles.map((s) => <Chip key={s!.id} label={s!.name} tone="green" onPress={() => router.push(`/stil/${s!.id}`)} />)}
          </View>
        ) : null}
        {url ? <LinkText label={`${b.name} resmi sitesi →`} onPress={() => Linking.openURL(url)} /> : null}

        <Reviews subject={subject} title="Tartışma" hint="markayı konuşanlar" />
        <Body muted style={{ fontSize: 13 }}>Markaya yıldız verilmez; puanı parçalarının puanından hesaplanır. Burada kalıp, kumaş, fiyat ve tutum konuşulur.</Body>
      </Screen>
    </>
  );
}
