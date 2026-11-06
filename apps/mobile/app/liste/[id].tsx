import React from 'react';
import { Pressable, Share, View } from 'react-native';
import { Stack, useLocalSearchParams, useRouter } from 'expo-router';
import { Screen } from '@/components/Screen';
import { Band, Body, Chip, Display, Eyebrow, LinkText, Section, Small, Tag } from '@/components/ui';
import { ItemGrid, ItemRow, fmt } from '@/components/cards';
import { Reviews } from '@/components/Reviews';
import type { Item } from '@/data/types';
import { useStore } from '@/store';
import { useTheme } from '@/theme';
import { useT } from '@/i18n';

/**
 * Letterboxd's list page. Character wardrobes and public personas are editor lists: a
 * showcase of models. Each model is rated; the wardrobe itself is saved and discussed.
 */
export default function ListScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { c } = useTheme();
  const { list, item, persona, userName, meId, ownedFrom, isFollowingPersona, togglePersonaFollow, snap, toggleListItem, savedList, savesOf, toggleSaveList } = useStore();
  const { t, tx } = useT();
  const router = useRouter();
  const l = list(String(id));
  if (!l) return <Screen><Small>{t('Liste bulunamadı.')}</Small></Screen>;
  const subject = { kind: 'list' as const, id: l.id };
  const p = l.personaId ? persona(l.personaId) : undefined;
  const items = l.itemIds.map(item).filter(Boolean) as Item[];
  const clothing = items.filter((i) => i.type === 'clothing');
  const other = items.filter((i) => i.type !== 'clothing');
  const captions: Record<string, string> = { ...(l.notes ?? {}) };
  if (p) snap.scenes.filter((s) => s.personaId === p.id).forEach((s) => s.itemIds.forEach((iid) => { if (!captions[iid]) captions[iid] = s.episode; }));
  const inShowcase = p ? ownedFrom(meId, p) : 0;
  const on = p ? isFollowingPersona(p.id) : false;
  const mine = l.authorId === meId;
  const stores = p?.purchases ? Object.entries(Object.values(p.purchases).reduce<Record<string, number>>((m, pu) => { const k = pu.store.split(',')[0].trim(); m[k] = (m[k] ?? 0) + 1; return m; }, {})).sort((a, b) => b[1] - a[1]) : [];
  const share = () => Share.share({ message: t('Persona’da “{t}”: {n} parça.', { t: l.title, n: l.itemIds.length }) }).catch(() => {});
  return (
    <>
      <Stack.Screen options={{ title: t(p ? 'Dolap' : 'Liste') }} />
      <Screen>
        <Band>
          <Eyebrow style={{ color: c.inkMuted }}>{p ? `${t(p.kind === 'character' ? 'Karakter dolabı' : 'Herkese açık persona')} · ${tx(p.source)}` : `${t('Liste')} · ${l.authorId === 'editor' ? 'Persona' : userName(l.authorId)}`}</Eyebrow>
          <Display size="xl" style={{ color: c.inkFg }}>{p ? t(p.kind === 'person' ? '{p} ne alıyor?' : '{p} ne giyerdi?', { p: p.shortName }) : l.title}</Display>
          <Body style={{ color: c.inkFg, opacity: 0.85 }}>{p?.bio ?? l.description}</Body>
          <View style={{ flexDirection: 'row', gap: 8, flexWrap: 'wrap', alignItems: 'center' }}>
            {p?.isExample ? <Tag label={t('örnek profil')} tone="dashed" /> : null}
            <Small style={{ color: c.inkMuted }}>{t('{n} model', { n: l.itemIds.length })} · {t('{n} kayıt', { n: fmt(savesOf(l.id)) })}</Small>
          </View>
        </Band>

        <View style={{ flexDirection: 'row', gap: 8, flexWrap: 'wrap', alignItems: 'center' }}>
          {p ? <Chip label={t(on ? 'Bürünüyorsun ✓' : 'Kimliğine bürün')} on={on} tone="green" onPress={() => togglePersonaFollow(p.id)} /> : null}
          {!mine ? <Chip label={t(savedList(l.id) ? 'Kaydettin ♥' : 'Kaydet')} on={savedList(l.id)} tone={p ? 'ink' : 'green'} onPress={() => toggleSaveList(l.id)} /> : null}
          <Chip label={t('Paylaş')} onPress={share} />
          {inShowcase ? <Small>{t('bu dolaptan vitrininde {n} parça', { n: inShowcase })}</Small> : null}
        </View>

        {stores.length ? (
          <Section title={t('Nereden alışveriş yapıyor?')} kicker right={<Small>{t('paylaştığı kadar')}</Small>}>
            <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 6 }}>{stores.map(([s, n]) => <Tag key={s} label={`${s} · ${n}`} tone="green" />)}</View>
          </Section>
        ) : null}

        <Section title={t(p ? (p.kind === 'person' ? 'Vitrini' : 'Giydikleri') : 'Parçalar')} ornament right={<Small>{t('{n} model', { n: items.length })} · {t('her biri puanlanır')}</Small>}>
          {clothing.length ? <ItemGrid items={clothing} captions={captions} /> : null}
          {other.length ? <View>{other.map((i) => <ItemRow key={i.id} item={i} note={captions[i.id]} />)}</View> : null}
          {!items.length ? <Small>{t('Liste boş.')}</Small> : null}
          {mine ? <Small>{t('Parça eklemek için parçanın sayfasında “Listeye” de; çıkarmak için aşağıda.')}</Small> : null}
          {mine && items.length ? <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 6 }}>{items.map((i) => <Chip key={i.id} label={`${i.name} ×`} onPress={() => toggleListItem(l.id, i.id)} />)}</View> : null}
        </Section>
        {p?.kind === 'character' ? <Small>{t('Fotoğraflar: bir parçaya girip resmi ürün linkini ya da dizi karesini ekleyebilirsin.')}</Small> : null}

        <Reviews subject={subject} title={p ? 'Dolap hakkında' : 'Liste hakkında'} hint="tartışma; yıldız parçalara" />
        {!p && l.authorId !== 'editor' && !mine ? <Pressable onPress={() => router.push(`/user/${l.authorId}`)}><LinkText label={t('{u}’in dolabı →', { u: userName(l.authorId) })} /></Pressable> : null}
      </Screen>
    </>
  );
}
