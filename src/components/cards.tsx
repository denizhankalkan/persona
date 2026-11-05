import React from 'react';
import { Pressable, Text, View } from 'react-native';
import { useRouter } from 'expo-router';
import { Photo, ProductImage } from './ProductImage';
import { Avatar, Body, Chip, Display, Eyebrow, Small, Stars, Tag } from './ui';
import { useStore } from '@/store';
import { useTheme } from '@/theme';
import { KIND_LABEL } from '@/data/repo';
import type { Brand, Item, List, Review, Show, Style, User } from '@/data/types';

export const fmt = (n: number) => new Intl.NumberFormat('tr-TR').format(n);

export function timeAgo(t: number) {
  const h = Math.max(1, Math.round((Date.now() - t) / 3600e3));
  if (h < 24) return `${h} sa önce`;
  const d = Math.round(h / 24);
  if (d < 30) return `${d} gün önce`;
  return `${Math.round(d / 30)} ay önce`;
}

/* ---------- item tile (grid) ---------- */
export function ItemTile({ item, caption, compact }: { item: Item; caption?: string; compact?: boolean }) {
  const { c, f } = useTheme();
  const { myShelf, rating } = useStore();
  const shelf = myShelf(item.id);
  const r = rating({ kind: 'item', id: item.id });
  const router = useRouter();
  return (
    <Pressable onPress={() => router.push(`/item/${item.id}`)} style={{ flex: 1, gap: 6 }}>
      <View>
        <ProductImage item={item} ratio={0.8} size={compact ? 13 : 16} />
        {caption ? <View style={{ position: 'absolute', left: 0, top: 0, backgroundColor: 'rgba(255,255,255,.92)', paddingVertical: 3, paddingHorizontal: 6 }}><Text style={{ fontFamily: f.bodyBold, fontSize: 8, letterSpacing: 1, textTransform: 'uppercase', color: '#000' }}>{caption}</Text></View> : null}
        {shelf ? <View style={{ position: 'absolute', right: 6, top: 6, width: 22, height: 22, borderRadius: 11, backgroundColor: shelf === 'owned' ? c.accent : c.ink, alignItems: 'center', justifyContent: 'center' }}><Text style={{ color: shelf === 'owned' ? c.accentInk : c.inkFg, fontSize: 11, fontFamily: f.bodyBold }}>{shelf === 'owned' ? '✓' : '♡'}</Text></View> : null}
      </View>
      <Body weight="semi" style={{ fontSize: compact ? 12 : 13, lineHeight: compact ? 15 : 17 }} numberOfLines={2}>{item.name}</Body>
      <Small numberOfLines={1} style={{ fontSize: 11 }}>{item.brandName ?? item.category}{r.n ? ` · ${r.avg.toFixed(1)}` : item.priceText ? ' · ' + item.priceText : ''}</Small>
    </Pressable>
  );
}

export function ItemGrid({ items, captions, cols = 2 }: { items: Item[]; captions?: Record<string, string>; cols?: 2 | 3 }) {
  const rows: Item[][] = [];
  for (let i = 0; i < items.length; i += cols) rows.push(items.slice(i, i + cols));
  return (
    <View style={{ gap: 16 }}>
      {rows.map((r, i) => (
        <View key={i} style={{ flexDirection: 'row', gap: cols === 3 ? 8 : 12 }}>
          {r.map((it) => <ItemTile key={it.id} item={it} caption={captions?.[it.id]} compact={cols === 3} />)}
          {Array.from({ length: cols - r.length }).map((_, k) => <View key={'x' + k} style={{ flex: 1 }} />)}
        </View>
      ))}
    </View>
  );
}

