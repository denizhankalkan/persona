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
import { useT } from '@/i18n';

/** The genre page: boho, western, quiet luxury. Score computed from its pieces; argued like a genre. */
export default function StyleScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { c } = useTheme();
  const { style, item, brand, snap, allLists, allItems } = useStore();
  const { t } = useT();
  const router = useRouter();
  const s = style(String(id));
  if (!s) return <Screen><Small>{t('Stil bulunamadı.')}</Small></Screen>;
  const subject = { kind: 'style' as const, id: s.id };
  const items = [...s.itemIds.map(item), ...allItems().filter((i) => i.styleIds?.includes(s.id) && !s.itemIds.includes(i.id))].filter(Boolean) as Item[];
  const brands = s.brandIds.map(brand).filter(Boolean);
  const shows = snap.shows.filter((x) => x.styleIds?.includes(s.id));
  const lists = allLists().filter((l) => l.itemIds.some((iid) => items.some((i) => i.id === iid))).slice(0, 4);
  return (
    <>
      <Stack.Screen options={{ title: t('Stil') }} />
      <Screen>
        <Band>
          <Eyebrow style={{ color: c.inkMuted }}>{t('Stil')}{s.aka ? ` · ${s.aka}` : ''}{s.era ? ` · ${s.era}` : ''}</Eyebrow>
          <Display size="xxl" style={{ color: c.inkFg }}>{s.name}</Display>
          <Body style={{ color: c.inkFg, opacity: 0.85 }}>{s.summary}</Body>
        </Band>
        <RatingLine subject={subject} />

        <Section title={t('İmza parçalar')} kicker>
          <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 6 }}>{s.keyPieces.map((k) => <Chip key={k} label={k} />)}</View>
        </Section>

        {items.length ? (
          <Section title={t('Katalogda bu stil')} right={<Small>{t('{n} parça', { n: items.length })}</Small>}>
            <ItemGrid items={items.slice(0, 6)} cols={3} />
          </Section>
        ) : null}

        {brands.length ? (
          <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 6, alignItems: 'center' }}>
            <Eyebrow>{t('Markalar')}</Eyebrow>
            {brands.map((b) => <Chip key={b!.id} label={b!.name} tone="green" onPress={() => router.push(`/marka/${b!.id}`)} />)}
          </View>
        ) : null}

        {shows.length ? (
          <Section title={t('Podyumda')} kicker>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ gap: 12 }}>
              {shows.map((x) => <ShowCard key={x.id} s={x} />)}
            </ScrollView>
          </Section>
        ) : null}

        <Reviews subject={subject} title="Trend mi, kalıcı mı?" hint="tartışma; yıldız parçalara" />

        {lists.length ? (
          <Section title={t('Listelerde')} kicker>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ gap: 14 }}>
              {lists.map((l) => <ListCard key={l.id} l={l} />)}
            </ScrollView>
          </Section>
        ) : null}
      </Screen>
    </>
  );
}
