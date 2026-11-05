import React from 'react';
import { ScrollView, View } from 'react-native';
import { Stack, useLocalSearchParams, useRouter } from 'expo-router';
import { Screen } from '@/components/Screen';
import { Band, Body, Chip, Display, Eyebrow, Section, Small } from '@/components/ui';
import { ItemGrid, ListCard, ShowCard } from '@/components/cards';
import { RatingLine, Reviews } from '@/components/Reviews';
import type { Item } from '@/data/types';
import { useStore } from '@/store';
import { useTheme } from '@/theme';

/** The genre page: boho, western, quiet luxury. Rated like a genre, argued like one. */
export default function StyleScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { c } = useTheme();
  const { style, item, brand, snap, allLists, allItems } = useStore();
  const router = useRouter();
  const s = style(String(id));
  if (!s) return <Screen><Small>Stil bulunamadı.</Small></Screen>;
  const subject = { kind: 'style' as const, id: s.id };
  const items = [...s.itemIds.map(item), ...allItems().filter((i) => i.styleIds?.includes(s.id) && !s.itemIds.includes(i.id))].filter(Boolean) as Item[];
  const brands = s.brandIds.map(brand).filter(Boolean);
  const shows = snap.shows.filter((x) => x.styleIds?.includes(s.id));
  const lists = allLists().filter((l) => l.itemIds.some((iid) => items.some((i) => i.id === iid))).slice(0, 4);
  return (
    <>
      <Stack.Screen options={{ title: 'Stil' }} />
      <Screen>
        <Band>
          <Eyebrow style={{ color: c.inkMuted }}>Stil{s.aka ? ` · ${s.aka}` : ''}{s.era ? ` · ${s.era}` : ''}</Eyebrow>
          <Display size="xxl" style={{ color: c.inkFg }}>{s.name}</Display>
          <Body style={{ color: c.inkFg, opacity: 0.85 }}>{s.summary}</Body>
        </Band>
        <RatingLine subject={subject} />

        <Section title="İmza parçalar" kicker>
          <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 6 }}>{s.keyPieces.map((k) => <Chip key={k} label={k} />)}</View>
        </Section>

        {items.length ? (
          <Section title="Katalogda bu stil" right={<Small>{items.length} parça</Small>}>
            <ItemGrid items={items.slice(0, 6)} cols={3} />
          </Section>
        ) : null}

        {brands.length ? (
          <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 6, alignItems: 'center' }}>
            <Eyebrow>Markalar</Eyebrow>
            {brands.map((b) => <Chip key={b!.id} label={b!.name} tone="green" onPress={() => router.push(`/marka/${b!.id}`)} />)}
          </View>
        ) : null}

        {shows.length ? (
          <Section title="Podyumda" kicker>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ gap: 12 }}>
              {shows.map((x) => <ShowCard key={x.id} s={x} />)}
            </ScrollView>
          </Section>
        ) : null}

        <Reviews subject={subject} title="Trend mi, kalıcı mı?" hint="tartışma; yıldız parçalara" />

        {lists.length ? (
          <Section title="Listelerde" kicker>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ gap: 14 }}>
              {lists.map((l) => <ListCard key={l.id} l={l} />)}
            </ScrollView>
          </Section>
        ) : null}
      </Screen>
    </>
  );
}