/** horizontal strip of small tiles (Akış: "bu hafta en çok eklenenler") */
export function ItemStrip({ items }: { items: Item[] }) {
  const router = useRouter();
  return (
    <View style={{ flexDirection: 'row', gap: 8 }}>
      {items.slice(0, 4).map((it) => (
        <Pressable key={it.id} onPress={() => router.push(`/item/${it.id}`)} style={{ flex: 1, gap: 4 }}>
          <ProductImage item={it} ratio={0.8} size={12} />
          <Small numberOfLines={1} muted={false} style={{ fontSize: 11 }}>{it.name}</Small>
          <Small numberOfLines={1} style={{ fontSize: 10 }}>{it.brandName ?? it.category}</Small>
        </Pressable>
      ))}
    </View>
  );
}

/* ---------- item row (list) ---------- */
export function ItemRow({ item, sub, note }: { item: Item; sub?: string; note?: string }) {
  const { c } = useTheme();
  const { myShelf, setShelf } = useStore();
  const shelf = myShelf(item.id);
  const router = useRouter();
  return (
    <View style={{ flexDirection: 'row', alignItems: 'center', gap: 12, borderBottomWidth: 1, borderBottomColor: c.line, paddingVertical: 10 }}>
      <Pressable onPress={() => router.push(`/item/${item.id}`)} style={{ flex: 1, flexDirection: 'row', alignItems: 'center', gap: 12 }}>
        <View style={{ width: 48 }}><ProductImage item={item} ratio={0.8} size={9} /></View>
        <View style={{ flex: 1, gap: 1 }}>
          <Body weight="semi" style={{ fontSize: 14, lineHeight: 18 }} numberOfLines={2}>{item.name}</Body>
          <Small numberOfLines={1}>{sub ?? `${item.brandName ?? item.category}${item.priceText ? ' · ' + item.priceText : ''}`}</Small>
          {note ? <Small style={{ color: c.accent }} weight="semi" numberOfLines={1}>{note}</Small> : null}
        </View>
      </Pressable>
      <Chip label={shelf === 'owned' ? 'Bende ✓' : 'Bende'} on={shelf === 'owned'} tone="green" onPress={() => setShelf(item.id, shelf === 'owned' ? null : 'owned')} />
    </View>
  );
}

/* ---------- list card ---------- */
export function ListCard({ l, wide }: { l: List; wide?: boolean }) {
  const { c } = useTheme();
  const { item, userName, persona, rating } = useStore();
  const router = useRouter();
  const items = l.itemIds.map(item).filter(Boolean) as Item[];
  const p = l.personaId ? persona(l.personaId) : undefined;
  const r = rating({ kind: 'list', id: l.id });
  return (
    <Pressable onPress={() => router.push(`/liste/${l.id}`)} style={{ width: wide ? '100%' : 200, gap: 8 }}>
      <View style={{ flexDirection: 'row', gap: 2 }}>
        {items.slice(0, 4).map((it) => <View key={it.id} style={{ flex: 1 }}><ProductImage item={it} ratio={0.8} size={9} /></View>)}
        {Array.from({ length: Math.max(0, 4 - items.length) }).map((_, i) => <View key={'e' + i} style={{ flex: 1, aspectRatio: 0.8, backgroundColor: c.surface2 }} />)}
      </View>
      <View style={{ gap: 2 }}>
        <View style={{ flexDirection: 'row', gap: 6, alignItems: 'center', flexWrap: 'wrap' }}>
          {p ? <Tag label={p.kind === 'character' ? 'Karakter dolabı' : 'Persona'} tone="ink" /> : null}
          {l.authorId === 'editor' && !p ? <Tag label="Editör" tone="ink" /> : null}
        </View>
        <Display size="sm">{l.title}</Display>
        <Small>{l.itemIds.length} parça · {l.authorId === 'editor' ? 'Persona' : userName(l.authorId)}{r.n ? ` · ★ ${r.avg.toFixed(1)}` : ''} · {fmt(l.saves)} kayıt</Small>
      </View>
    </Pressable>
  );
}

