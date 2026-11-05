import React, { useEffect, useState } from 'react';
import { Platform, Text, View } from 'react-native';
import { Image } from 'expo-image';
import { useStore } from '@/store';
import { useTheme } from '@/theme';
import { unfurlImage } from '@/unfurl';
import type { Item } from '@/data/types';

/**
 * Real photo of anything with an official page, in this order: a photo the user
 * attached, a known image URL, the share image of the official link. No drawings;
 * when nothing is available, a plain block with the name set in Bodoni.
 */
export function Photo({ id, url, imageUrl, label, sub, ratio = 0.8, style, size = 18 }: { id: string; url?: string; imageUrl?: string; label: string; sub?: string; ratio?: number; style?: any; size?: number }) {
  const { c, f } = useTheme();
  const { me } = useStore();
  const own = me.photos?.[id];
  const link = me.links?.[id] ?? url;
  const canUnfurl = Platform.OS !== 'web' || Boolean(process.env.EXPO_PUBLIC_UNFURL_URL);
  const [src, setSrc] = useState<string | null>(own ?? imageUrl ?? null);
  const [failed, setFailed] = useState(false);
  const [loading, setLoading] = useState(false);
  useEffect(() => {
    let alive = true;
    setFailed(false);
    if (own) { setSrc(own); return; }
    if (imageUrl) { setSrc(imageUrl); return; }
    setSrc(null);
    if (link && canUnfurl) { setLoading(true); unfurlImage(link).then((u) => { if (alive) { setSrc(u); setLoading(false); } }); }
    return () => { alive = false; };
  }, [own, imageUrl, link, canUnfurl]);
  return (
    <View style={[{ width: '100%', aspectRatio: ratio, overflow: 'hidden', backgroundColor: c.surface2, alignItems: 'center', justifyContent: 'center' }, style]}>
      {src && !failed ? (
        <Image source={{ uri: src }} style={{ width: '100%', height: '100%' }} contentFit="cover" transition={150} onError={() => setFailed(true)} accessibilityLabel={label} />
      ) : (
        <View style={{ alignItems: 'center', gap: 4, padding: size >= 11 ? 12 : 4 }}>
          {size >= 10 ? <Text style={{ fontFamily: f.display, fontSize: size, color: c.fg, textAlign: 'center', letterSpacing: 1 }}>{label}</Text> : null}
          {size >= 11 ? <Text style={{ fontFamily: f.bodyBold, fontSize: 9, letterSpacing: 1.2, textTransform: 'uppercase', color: c.muted, textAlign: 'center' }}>{sub ?? (loading ? 'yükleniyor' : failed ? 'fotoğraf yüklenemedi' : link ? 'resmi sayfadan' : 'fotoğraf yok')}</Text> : null}
        </View>
      )}
    </View>
  );
}

export function ProductImage({ item, ratio = 0.8, style, size }: { item: Item; ratio?: number; radius?: number; style?: any; size?: number }) {
  return <Photo id={item.id} url={item.url} imageUrl={item.imageUrl} label={item.brandName ?? item.category} ratio={ratio} style={style} size={size} />;
}
