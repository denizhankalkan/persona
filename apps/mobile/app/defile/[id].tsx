import React, { useState } from 'react';
import { Linking, Platform, Pressable, ScrollView, Text, View } from 'react-native';
import { Stack, useLocalSearchParams, useRouter } from 'expo-router';
import * as ImagePicker from 'expo-image-picker';
import { Image } from 'expo-image';
import { Screen } from '@/components/Screen';
import { Body, Chip, Display, Eyebrow, Field, LinkText, Section, Small } from '@/components/ui';
import { Photo } from '@/components/ProductImage';
import { ShowCard } from '@/components/cards';
import { RatingLine, Reviews } from '@/components/Reviews';
import { useStore } from '@/store';
import { useTheme } from '@/theme';
import { useT } from '@/i18n';

const pad = (n: number) => String(n).padStart(2, '0');

/**
 * The film page for a collection: brand × season, one identity. Looks are numbered like
 * Vogue Runway (01, 02…); the first image is read from the official show page, the rest
 * are frames the user adds. No drawings, nothing scraped.
 */
export default function ShowScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { c, f } = useTheme();
  const { show, snap, me, setLink, style, looksOf, setLook } = useStore();
  const { t, tx } = useT();
  const router = useRouter();
  const s = show(String(id));
  const [linkDraft, setLinkDraft] = useState('');
  const [addingLink, setAddingLink] = useState(false);
  if (!s) return <Screen><Small>{t('Defile bulunamadı.')}</Small></Screen>;
  const subject = { kind: 'show' as const, id: s.id };
  const link = me.links?.[s.id] ?? s.url;
  const looks = looksOf(s.id);
  const others = snap.shows.filter((x) => x.id !== s.id && (x.brandId === s.brandId || x.season === s.season)).slice(0, 4);
  const styles = (s.styleIds ?? []).map(style).filter(Boolean);
  const pickLook = async (index: number) => {
    const perm = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!perm.granted && Platform.OS !== 'web') return;
    const res = await ImagePicker.launchImageLibraryAsync({ mediaTypes: ['images'], quality: 0.7, base64: true, allowsEditing: true, aspect: [2, 3] });
    if (res.canceled || !res.assets?.[0]) return;
    const a = res.assets[0];
    await setLook(s.id, index, a.base64 ? `data:${a.mimeType ?? 'image/jpeg'};base64,${a.base64}` : a.uri);
  };
  const saveLink = async () => { const u = linkDraft.trim(); if (!/^https?:\/\//.test(u)) return; await setLink(s.id, u); setLinkDraft(''); setAddingLink(false); };
  const total = Math.max(s.lookCount ?? 6, looks.length + 1);
  const cells = Array.from({ length: Math.min(total, 12) }, (_, i) => i);
  return (
    <>
      <Stack.Screen options={{ title: t('Defile') }} />
      <Screen>
        <Photo id={s.id} url={link} imageUrl={s.imageUrl} label={s.brandName} sub={tx(s.season)} ratio={1.35} size={34} />
        <View style={{ gap: 6 }}>
          {s.brandId ? <LinkText label={`${s.brandName} →`} onPress={() => router.push(`/marka/${s.brandId}`)} /> : <Eyebrow>{s.brandName}</Eyebrow>}
          <Display size="xl">{tx(s.season)}</Display>
          <Small>{[tx(s.city), tx(s.when), s.designer].filter(Boolean).join(' · ')}</Small>
          {s.tagline ? <Body style={{ fontFamily: f.displayItalic, fontSize: 18, lineHeight: 25 }}>{s.tagline}</Body> : null}
          {s.note ? <Body muted>{s.note}</Body> : null}
          <RatingLine subject={subject} />
        </View>

        <View style={{ flexDirection: 'row', gap: 8, flexWrap: 'wrap' }}>
          <Chip label={t(link ? 'Resmi defile sayfası →' : 'Resmi link ekle')} tone="green" onPress={() => (link && !addingLink ? Linking.openURL(link) : setAddingLink((v) => !v))} />
          {link ? <Chip label={t('Linki değiştir')} onPress={() => setAddingLink((v) => !v)} /> : null}
        </View>
        {addingLink ? (
          <View style={{ flexDirection: 'row', gap: 8 }}>
            <Field style={{ flex: 1 }} value={linkDraft} onChangeText={setLinkDraft} placeholder={t('Markanın defile sayfası ya da Vogue Runway linki')} autoCapitalize="none" keyboardType="url" />
            <Chip label={t('Kaydet')} on onPress={saveLink} />
          </View>
        ) : null}

        <Section title={t('Görünümler')} ornament right={<Small>{t('Resmi sayfadan ya da senin eklediğin kareden.')}</Small>}>
          <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 8 }}>
            {cells.map((i) => {
              const uri = looks[i];
              return (
                <Pressable key={i} onPress={() => pickLook(i)} onLongPress={uri ? () => setLook(s.id, i, null) : undefined} style={{ width: '31%', aspectRatio: 0.67, backgroundColor: c.surface2, overflow: 'hidden' }}>
                  {uri ? <Image source={{ uri }} style={{ width: '100%', height: '100%' }} contentFit="cover" accessibilityLabel={t('Görünüm {n}', { n: pad(i + 1) })} /> : (
                    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', gap: 4 }}>
                      <Eyebrow style={{ fontSize: 9 }}>{t('kare ekle')}</Eyebrow>
                    </View>
                  )}
                  <Text style={{ position: 'absolute', left: 8, bottom: 6, fontFamily: f.display, fontSize: 22, color: uri ? '#F3EEE3' : c.muted, textShadowColor: uri ? 'rgba(0,0,0,.5)' : 'transparent', textShadowRadius: 4 }}>{pad(i + 1)}</Text>
                </Pressable>
              );
            })}
          </View>
          {!looks.length && !link ? <Small>{t('Görsel markanın resmi defile sayfasından gelir; linki yapıştır. Çizim yok.')}</Small> : null}
        </Section>

        {styles.length ? (
          <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 6, alignItems: 'center' }}>
            <Eyebrow>{t('Stiller')}</Eyebrow>
            {styles.map((x) => <Chip key={x!.id} label={x!.name} tone="green" onPress={() => router.push(`/stil/${x!.id}`)} />)}
          </View>
        ) : null}

        <Reviews subject={subject} title="Koleksiyon ne diyor?" hint="izleyenler" />

        {others.length ? (
          <Section title={t('Aynı sezon, aynı ev')} kicker>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ gap: 12 }}>
              {others.map((x) => <ShowCard key={x.id} s={x} />)}
            </ScrollView>
          </Section>
        ) : null}
        <Small>{t('Defile puanı koleksiyona, tasarımcıya değil: giyer miydin, ne söyledi, öncekine göre ne değişti?')}</Small>
      </Screen>
    </>
  );
}