/* ---------- show card ---------- */
export function ShowCard({ s, wide }: { s: Show; wide?: boolean }) {
  const { c } = useTheme();
  const { rating, me } = useStore();
  const router = useRouter();
  const r = rating({ kind: 'show', id: s.id });
  const url = me.links?.[s.id] ?? s.url;
  return (
    <Pressable onPress={() => router.push(`/defile/${s.id}`)} style={{ width: wide ? '100%' : 150, gap: 6 }}>
      <Photo id={s.id} url={url} imageUrl={s.imageUrl} label={s.brandName} sub={s.season} ratio={wide ? 1.4 : 0.75} size={wide ? 26 : 15} />
      <View style={{ gap: 1 }}>
        <Eyebrow color={c.fg}>{s.brandName}</Eyebrow>
        <Body weight="semi" style={{ fontSize: 13, lineHeight: 17 }} numberOfLines={2}>{s.season}{s.designer ? ` · ${s.designer}` : ''}</Body>
        <View style={{ flexDirection: 'row', gap: 6, alignItems: 'center' }}><Stars value={r.avg} size={11} /><Small style={{ fontSize: 11 }}>{r.avg.toFixed(1)} · {fmt(r.n)}</Small></View>
      </View>
    </Pressable>
  );
}

/* ---------- style card ---------- */
export function StyleCard({ s }: { s: Style }) {
  const { c } = useTheme();
  const { rating } = useStore();
  const router = useRouter();
  const r = rating({ kind: 'style', id: s.id });
  return (
    <Pressable onPress={() => router.push(`/stil/${s.id}`)} style={{ flex: 1, borderWidth: 1, borderColor: c.line, padding: 12, gap: 4, minHeight: 92, justifyContent: 'space-between' }}>
      <View style={{ gap: 2 }}>
        <Display size="sm">{s.name}</Display>
        {s.aka ? <Small style={{ fontSize: 11 }}>{s.aka}</Small> : null}
      </View>
      <View style={{ flexDirection: 'row', gap: 6, alignItems: 'center' }}><Stars value={r.avg} size={11} /><Small style={{ fontSize: 11 }}>{r.avg.toFixed(1)} · {fmt(r.n)}</Small></View>
    </Pressable>
  );
}

/* ---------- brand row ---------- */
export function BrandRow({ b }: { b: Brand }) {
  const { c } = useTheme();
  const { rating } = useStore();
  const router = useRouter();
  const r = rating({ kind: 'brand', id: b.id });
  const avg = r.n ? r.avg : (b.scores.quality + b.scores.fit + b.scores.fabric + b.scores.price) / 4;
  return (
    <Pressable onPress={() => router.push(`/marka/${b.id}`)} style={{ flexDirection: 'row', alignItems: 'center', gap: 12, borderBottomWidth: 1, borderBottomColor: c.line, paddingVertical: 10 }}>
      <View style={{ flex: 1, gap: 1 }}>
        <Display size="sm">{b.name}</Display>
        <Small>{b.origin} · {fmt(b.reviewCount + r.n)} görüş</Small>
      </View>
      <View style={{ alignItems: 'flex-end', gap: 1 }}>
        <Stars value={avg} size={12} />
        <Small style={{ fontSize: 11, color: b.leftPct >= 30 ? c.danger : c.muted }}>%{b.leftPct} koptu</Small>
      </View>
    </Pressable>
  );
}

