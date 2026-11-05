/**
 * Supabase repository. Used automatically when EXPO_PUBLIC_SUPABASE_URL and
 * EXPO_PUBLIC_SUPABASE_ANON_KEY are set (see .env.example). Schema: supabase/schema.sql.
 * Catalog tables (brands, items, personas, scenes) are read from the database;
 * social tables are written as the signed-in user. Row-level security decides what
 * other people's shelves you may read (public / accepted follower / owner).
 */
import AsyncStorage from '@react-native-async-storage/async-storage';
import { createClient, type SupabaseClient } from '@supabase/supabase-js';
import { Platform } from 'react-native';
import type { NewItem, Repo, ShelfPatch, Snapshot } from './repo';
import { emptyUserData, slug } from './repo';
import { LISTS, SHOWS, STYLES } from './seed';
import type { Brand, Comment, Follow, FollowStatus, Item, List, Persona, PersonaFollow, Review, Scene, Shelf, ShelfEntry, User, UserData, Visibility } from './types';

const URL = process.env.EXPO_PUBLIC_SUPABASE_URL;
const KEY = process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY;

export const supabaseEnabled = Boolean(URL && KEY);

let client: SupabaseClient | null = null;
export function supabase(): SupabaseClient {
  if (!client) {
    if (!URL || !KEY) throw new Error('Supabase yapılandırılmamış');
    client = createClient(URL, KEY, {
      auth: {
        storage: Platform.OS === 'web' ? undefined : AsyncStorage,
        autoRefreshToken: true,
        persistSession: true,
        detectSessionInUrl: Platform.OS === 'web',
      },
    });
  }
  return client;
}

const ts = (s: string) => new Date(s).getTime();

export class SupabaseRepo implements Repo {
  private meId = '';
  private me: UserData = emptyUserData();

