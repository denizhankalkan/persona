import React, { useState } from 'react';
import { Pressable, View } from 'react-native';
import { Body, Chip, Eyebrow, Field, Small } from './ui';
import { useStore } from '@/store';
import { useTheme } from '@/theme';
import { useT } from '@/i18n';
import type { ShelfEntry } from '@/data/types';

/** "Nereden aldın?" — the thing people usually keep to themselves. Shown right after "Vitrine ekle". */
export function PurchaseForm({ entry }: { entry: ShelfEntry }) {
  const { c } = useTheme();
  const { patchShelf } = useStore();
  const { t } = useT();
  const [editing, setEditing] = useState(!entry.store);
  const [store, setStore] = useState(entry.store ?? '');
  const [price, setPrice] = useState(entry.priceText ?? '');
  const [url, setUrl] = useState(entry.url ?? '');
  const save = async () => {
    await patchShelf(entry.itemId, { store: store.trim() || undefined, priceText: price.trim() || undefined, url: url.trim() || undefined });
    setEditing(false);
  };
  return (
    <View style={{ gap: 10, backgroundColor: c.surface, borderWidth: 1, borderColor: c.line, padding: 14 }}>
      <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', gap: 8 }}>
        <Eyebrow color={c.accent}>{t('Nereden aldın?')}</Eyebrow>
        <Chip label={entry.hidden ? t('Gizli ●') : t('Görünür')} on={!!entry.hidden} tone="ink" onPress={() => patchShelf(entry.itemId, { hidden: !entry.hidden })} />
      </View>
      {editing ? (
        <>
          <Field value={store} onChangeText={setStore} placeholder={t('Mağaza, şube ya da site — Zara İstinye Park, ikinci el, Trendyol…')} />
          <View style={{ flexDirection: 'row', gap: 8 }}>
            <Field style={{ flex: 1 }} value={price} onChangeText={setPrice} placeholder={t('Fiyat (isteğe bağlı)')} />
            <Field style={{ flex: 1 }} value={url} onChangeText={setUrl} placeholder={t('Ürün linki (isteğe bağlı)')} autoCapitalize="none" keyboardType="url" />
          </View>
          <View style={{ flexDirection: 'row', gap: 8, alignItems: 'center' }}>
            <Chip label={t('Kaydet')} on onPress={save} />
            {entry.store ? <Chip label={t('Vazgeç')} onPress={() => setEditing(false)} /> : <Small>{t('Boş bırakabilirsin; sonra da yazarsın.')}</Small>}
          </View>
        </>
      ) : (
        <Pressable onPress={() => setEditing(true)} style={{ gap: 2 }}>
          <Body weight="semi">{entry.store}{entry.priceText ? ` · ${entry.priceText}` : ''}</Body>
          <Small>{entry.hidden ? t('Bu parça gizli; yalnızca sen görüyorsun.') : t('Takip ettiklerin görüyor. Değiştirmek için dokun.')}</Small>
        </Pressable>
      )}
    </View>
  );
}
