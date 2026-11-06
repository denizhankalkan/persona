import React, { useState } from 'react';
import { Pressable, View } from 'react-native';
import { useRouter } from 'expo-router';
import { Screen } from '@/components/Screen';
import { Body, Chip, Display, Eyebrow, Field, Section, Small, Tag } from '@/components/ui';
import { ItemGrid, fmt } from '@/components/cards';
import { ProductImage } from '@/components/ProductImage';
import { useStore } from '@/store';
import { useTheme } from '@/theme';
import { useT } from '@/i18n';
import type { Item } from '@/data/types';

/**
 * Worn on screen: character wardrobes from TV and film, one row per series. Each wardrobe
 * is an editor list; each piece is a model you can showcase, save and rate.
 */
export default function OnScreenScreen() {
  const { c, f } = useTheme();
  const { snap, item, list, savesOf, me, addSuggestion, isFollowingPersona } = useStore();
  const { t, tx } = useT();
  const router = useRouter();
  const [ask, setAsk] = useState('');
  const [sent, setSent] = useState<string | null>(null);
  const characters = snap.personas.filter((p) => p.kind === 'character');
  const send = async () => { const s = ask.trim(); if (!s) return; await addSuggestion(s); setSent(s); setAsk(''); };
  return (
    <Screen tabbed masthead>
      <View style={{ gap: 6, borderBottomWidth: 1, borderBottomColor: c.rule, paddingBottom: 12 }}>
        <Display size="lg">{t('Ekranda')}</Display>
        <Body muted>{t('Dizilerde ve filmlerde giyilenler')}. {t('Karakterin dolabına gir, parçayı bul, nereden alınır gör.')}</Body>
      </View>

      {characters.map((p) => {
        const l = list(`dolap-${p.id}`);
        const items = (l?.itemIds ?? p.itemIds).map(item).filter(Boolean) as Item[];
        const scenes = snap.scenes.filter((s) => s.personaId === p.id);
        const captions: Record<string, string> = {};
        scenes.forEach((s) => s.itemIds.forEach((iid) => { if (!captions[iid]) captions[iid] = s.episode; }));
        const on = isFollowingPersona(p.id);
        return (
          <View key={p.id} style={{ gap: 12 }}>
            <Pressable onPress={() => router.push(`/liste/dolap-${p.id}`)} style={{ backgroundColor: '#0B0B0B', padding: 18, borderTopWidth: 3, borderTopColor: c.accent, gap: 6 }}>
              <Eyebrow style={{ color: '#A3A3A3' }}>{tx(p.source)}</Eyebrow>
              <Display size="xl" style={{ color: '#F3EEE3' }}>{p.name}</Display>
              <Body style={{ color: '#F3EEE3', opacity: 0.85 }} numberOfLines={2}>{p.bio}</Body>
              <View style={{ flexDirection: 'row', gap: 8, alignItems: 'center', flexWrap: 'wrap', marginTop: 4 }}>
                <Tag label={t('Karakter dolabı')} tone="green" />
                <Small style={{ color: '#A3A3A3' }}>{t('{n} model', { n: items.length })} · {t('{n} kayıt', { n: fmt(savesOf(`dolap-${p.id}`)) })}{on ? ` · ${t('Bürünüyorsun ✓')}` : ''}</Small>
              </View>
            </Pressable>
            <ItemGrid items={items.slice(0, 6)} captions={captions} cols={3} />
            <Pressable onPress={() => router.push(`/liste/dolap-${p.id}`)}><Small weight="bold" muted={false} style={{ color: c.accent, fontSize: 11, letterSpacing: 1.4, textTransform: 'uppercase' }}>{t('Dolabı →')} · {t('{n} parça', { n: items.length })}</Small></Pressable>
          </View>
        );
      })}

      <Section title={t('Yakında')} kicker>
        <View style={{ flexDirection: 'row', gap: 8 }}>
          {([['Dizi · {y}', '2024'], ['Film · {y}', '2023'], ['Dizi · {y}', '2011']] as [string, string][]).map(([lbl, y], i) => (
            <View key={i} style={{ flex: 1, aspectRatio: 0.8, backgroundColor: c.surface2, alignItems: 'center', justifyContent: 'center', padding: 8, gap: 4 }}>
              <Small style={{ fontFamily: f.display, fontSize: 18, color: c.muted, textAlign: 'center' }}>?</Small>
              <Eyebrow>{t(lbl, { y })}</Eyebrow>
            </View>
          ))}
        </View>
        <View style={{ gap: 8 }}>
          <Eyebrow color={c.accent}>{t('Hangi dizi, hangi karakter?')}</Eyebrow>
          <View style={{ flexDirection: 'row', gap: 8 }}>
            <Field style={{ flex: 1 }} value={ask} onChangeText={setAsk} placeholder="Kızılcık Şerbeti · Nursema" />
            <Chip label={t('Öner')} on onPress={send} />
          </View>
          {sent ? <Small style={{ color: c.accent }}>{t('Önerin alındı: {s}', { s: sent })}</Small> : null}
          {(me.suggestions ?? []).length > 1 ? <Small>{(me.suggestions ?? []).slice(0, -1).join(' · ')}</Small> : null}
        </View>
      </Section>
    </Screen>
  );
}