  async load(): Promise<Snapshot> {
    const sb = supabase();
    const { data: auth } = await sb.auth.getUser();
    this.meId = auth.user?.id ?? '';
    const [brands, items, personas, personaItems, purchases, scenes, sceneItems, profiles, shelves, reviews, comments, follows, pfollows, photos, links, likes, userItems, lists, listItems, listSaves] = await Promise.all([
      sb.from('brands').select('*'),
      sb.from('items').select('*'),
      sb.from('personas').select('*'),
      sb.from('persona_items').select('*').order('position'),
      sb.from('persona_purchases').select('*'),
      sb.from('scenes').select('*'),
      sb.from('scene_items').select('*'),
      sb.from('profiles').select('*'),
      sb.from('shelves').select('*'),
      sb.from('reviews').select('*').order('created_at', { ascending: false }),
      sb.from('review_comments').select('*').order('created_at'),
      sb.from('follows').select('*'),
      sb.from('persona_follows').select('*'),
      sb.from('item_photos').select('*').eq('user_id', this.meId),
      sb.from('item_links').select('*').eq('user_id', this.meId),
      sb.from('review_likes').select('*'),
      sb.from('user_items').select('*'),
      sb.from('lists').select('*'),
      sb.from('list_items').select('*').order('position'),
      sb.from('list_saves').select('*'),
    ]);
    const B: Brand[] = (brands.data ?? []).map((b: any) => ({ id: b.id, name: b.name, origin: b.origin ?? '', scores: { quality: b.quality ?? 3, fit: b.fit ?? 3, fabric: b.fabric ?? 3, price: b.price ?? 3 }, leftPct: b.left_pct ?? 0, reviewCount: b.review_count ?? 0 }));
    const I: Item[] = (items.data ?? []).map((i: any) => ({ id: i.id, type: i.type, name: i.name, category: i.category, brandName: i.brand_name ?? undefined, brandId: i.brand_id ?? undefined, color: i.color ?? '#999', priceText: i.price_text ?? undefined, year: i.year ?? undefined, verification: i.verification ?? 'none', note: i.note ?? undefined, notes: i.notes ?? undefined, searchQuery: i.search_query ?? i.name, ownedCount: i.owned_count ?? 0, url: i.url ?? undefined, imageUrl: i.image_url ?? undefined }));
    const P: Persona[] = (personas.data ?? []).map((p: any) => ({
      id: p.id, kind: p.kind, name: p.name, shortName: p.short_name ?? p.name.split(' ')[0], handle: p.handle ?? undefined, followers: p.followers ?? undefined, source: p.source ?? '', bio: p.bio ?? '', tags: p.tags ?? [], colors: [p.color_a ?? '#ccc', p.color_b ?? '#333'],
      itemIds: (personaItems.data ?? []).filter((x: any) => x.persona_id === p.id).map((x: any) => x.item_id),
      purchases: Object.fromEntries((purchases.data ?? []).filter((x: any) => x.persona_id === p.id).map((x: any) => [x.item_id, { store: x.store, priceText: x.price_text ?? undefined, url: x.url ?? undefined }])),
      isExample: p.is_example ?? false,
    }));
    const S: Scene[] = (scenes.data ?? []).map((s: any) => ({ id: s.id, personaId: s.persona_id, episode: s.episode ?? '', title: s.title, where: s.place ?? '', itemIds: (sceneItems.data ?? []).filter((x: any) => x.scene_id === s.id).map((x: any) => x.item_id) }));
    const U: User[] = (profiles.data ?? []).map((u: any) => ({ id: u.id, name: u.name ?? 'Kullanıcı', handle: u.handle ? '@' + u.handle : '', bio: u.bio ?? '', visibility: (u.visibility ?? 'followers') as Visibility, signature: u.signature ?? [] }));
    const UI: Item[] = (userItems.data ?? []).map((i: any) => ({ id: i.id, type: i.type ?? 'clothing', name: i.name, category: i.category ?? 'Parça', brandName: i.brand_name ?? undefined, brandId: i.brand_id ?? undefined, color: i.color ?? '#999', priceText: i.price_text ?? undefined, verification: 'none', searchQuery: [i.brand_name, i.name].filter(Boolean).join(' '), ownedCount: 0, url: i.url ?? undefined, imageUrl: i.image_url ?? undefined, addedBy: i.user_id }));
    const likeCount = new Map<string, number>();
    (likes.data ?? []).forEach((l: any) => { if (l.user_id !== this.meId) likeCount.set(l.review_id, (likeCount.get(l.review_id) ?? 0) + 1); });
    const L: List[] = (lists.data ?? []).map((l: any) => ({ id: l.id, title: l.title, authorId: l.author_id ?? 'editor', description: l.description ?? undefined, personaId: l.persona_id ?? undefined, saves: l.saves ?? 0, createdAt: ts(l.created_at),
      itemIds: (listItems.data ?? []).filter((x: any) => x.list_id === l.id).map((x: any) => x.item_id),
      notes: Object.fromEntries((listItems.data ?? []).filter((x: any) => x.list_id === l.id && x.note).map((x: any) => [x.item_id, x.note])) }));
    const editorLists = L.some((l) => l.authorId === 'editor') ? [] : LISTS.filter((l) => l.authorId === 'editor');
    const SH: ShelfEntry[] = (shelves.data ?? []).map((s: any) => ({ userId: s.user_id, itemId: s.item_id, shelf: s.shelf, createdAt: ts(s.created_at), store: s.store ?? undefined, priceText: s.price_text ?? undefined, url: s.url ?? undefined, hidden: s.hidden ?? false }));
    const R: Review[] = (reviews.data ?? []).map((r: any) => ({ id: r.id, userId: r.user_id, targetType: r.target_type, targetId: r.target_id, rating: r.rating, body: r.body ?? '', brandStatus: r.brand_status ?? undefined, tags: r.tags ?? [], createdAt: ts(r.created_at), likes: likeCount.get(r.id) ?? 0 }));
    const C: Comment[] = (comments.data ?? []).map((c: any) => ({ id: c.id, reviewId: c.review_id, userId: c.user_id, body: c.body, createdAt: ts(c.created_at) }));
    const F: Follow[] = (follows.data ?? []).map((f: any) => ({ followerId: f.follower_id, followeeId: f.followee_id, status: (f.status ?? 'accepted') as FollowStatus }));
    const PF: PersonaFollow[] = (pfollows.data ?? []).map((f: any) => ({ userId: f.user_id, personaId: f.persona_id }));
    const meProfile = U.find((u) => u.id === this.meId);
    this.me = {
      profile: { name: meProfile?.name ?? 'Sen', handle: meProfile?.handle ?? '@sen', bio: meProfile?.bio ?? '', visibility: meProfile?.visibility ?? 'followers', signature: meProfile?.signature ?? [] },
      shelves: SH.filter((s) => s.userId === this.meId),
      reviews: R.filter((r) => r.userId === this.meId),
      comments: C.filter((c) => c.userId === this.meId),
      follows: F.filter((f) => f.followerId === this.meId),
      followers: F.filter((f) => f.followeeId === this.meId),
      personaFollows: PF.filter((f) => f.userId === this.meId).map((f) => f.personaId),
      brandTips: {},
      photos: Object.fromEntries((photos.data ?? []).map((x: any) => [x.item_id, x.url])),
      links: Object.fromEntries((links.data ?? []).map((x: any) => [x.item_id, x.url])),
      items: UI.filter((i) => i.addedBy === this.meId),
      lists: L.filter((l) => l.authorId === this.meId),
      likedReviews: (likes.data ?? []).filter((l: any) => l.user_id === this.meId).map((l: any) => l.review_id),
      savedLists: (listSaves.data ?? []).filter((l: any) => l.user_id === this.meId).map((l: any) => l.list_id),
      introSeen: true,
    };
    return {
      brands: B, items: [...I, ...UI.filter((i) => i.addedBy !== this.meId)], shows: SHOWS, styles: STYLES, lists: [...editorLists, ...L.filter((l) => l.authorId !== this.meId)],
      personas: P, scenes: S, users: U.filter((u) => u.id !== this.meId),
      shelves: SH.filter((s) => s.userId !== this.meId), reviews: R.filter((r) => r.userId !== this.meId), comments: C.filter((c) => c.userId !== this.meId),
      follows: F.filter((f) => f.followerId !== this.meId && f.followeeId !== this.meId), personaFollows: PF.filter((f) => f.userId !== this.meId),
      me: this.me, meId: this.meId,
    };
  }

