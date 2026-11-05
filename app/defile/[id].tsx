import React, { useState } from 'react';
import { Linking, Platform, ScrollView, View } from 'react-native';
import { Stack, useLocalSearchParams, useRouter } from 'expo-router';
import * as ImagePicker from 'expo-image-picker';
import { Screen } from '@/components/Screen';
import { Body, Chip, Display, Eyebrow, Field, LinkText, Section, Small } from '@/components/ui';
import { Photo } from '@/components/ProductImage';
import { ShowCard } from '@/components/cards';
import { RatingLine, Reviews } from '@/components/Reviews';
import { useStore } from '@/store';
import { useTheme } from '@/theme';

/** The film page: a show has one identity (brand × season), so it can be rated like a film. */
export default function ShowScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { c } = useTheme();
  const { show, snap, me, setLink, setPhoto, style } = useStore();
  const router = useRouter();
  const s = show(String(id));
  const [linkDraft, setLinkDraft] = useState('');
  const [addingLink, setAddingLink] = useState(false);
  if (!s) return <Screen><Small>Defile bulunamadı.</Small></Screen>;
  const subject = { kind: 'show' as const, id: s.id };
  const link = me.links?.[s.id] ?? s.url;
  const others = snap.shows.filter((x) => x.id !== s.id && (x.brandId === s.brandId || x.season === s.season)).slice(0, 4);
  const styles = (s.styleIds ?? []).map(style).filter(Boolean);
  const pickPhoto = async () => {
    const perm = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!perm.granted && Platform.OS !== 'web') return;
    const res = await ImagePicker.launchImageLibraryAsync({ mediaTypes: ['images'], quality: 0.7, base64: true });
    if (res.canceled || !res.assets?.[0]) return;
    const a = res.assets[0];
    await setPhoto(s.id, a.base64 ? `data:${a.mimeType ?? 'image/jpeg'};base64,${a.base64}` : a.uri);
  };
  const saveLink = async () => { const u = linkDraft.trim(); if (!/^https?:\/\//.test(u)) return; await setLink(s.id, u); setLinkDraft(''); setAddingLink(false); };
  return (
    <>
      <Stack.Screen options={{ title: 'Defile' }} />
      <Screen>
        <Photo id={s.id} url={link} imageUrl={s.imageUrl} label={s.brandName} sub={s.season} ratio={1.35} size={34} />
        <View style={{ gap: 6 }}>
          {s.brandId ? <LinkText label={`${s.brandName} →`} onPress={() => router.push(`/marka/${s.brandId}`)} /> : <Eyebrow>{s.brandName}</Eyebrow>}
          <Display size="xl">{s.season}</Display>
          <Small>{[s.city, s.when, s.designer].filter(Boolean).join(' · ')}</Small>
          {s.tagline ? <Body style={{ fontFamily: 'BodoniModa_400Regular_Italic', fontSize: 18, lineHeight: 25 }}>{s.tagline}</Body> : null}
          {s.note ? <Body muted>{s.note}</Body> : null}
          <RatingLine subject={subject} />
        </View>

        <View style={{ flexDirection: 'row', gap: 8, flexWrap: 'wrap' }}>
          <Chip label={link ? 'Resmi defile sayfası →' : 'Resmi link ekle'} tone="green" onPress={() => (link && !addingLink ? Linking.openURL(link) : setAddingLink((v) => !v))} />
          <Chip label={me.photos?.[s.id] ? 'Fotoğrafı değiştir' : 'Kare ekle'} onPress={pickPhoto} />
          {link ? <Chip label="Linki değiştir" onPress={() => setAddingLink((v) => !v)} /> : null}
        </View>
        {addingLink ? (
          <View style={{ flexDirection: 'row', gap: 8 }}>
            <Field style={{ flex: 1 }} value={linkDraft} onChangeText={setLinkDraft} placeholder="Markanın defile sayfası ya da Vogue Runway linki" autoCapitalize="none" keyboardType="url" />
            <Chip label="Kaydet" on onPress={saveLink} />
          </View>
        ) : null}
        {!link && !me.photos?.[s.id] ? <Small>Görsel markanın resmi defile sayfasından gelir; linki yapıştır. Çizim yok.</Small> : null}

        {styles.length ? (
          <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 6, alignItems: 'center' }}>
            <Eyebrow>Stiller</Eyebrow>
            {styles.map((x) => <Chip key={x!.id} label={x!.name} tone="green" onPress={() => router.push(`/stil/${x!.id}`)} />)}
          </View>
        ) : null}

        <Reviews subject={subject} title="Koleksiyon ne diyor?" hint="izleyenler" />

        {others.length ? (
          <Section title="Aynı sezon, aynı ev" kicker>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ gap: 12 }}>
              {others.map((x) => <ShowCard key={x.id} s={x} />)}
            </ScrollView>
          </Section>
        ) : null}
        <Small style={{ color: c.muted }}>Defile puanı koleksiyona, tasarımcıya değil: giyer miydin, ne söyledi, öncekine göre ne değişti?</Small>
      </Screen>
    </>
  );
}