/* ---------- person row ---------- */
export function PersonRow({ u, right }: { u: User; right?: React.ReactNode }) {
  const { c } = useTheme();
  const { meId, shelvesOf, reviewsBy, access } = useStore();
  const router = useRouter();
  const me = u.id === meId;
  const acc = access(u.id);
  const owned = shelvesOf(u.id).filter((s) => s.shelf === 'owned').length;
  const reviews = reviewsBy(u.id).length;
  return (
    <Pressable disabled={me} onPress={() => router.push(`/user/${u.id}`)} style={{ flexDirection: 'row', alignItems: 'center', gap: 12, borderBottomWidth: 1, borderBottomColor: c.line, paddingVertical: 10 }}>
      <Avatar name={me ? 'S' : u.name} accent={me} />
      <View style={{ flex: 1 }}>
        <View style={{ flexDirection: 'row', gap: 6, alignItems: 'center', flexWrap: 'wrap' }}>
          <Body weight="semi" style={{ fontSize: 14 }}>{me ? 'Sen' : u.name}</Body>
          <Small>{u.handle}</Small>
          {u.isExample ? <Tag label="örnek" tone="dashed" /> : null}
        </View>
        <Small>{acc === 'open' || acc === 'owner' ? `${owned} parça · ` : acc === 'private' ? 'dolabı gizli · ' : 'dolabı takipçilerine açık · '}{reviews} yorum</Small>
      </View>
      {right}
    </Pressable>
  );
}

/* ---------- review card ---------- */
export function ReviewCard({ r, showTarget, compact }: { r: Review; showTarget?: boolean; compact?: boolean }) {
  const { c, f } = useTheme();
  const { userName, user, commentsFor, meId, subjectName, likesOf, liked, toggleLike } = useStore();
  const router = useRouter();
  const u = user(r.userId);
  const comments = commentsFor(r.id);
  const likes = likesOf(r.id);
  const on = liked(r.id);
  return (
    <Pressable onPress={() => router.push(`/review/${r.id}`)} style={{ gap: 6, paddingVertical: compact ? 0 : 4 }}>
      <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8, flexWrap: 'wrap' }}>
        <Avatar name={r.userId === meId ? 'S' : u?.name ?? '?'} size={26} accent={r.userId === meId} />
        <Body weight="semi" style={{ fontSize: 14 }}>{userName(r.userId)}</Body>
        <Stars value={r.rating} />
        {r.brandStatus ? <Tag label={{ loyal: 'Sadığım', sometimes: 'Ara sıra', left: 'Koptum' }[r.brandStatus]} tone={r.brandStatus === 'left' ? 'ink' : 'neutral'} /> : null}
        <Small style={{ marginLeft: 'auto' }}>{timeAgo(r.createdAt)}</Small>
      </View>
      {showTarget ? <Small weight="bold" muted={false} style={{ color: c.accent, fontSize: 10, letterSpacing: 1.4, textTransform: 'uppercase' }}>{KIND_LABEL[r.targetType]} · {subjectName({ kind: r.targetType, id: r.targetId })}</Small> : null}
      <Body numberOfLines={compact ? 3 : undefined} style={compact ? undefined : { fontFamily: f.displayRegular, fontSize: 18, lineHeight: 25 }}>{r.body}</Body>
      <View style={{ flexDirection: 'row', alignItems: 'center', gap: 12 }}>
        <Pressable onPress={() => toggleLike(r.id)} hitSlop={8} accessibilityLabel={on ? 'Beğenmekten vazgeç' : 'Beğen'}>
          <Small weight="bold" muted={!on} style={on ? { color: c.accent } : undefined}>{on ? '♥' : '♡'} {likes}</Small>
        </Pressable>
        <Small style={{ marginLeft: 'auto' }}>{comments.length ? `${comments.length} yanıt · ` : ''}tartış →</Small>
      </View>
    </Pressable>
  );
}

export function ReviewList({ reviews, showTarget, empty = 'İlk yorumu sen yaz.' }: { reviews: Review[]; showTarget?: boolean; empty?: string }) {
  const { c } = useTheme();
  if (!reviews.length) return <Small>{empty}</Small>;
  return (
    <View style={{ gap: 14 }}>
      {reviews.map((r, i) => (
        <View key={r.id} style={{ gap: 14 }}>
          {i > 0 ? <View style={{ height: 1, backgroundColor: c.line }} /> : null}
          <ReviewCard r={r} showTarget={showTarget} />
        </View>
      ))}
    </View>
  );
}