  async setShelf(itemId: string, shelf: Shelf | null, patch: ShelfPatch = {}) {
    const sb = supabase();
    if (!shelf) { await sb.from('shelves').delete().match({ user_id: this.meId, item_id: itemId }); return; }
    await sb.from('shelves').upsert({ user_id: this.meId, item_id: itemId, shelf, store: patch.store, price_text: patch.priceText, url: patch.url, hidden: patch.hidden ?? false });
  }
  async patchShelf(itemId: string, patch: ShelfPatch) {
    const row: any = {};
    if ('store' in patch) row.store = patch.store ?? null;
    if ('priceText' in patch) row.price_text = patch.priceText ?? null;
    if ('url' in patch) row.url = patch.url ?? null;
    if ('hidden' in patch) row.hidden = !!patch.hidden;
    await supabase().from('shelves').update(row).match({ user_id: this.meId, item_id: itemId });
  }
  async addReview(r: Omit<Review, 'id' | 'userId' | 'createdAt'>) {
    const sb = supabase();
    await sb.from('reviews').delete().match({ user_id: this.meId, target_type: r.targetType, target_id: r.targetId });
    const { data, error } = await sb.from('reviews').insert({ user_id: this.meId, target_type: r.targetType, target_id: r.targetId, rating: r.rating, body: r.body, brand_status: r.brandStatus ?? null, tags: r.tags ?? [] }).select().single();
    if (error) throw error;
    return { id: data.id, userId: this.meId, targetType: r.targetType, targetId: r.targetId, rating: r.rating, body: r.body, brandStatus: r.brandStatus, tags: r.tags, createdAt: ts(data.created_at) };
  }
  async deleteReview(id: string) { await supabase().from('reviews').delete().match({ id, user_id: this.meId }); }
  async toggleLike(reviewId: string) {
    const sb = supabase();
    const { data } = await sb.from('review_likes').select('review_id').match({ user_id: this.meId, review_id: reviewId });
    if (data && data.length) { await sb.from('review_likes').delete().match({ user_id: this.meId, review_id: reviewId }); return false; }
    await sb.from('review_likes').insert({ user_id: this.meId, review_id: reviewId }); return true;
  }
  async addComment(reviewId: string, body: string) {
    const { data, error } = await supabase().from('review_comments').insert({ review_id: reviewId, user_id: this.meId, body }).select().single();
    if (error) throw error;
    return { id: data.id, reviewId, userId: this.meId, body, createdAt: ts(data.created_at) };
  }
  async setFollow(userId: string, want: boolean, targetVisibility: Visibility) {
    const sb = supabase();
    await sb.from('follows').delete().match({ follower_id: this.meId, followee_id: userId });
    if (!want) return null;
    const status: FollowStatus = targetVisibility === 'public' ? 'accepted' : 'pending';
    await sb.from('follows').insert({ follower_id: this.meId, followee_id: userId, status });
    return status;
  }
  async respondFollower(userId: string, accept: boolean) {
    const sb = supabase();
    if (accept) await sb.from('follows').update({ status: 'accepted' }).match({ follower_id: userId, followee_id: this.meId });
    else await sb.from('follows').delete().match({ follower_id: userId, followee_id: this.meId });
  }
  async togglePersonaFollow(personaId: string) {
    const sb = supabase();
    const { data } = await sb.from('persona_follows').select('persona_id').match({ user_id: this.meId, persona_id: personaId });
    if (data && data.length) { await sb.from('persona_follows').delete().match({ user_id: this.meId, persona_id: personaId }); return false; }
    await sb.from('persona_follows').insert({ user_id: this.meId, persona_id: personaId }); return true;
  }
  async updateProfile(p: UserData['profile']) {
    await supabase().from('profiles').upsert({ id: this.meId, name: p.name, handle: p.handle.replace(/^@/, ''), bio: p.bio, visibility: p.visibility, signature: p.signature ?? [] });
  }
  async setIntroSeen() {}
  async setBrandTip(itemId: string, brand: string) {
    await supabase().from('brand_tips').upsert({ user_id: this.meId, item_id: itemId, brand });
  }
  async setPhoto(itemId: string, dataUri: string | null) {
    const sb = supabase();
    const path = `${this.meId}/${itemId}.jpg`;
    if (!dataUri) { await sb.storage.from('photos').remove([path]); await sb.from('item_photos').delete().match({ user_id: this.meId, item_id: itemId }); return; }
    const b64 = dataUri.split(',')[1] ?? '';
    const bytes = Uint8Array.from(atob(b64), (ch) => ch.charCodeAt(0));
    await sb.storage.from('photos').upload(path, bytes, { contentType: 'image/jpeg', upsert: true });
    const { data } = sb.storage.from('photos').getPublicUrl(path);
    await sb.from('item_photos').upsert({ user_id: this.meId, item_id: itemId, url: data.publicUrl });
  }
  async setLink(itemId: string, url: string) {
    await supabase().from('item_links').upsert({ user_id: this.meId, item_id: itemId, url });
  }
  async addItem(n: NewItem) {
    const id = 'u-' + slug(n.name).slice(0, 24) + '-' + Math.random().toString(36).slice(2, 6);
    await supabase().from('user_items').insert({ id, user_id: this.meId, type: n.type, name: n.name, category: n.category, brand_name: n.brandName ?? null, brand_id: n.brandId ?? null, color: n.color, price_text: n.priceText ?? null, url: n.url ?? null, image_url: n.imageUrl ?? null });
    return { ...n, id, ownedCount: 0, verification: 'none' as const, searchQuery: [n.brandName, n.name].filter(Boolean).join(' '), addedBy: this.meId };
  }
  async addList(l: Pick<List, 'title' | 'description' | 'itemIds'>) {
    const sb = supabase();
    const id = 'ul-' + Math.random().toString(36).slice(2, 10);
    await sb.from('lists').insert({ id, author_id: this.meId, title: l.title, description: l.description ?? null });
    if (l.itemIds.length) await sb.from('list_items').insert(l.itemIds.map((item_id, position) => ({ list_id: id, item_id, position })));
    return { ...l, id, authorId: this.meId, saves: 0, createdAt: Date.now() };
  }
  async toggleListItem(listId: string, itemId: string) {
    const sb = supabase();
    const { data } = await sb.from('list_items').select('item_id').match({ list_id: listId, item_id: itemId });
    if (data && data.length) { await sb.from('list_items').delete().match({ list_id: listId, item_id: itemId }); return; }
    await sb.from('list_items').insert({ list_id: listId, item_id: itemId, position: 999 });
  }
  async toggleSaveList(listId: string) {
    const sb = supabase();
    const { data } = await sb.from('list_saves').select('list_id').match({ user_id: this.meId, list_id: listId });
    if (data && data.length) { await sb.from('list_saves').delete().match({ user_id: this.meId, list_id: listId }); return false; }
    await sb.from('list_saves').insert({ user_id: this.meId, list_id: listId }); return true;
  }
}

/* ---------- auth helpers (used by app/giris.tsx) ---------- */
export async function sendMagicLink(email: string) {
  const { error } = await supabase().auth.signInWithOtp({ email, options: { emailRedirectTo: Platform.OS === 'web' ? (typeof window !== 'undefined' ? window.location.origin : undefined) : 'persona://giris' } });
  if (error) throw error;
}
export async function verifyOtp(email: string, token: string) {
  const { error } = await supabase().auth.verifyOtp({ email, token, type: 'email' });
  if (error) throw error;
}
export async function signOut() { await supabase().auth.signOut(); }
export async function hasSession() { const { data } = await supabase().auth.getSession(); return Boolean(data.session); }
