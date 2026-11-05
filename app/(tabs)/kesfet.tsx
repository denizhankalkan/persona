import React, { useState } from 'react';
import { Pressable, ScrollView, View } from 'react-native';
import { useRouter } from 'expo-router';
import { Screen } from '@/components/Screen';
import { Display, Divider, Field, LinkText, Section, Small, Tag } from '@/components/ui';
import { BrandRow, ItemGrid, ItemRow, ListCard, PersonRow, ShowCard, StyleCard } from '@/components/cards';
import { useStore } from '@/store';
import type { Style } from '@/data/types';

/** One search over everything; underneath, the catalog in sections: lists, shows, styles, brands, pieces, people. */
export default function DiscoverScreen() {
  const { snap, followStatus, toggleFollow, allLists, allItems } = useStore();
  const router = useRouter();
  const [q, setQ] = useState('');
  const query = q.trim().toLowerCase();
  const has = (s: string) => s.toLowerCase().includes(query);
  const label = (id: string, vis: string) => { const s = followStatus(id); return s === 'accepted' ? 'Arkadaşsınız ✓' : s === 'pending' ? 'İstek gönderildi' : vis === 'public' ? 'Takip et' : 'Arkadaş ol'; };
  const tone = (id: string) => (followStatus(id) === 'accepted' ? 'green' : followStatus(id) === 'pending' ? 'gold' : 'ink') as 'green' | 'gold' | 'ink';

  const lists = allLists().filter((l) => !query || has(l.title + ' ' + (l.description ?? '')));
  const shows = snap.shows.filter((s) => !query || has(s.brandName + ' ' + s.season + ' ' + (s.designer ?? '')));
  const styles = snap.styles.filter((s) => !query || has(s.name + ' ' + (s.aka ?? '') + ' ' + s.keyPieces.join(' ')));
  const brands = snap.brands.filter((b) => !query || has(b.name));
  const items = query ? allItems().filter((i) => has(i.name + ' ' + (i.brandName ?? '') + ' ' + i.category)).slice(0, 8) : [];
  const users = snap.users.filter((u) => !query || has(u.name + ' ' + u.handle));
  const popular = [...snap.items].sort((a, b) => b.ownedCount - a.ownedCount).slice(0, 6);
  const rows: Style[][] = [];
  for (let i = 0; i < styles.length; i += 2) rows.push(styles.slice(i, i + 2));

  return (
    <Screen tabbed masthead>
      <View style={{ gap: 14 }}>
        <Display size="lg">Keşfet</Display>
        <Field value={q} onChangeText={setQ} placeholder="Parça, marka, defile, stil, liste, kişi" autoCapitalize="none" />
      </View>

      {items.length ? <Section title="Parçalar"><View>{items.map((i) => <ItemRow key={i.id} item={i} />)}</View></Section> : null}

      {lists.length ? (
        <Section title="Listeler" right={<Small>karakter dolapları, personalar, editör</Small>}>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ gap: 14 }}>
            {lists.map((l) => <ListCard key={l.id} l={l} />)}
          </ScrollView>
        </Section>
      ) : null}

      {shows.length ? (
        <Section title="Defileler" right={<Small>sezon sezon</Small>}>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ gap: 12 }}>
            {shows.map((s) => <ShowCard key={s.id} s={s} />)}
          </ScrollView>
        </Section>
      ) : null}

      {styles.length ? (
        <Section title="Stiller" right={<Small>trend mi, kalıcı mı?</Small>}>
          <View style={{ gap: 8 }}>
            {rows.map((r, i) => (
              <View key={i} style={{ flexDirection: 'row', gap: 8 }}>
                {r.map((s) => <StyleCard key={s.id} s={s} />)}
                {r.length === 1 ? <View style={{ flex: 1 }} /> : null}
              </View>
            ))}
          </View>
        </Section>
      ) : null}

      {brands.length ? (
        <Section title="Markalar" right={<Small>sadığım · ara sıra · koptum</Small>}>
          <View>{brands.map((b) => <BrandRow key={b.id} b={b} />)}</View>
        </Section>
      ) : null}

      {!query ? (
        <Section title="Bu hafta popüler parçalar">
          <ItemGrid items={popular} cols={3} />
        </Section>
      ) : null}

      <Section title="Arkadaşlar ve kişiler" right={<Small>aldıklarını, izin verdikleri kadar</Small>}>
        <View>
          {users.map((u) => (
            <PersonRow key={u.id} u={u} right={<Pressable onPress={() => toggleFollow(u.id)}><Tag label={label(u.id, u.visibility)} tone={tone(u.id)} /></Pressable>} />
          ))}
        </View>
        {!users.length ? <Small>Bulunamadı. Gerçek sürümde davet linki gönderebileceksin.</Small> : null}
      </Section>

      {query && !items.length && !lists.length && !shows.length && !styles.length && !brands.length && !users.length ? (
        <View style={{ gap: 8 }}>
          <Small>“{q}” katalogda yok.</Small>
          <LinkText label="Ekle →" onPress={() => router.push('/ekle')} />
        </View>
      ) : null}
    </Screen>
  );
}
