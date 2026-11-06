import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { KIND_ROUTE, LocalRepo, ME_ID, type NewItem, type Repo, type ShelfPatch, type Snapshot } from './data/repo';
import { supabaseEnabled } from './data/supabase';
import { LangProvider, deviceLang, type Lang } from './i18n';
import { STARRED, type Activity, type Brand, type Comment, type Follow, type FollowStatus, type Item, type List, type Persona, type Review, type Shelf, type ShelfEntry, type Show, type Style, type SubjectKind, type User, type UserData, type Visibility } from './data/types';

export type Access = 'owner' | 'open' | 'pending' | 'locked' | 'private';
export type SubjectRef = { kind: SubjectKind; id: string };
export type Rating = { avg: number; n: number; dist: number[] };

type Ctx = {
  ready: boolean;
  snap: Snapshot;
  meId: string;
  me: UserData;
  // catalog
  item: (id: string) => Item | undefined;
  brand: (id: string) => Brand | undefined;
  show: (id: string) => Show | undefined;
  style: (id: string) => Style | undefined;
  list: (id: string) => List | undefined;
  persona: (id: string) => Persona | undefined;
  allItems: () => Item[];
  allLists: () => List[];
  /** display name + route for any reviewable thing */
  subjectName: (s: SubjectRef) => string;
  subjectSub: (s: SubjectRef) => string;
  subjectRoute: (s: SubjectRef) => string;
  // people
  user: (id: string) => User | undefined;
  userName: (id: string) => string;
  allUsers: () => User[];
  /** what a viewer (you) may see of someone's wardrobe */
  access: (userId: string) => Access;
  /** shelves you are allowed to see (hidden rows only for the owner) */
  shelvesOf: (userId: string) => ShelfEntry[];
  myShelf: (itemId: string) => Shelf | null;
  myEntry: (itemId: string) => ShelfEntry | undefined;
  /** where the people you follow bought this item */
  purchasesOf: (itemId: string) => { user: User; entry: ShelfEntry }[];
  /** stores a person buys from, most frequent first */
  storesOf: (userId: string) => { store: string; n: number }[];
  signatureOf: (userId: string) => Item[];
  // reviews
  reviewsFor: (s: SubjectRef) => Review[];
  reviewsBy: (userId: string) => Review[];
  review: (id: string) => Review | undefined;
  rating: (s: SubjectRef) => Rating;
  myReviewFor: (s: SubjectRef) => Review | undefined;
  commentsFor: (reviewId: string) => Comment[];
  likesOf: (reviewId: string) => number;
  liked: (reviewId: string) => boolean;
  // follow
  followStatus: (userId: string) => FollowStatus | null;
  isFollowing: (userId: string) => boolean;
  isFollowingPersona: (personaId: string) => boolean;
  following: () => User[];
  pendingRequests: () => User[];
  ownedFrom: (userId: string, persona: Persona) => number;
  feed: () => Activity[];
  /** most added this week (community snapshot + your follows) */
  trending: () => Item[];
  listsWith: (itemId: string) => List[];
  // actions
  setShelf: (itemId: string, shelf: Shelf | null, patch?: ShelfPatch) => Promise<void>;
  patchShelf: (itemId: string, patch: ShelfPatch) => Promise<void>;
  addReview: (r: Omit<Review, 'id' | 'userId' | 'createdAt'>) => Promise<void>;
  deleteReview: (id: string) => Promise<void>;
  addComment: (reviewId: string, body: string) => Promise<void>;
  toggleLike: (reviewId: string) => Promise<void>;
  toggleFollow: (userId: string) => Promise<FollowStatus | null>;
  respondFollower: (userId: string, accept: boolean) => Promise<void>;
  togglePersonaFollow: (personaId: string) => Promise<void>;
  updateProfile: (p: UserData['profile']) => Promise<void>;
  setSignature: (ids: string[]) => Promise<void>;
  setIntroSeen: () => Promise<void>;
  setBrandTip: (itemId: string, brand: string) => Promise<void>;
  setPhoto: (subjectId: string, dataUri: string | null) => Promise<void>;
  setLink: (subjectId: string, url: string) => Promise<void>;
  addItem: (n: NewItem) => Promise<Item>;
  addList: (l: Pick<List, 'title' | 'description' | 'itemIds'>) => Promise<List>;
  toggleListItem: (listId: string, itemId: string) => Promise<void>;
  lang: Lang;
  setLang: (lang: Lang | undefined) => Promise<void>;
  looksOf: (showId: string) => string[];
  setLook: (showId: string, index: number, uri: string | null) => Promise<void>;
  addSuggestion: (text: string) => Promise<void>;
  savedList: (listId: string) => boolean;
  savesOf: (listId: string) => number;
  toggleSaveList: (listId: string) => Promise<void>;
  reload: () => Promise<void>;
};

const StoreCtx = createContext<Ctx | null>(null);

const emptyMe = (): UserData => ({ profile: { name: 'Sen', handle: '@sen', bio: '', visibility: 'followers', signature: [] }, shelves: [], reviews: [], comments: [], follows: [], followers: [], personaFollows: [], brandTips: {}, photos: {}, links: {}, items: [], lists: [], likedReviews: [], savedLists: [], introSeen: false });
const emptySnap: Snapshot = { brands: [], items: [], shows: [], styles: [], lists: [], personas: [], scenes: [], users: [], shelves: [], reviews: [], comments: [], follows: [], personaFollows: [], me: emptyMe(), meId: ME_ID };

async function makeRepo(): Promise<Repo> {
  if (supabaseEnabled) {
    const { SupabaseRepo } = await import('./data/supabase');
    return new SupabaseRepo();
  }
  return new LocalRepo();
}

export function StoreProvider({ children }: { children: React.ReactNode }) {
  const [repo, setRepo] = useState<Repo | null>(null);
  const [snap, setSnap] = useState<Snapshot>(emptySnap);
  const [ready, setReady] = useState(false);

  const reload = useCallback(async () => {
    const r = repo ?? (await makeRepo());
    if (!repo) setRepo(r);
    try { setSnap(await r.load()); } catch (e) { console.warn('load failed', e); }
    setReady(true);
  }, [repo]);

  useEffect(() => { reload(); }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const me = snap.me;
  const meId = snap.meId;
  const meUser: User = useMemo(() => ({ id: meId, name: me.profile.name, handle: me.profile.handle, bio: me.profile.bio, visibility: me.profile.visibility, signature: me.profile.signature }), [meId, me.profile]);
  const patchMe = (fn: (m: UserData) => UserData) => setSnap((s) => ({ ...s, me: fn(s.me) }));

  const value: Ctx = useMemo(() => {
    const byId = <T extends { id: string }>(list: T[]) => (id: string) => list.find((x) => x.id === id);
    const allItems = () => [...me.items, ...snap.items];
    const allLists = () => [...me.lists, ...snap.lists];
    const item = byId(allItems());
    const brand = byId(snap.brands);
    const show = byId(snap.shows);
    const style = byId(snap.styles);
    const list = byId(allLists());
    const persona = byId(snap.personas);
    const allUsers = () => [...snap.users, meUser];
    const user = (id: string) => (id === meId ? meUser : snap.users.find((u) => u.id === id));
    const userName = (id: string) => (id === meId ? 'Sen' : user(id)?.name ?? 'Biri');
    const subjectName = (s: SubjectRef) => {
      if (s.kind === 'item') return item(s.id)?.name ?? 'Parça';
      if (s.kind === 'brand') return brand(s.id)?.name ?? 'Marka';
      if (s.kind === 'show') { const x = show(s.id); return x ? `${x.brandName} ${x.season}` : 'Defile'; }
      if (s.kind === 'style') return style(s.id)?.name ?? 'Stil';
      return list(s.id)?.title ?? 'Liste';
    };
    const subjectSub = (s: SubjectRef) => {
      if (s.kind === 'item') { const x = item(s.id); return x ? (x.brandName ?? x.category) : ''; }
      if (s.kind === 'brand') return brand(s.id)?.origin ?? '';
      if (s.kind === 'show') { const x = show(s.id); return x ? `${x.city} · ${x.when}` : ''; }
      if (s.kind === 'style') return style(s.id)?.era ?? '';
      const l = list(s.id); return l ? `${l.itemIds.length} parça · ${l.authorId === 'editor' ? 'Persona' : userName(l.authorId)}` : '';
    };
    const subjectRoute = (s: SubjectRef) => KIND_ROUTE[s.kind] + s.id;
    const followStatus = (uid: string) => me.follows.find((f) => f.followeeId === uid)?.status ?? null;
    const access = (uid: string): Access => {
      if (uid === meId) return 'owner';
      const u = user(uid);
      if (!u) return 'private';
      if (u.visibility === 'public') return 'open';
      if (u.visibility === 'private') return 'private';
      const st = followStatus(uid);
      return st === 'accepted' ? 'open' : st === 'pending' ? 'pending' : 'locked';
    };
    const rawShelves = (uid: string) => (uid === meId ? me.shelves : snap.shelves.filter((s) => s.userId === uid));
    const shelvesOf = (uid: string) => {
      const a = access(uid);
      if (a === 'owner') return me.shelves;
      if (a !== 'open') return [];
      return rawShelves(uid).filter((s) => !s.hidden);
    };
    const allReviews = () => [...me.reviews, ...snap.reviews];
    const allComments = () => [...snap.comments, ...me.comments];
    const reviewsFor = (s: SubjectRef) => allReviews().filter((r) => r.targetType === s.kind && r.targetId === s.id).sort((a, b) => b.createdAt - a.createdAt);
    /**
     * Stars live on pieces and shows. A brand's or a style's score is computed from its
     * pieces' reviews (plus the catalog's community snapshot); a list has saves, not stars.
     */
    const starred = (s: SubjectRef) => reviewsFor(s).filter((r) => r.rating > 0);
    const dist5 = (rs: Review[]) => { const d = [0, 0, 0, 0, 0]; rs.forEach((r) => { d[Math.min(5, Math.max(1, Math.round(r.rating))) - 1]++; }); return d; };
    const rating = (s: SubjectRef): Rating => {
      if (s.kind === 'item') {
        const rs = starred(s);
        return { avg: rs.length ? rs.reduce((a, r) => a + r.rating, 0) / rs.length : 0, n: rs.length, dist: dist5(rs) };
      }
      if (s.kind === 'show') {
        const rs = starred(s); const x = show(s.id);
        const base = x ? { avg: x.avg, n: x.reviewCount } : { avg: 0, n: 0 };
        if (!rs.length) return { avg: base.avg, n: base.n, dist: dist5(rs) };
        const avg = rs.reduce((a, r) => a + r.rating, 0) / rs.length;
        return { avg: (base.avg * base.n + avg * rs.length) / (base.n + rs.length), n: base.n + rs.length, dist: dist5(rs) };
      }
      if (s.kind === 'list') return { avg: 0, n: 0, dist: [0, 0, 0, 0, 0] };
      // brand / style: computed from their pieces
      const pieces = s.kind === 'brand'
        ? allItems().filter((i) => i.brandId === s.id || (brand(s.id) && i.brandName === brand(s.id)!.name))
        : allItems().filter((i) => i.styleIds?.includes(s.id) || style(s.id)?.itemIds.includes(i.id));
      const rs = pieces.flatMap((i) => starred({ kind: 'item', id: i.id }));
      const b = s.kind === 'brand' ? brand(s.id) : undefined;
      const st = s.kind === 'style' ? style(s.id) : undefined;
      const base = b ? { avg: (b.scores.quality + b.scores.fit + b.scores.fabric + b.scores.price) / 4, n: b.reviewCount } : st ? { avg: st.avg, n: st.reviewCount } : { avg: 0, n: 0 };
      if (!rs.length) return { avg: base.avg, n: base.n, dist: dist5(rs) };
      const avg = rs.reduce((a, r) => a + r.rating, 0) / rs.length;
      return { avg: (base.avg * base.n + avg * rs.length) / (base.n + rs.length), n: base.n + rs.length, dist: dist5(rs) };
    };
    const ownedFrom = (uid: string, p: Persona) => {
      const have = rawShelves(uid).filter((s) => s.shelf === 'showcase').map((s) => s.itemId);
      return p.itemIds.filter((id) => have.includes(id)).length;
    };
    const storesOf = (uid: string) => {
      const m = new Map<string, number>();
      shelvesOf(uid).forEach((s) => { if (s.store && s.shelf === 'showcase') { const k = s.store.split(',')[0].trim(); m.set(k, (m.get(k) ?? 0) + 1); } });
      return [...m.entries()].map(([store, n]) => ({ store, n })).sort((a, b) => b.n - a.n);
    };
    const purchasesOf = (itemId: string) =>
      snap.shelves
        .filter((s) => s.itemId === itemId && s.shelf === 'showcase' && s.store && !s.hidden && access(s.userId) === 'open' && followStatus(s.userId) === 'accepted')
        .map((entry) => ({ user: user(entry.userId)!, entry }))
        .filter((x) => x.user);
    const feed = (): Activity[] => {
      const ids = new Set(me.follows.filter((f) => f.status === 'accepted').map((f) => f.followeeId));
      const acts: Activity[] = [];
      snap.shelves.filter((s) => ids.has(s.userId) && !s.hidden).forEach((s) => acts.push({ id: 'sh' + s.userId + s.itemId, kind: 'shelf', userId: s.userId, itemId: s.itemId, shelf: s.shelf, createdAt: s.createdAt }));
      snap.reviews.filter((r) => ids.has(r.userId)).forEach((r) => acts.push({ id: 'rv' + r.id, kind: 'review', userId: r.userId, reviewId: r.id, createdAt: r.createdAt }));
      snap.comments.filter((c) => ids.has(c.userId)).forEach((c) => acts.push({ id: 'cm' + c.id, kind: 'comment', userId: c.userId, commentId: c.id, createdAt: c.createdAt }));
      snap.lists.filter((l) => ids.has(l.authorId)).forEach((l) => acts.push({ id: 'ls' + l.id, kind: 'list', userId: l.authorId, listId: l.id, createdAt: l.createdAt }));
      snap.personaFollows.filter((f) => ids.has(f.userId)).forEach((f) => acts.push({ id: 'pf' + f.userId + f.personaId, kind: 'persona', userId: f.userId, personaId: f.personaId, createdAt: 0 }));
      return acts.sort((a, b) => b.createdAt - a.createdAt);
    };
    const trending = () => {
      const week = Date.now() - 7 * 24 * 3600e3;
      const m = new Map<string, number>();
      [...snap.shelves, ...me.shelves].forEach((s) => { if (s.createdAt > week) m.set(s.itemId, (m.get(s.itemId) ?? 0) + 1); });
      const recent = [...m.entries()].sort((a, b) => b[1] - a[1]).map(([id]) => item(id)).filter(Boolean) as Item[];
      const rest = [...snap.items].sort((a, b) => b.ownedCount - a.ownedCount).filter((i) => !recent.includes(i));
      return [...recent, ...rest].slice(0, 8);
    };
    return {
      ready, snap, meId, me,
      item, brand, show, style, list, persona, allItems, allLists, subjectName, subjectSub, subjectRoute,
      user, userName, allUsers, access, shelvesOf,
      myShelf: (itemId) => me.shelves.find((s) => s.itemId === itemId)?.shelf ?? null,
      myEntry: (itemId) => me.shelves.find((s) => s.itemId === itemId),
      purchasesOf, storesOf,
      signatureOf: (uid) => ((uid === meId ? me.profile.signature : user(uid)?.signature) ?? []).map(item).filter(Boolean) as Item[],
      reviewsFor,
      reviewsBy: (uid) => (uid === meId ? me.reviews : snap.reviews.filter((r) => r.userId === uid)).sort((a, b) => b.createdAt - a.createdAt),
      review: (id) => allReviews().find((r) => r.id === id),
      rating,
      myReviewFor: (s) => me.reviews.find((r) => r.targetType === s.kind && r.targetId === s.id),
      commentsFor: (rid) => allComments().filter((c) => c.reviewId === rid).sort((a, b) => a.createdAt - b.createdAt),
      likesOf: (rid) => (allReviews().find((r) => r.id === rid)?.likes ?? 0) + (me.likedReviews.includes(rid) ? 1 : 0),
      liked: (rid) => me.likedReviews.includes(rid),
      followStatus,
      isFollowing: (uid) => followStatus(uid) === 'accepted',
      isFollowingPersona: (pid) => me.personaFollows.includes(pid),
      following: () => me.follows.filter((f) => f.status === 'accepted').map((f) => user(f.followeeId)).filter(Boolean) as User[],
      pendingRequests: () => me.followers.filter((f) => f.status === 'pending').map((f) => user(f.followerId)).filter(Boolean) as User[],
      ownedFrom, feed, trending,
      listsWith: (itemId) => allLists().filter((l) => l.itemIds.includes(itemId)),
      async setShelf(itemId, shelf, patch = {}) {
        patchMe((m) => {
          const prev = m.shelves.find((s) => s.itemId === itemId);
          const rest = m.shelves.filter((s) => s.itemId !== itemId);
          return { ...m, shelves: shelf ? [{ userId: meId, itemId, shelf, createdAt: Date.now(), store: prev?.store, priceText: prev?.priceText, url: prev?.url, hidden: prev?.hidden, ...patch }, ...rest] : rest };
        });
        await repo?.setShelf(itemId, shelf, patch);
      },
      async patchShelf(itemId, patch) {
        patchMe((m) => ({ ...m, shelves: m.shelves.map((s) => (s.itemId === itemId ? { ...s, ...patch } : s)) }));
        await repo?.patchShelf(itemId, patch);
      },
      async addReview(r) {
        if (STARRED.includes(r.targetType) && !(r.rating > 0)) throw new Error('Parçaya ve koleksiyona yıldız gerekir.');
        if (!STARRED.includes(r.targetType)) r = { ...r, rating: 0 };
        const created = await repo?.addReview(r);
        const review: Review = created ?? { ...r, id: 'tmp' + Date.now(), userId: meId, createdAt: Date.now() };
        patchMe((m) => ({ ...m, reviews: [review, ...m.reviews.filter((x) => !(x.targetType === r.targetType && x.targetId === r.targetId))] }));
      },
      async deleteReview(id) { patchMe((m) => ({ ...m, reviews: m.reviews.filter((x) => x.id !== id) })); await repo?.deleteReview(id); },
      async addComment(reviewId, body) {
        const created = await repo?.addComment(reviewId, body);
        const c: Comment = created ?? { id: 'tmp' + Date.now(), reviewId, userId: meId, body, createdAt: Date.now() };
        patchMe((m) => ({ ...m, comments: [...m.comments, c] }));
      },
      async toggleLike(rid) {
        patchMe((m) => ({ ...m, likedReviews: m.likedReviews.includes(rid) ? m.likedReviews.filter((x) => x !== rid) : [...m.likedReviews, rid] }));
        await repo?.toggleLike(rid);
      },
      async toggleFollow(uid) {
        const target = user(uid);
        const vis: Visibility = target?.visibility ?? 'followers';
        const want = !me.follows.some((f) => f.followeeId === uid);
        const status: FollowStatus | null = want ? (vis === 'public' ? 'accepted' : 'pending') : null;
        patchMe((m) => ({ ...m, follows: [...m.follows.filter((f) => f.followeeId !== uid), ...(status ? [{ followerId: meId, followeeId: uid, status } as Follow] : [])] }));
        await repo?.setFollow(uid, want, vis);
        // demo: example people approve requests after a moment, so the flow can be seen end to end
        if (status === 'pending' && target?.isExample && repo instanceof LocalRepo) {
          setTimeout(async () => {
            await (repo as LocalRepo).acceptPending(uid);
            patchMe((m) => ({ ...m, follows: m.follows.map((f) => (f.followeeId === uid ? { ...f, status: 'accepted' } : f)) }));
          }, 2500);
        }
        return status;
      },
      async respondFollower(uid, accept) {
        patchMe((m) => ({ ...m, followers: accept ? m.followers.map((f) => (f.followerId === uid ? { ...f, status: 'accepted' } : f)) : m.followers.filter((f) => f.followerId !== uid) }));
        await repo?.respondFollower(uid, accept);
      },
      async togglePersonaFollow(pid) {
        patchMe((m) => ({ ...m, personaFollows: m.personaFollows.includes(pid) ? m.personaFollows.filter((x) => x !== pid) : [...m.personaFollows, pid] }));
        await repo?.togglePersonaFollow(pid);
      },
      async updateProfile(p) { patchMe((m) => ({ ...m, profile: p })); await repo?.updateProfile(p); },
      async setSignature(ids) {
        const profile = { ...me.profile, signature: ids.slice(0, 4) };
        patchMe((m) => ({ ...m, profile }));
        await repo?.updateProfile(profile);
      },
      async setIntroSeen() { patchMe((m) => ({ ...m, introSeen: true })); await repo?.setIntroSeen(); },
      async setBrandTip(itemId, b) {
        patchMe((m) => { const t = { ...m.brandTips }; if (b) t[itemId] = b; else delete t[itemId]; return { ...m, brandTips: t }; });
        await repo?.setBrandTip(itemId, b);
      },
      async setPhoto(id, dataUri) {
        patchMe((m) => { const p = { ...(m.photos ?? {}) }; if (dataUri) p[id] = dataUri; else delete p[id]; return { ...m, photos: p }; });
        await repo?.setPhoto(id, dataUri);
      },
      async setLink(id, url) {
        patchMe((m) => { const l = { ...(m.links ?? {}) }; if (url) l[id] = url; else delete l[id]; return { ...m, links: l }; });
        await repo?.setLink(id, url);
      },
      async addItem(n) {
        const created = await repo?.addItem(n);
        const it: Item = created ?? { ...n, id: 'tmp-' + Date.now(), ownedCount: 0, verification: 'none', searchQuery: n.name, addedBy: meId };
        patchMe((m) => ({ ...m, items: [it, ...m.items] }));
        return it;
      },
      async addList(l) {
        const created = await repo?.addList(l);
        const nl: List = created ?? { ...l, id: 'tmp-' + Date.now(), authorId: meId, saves: 0, createdAt: Date.now() };
        patchMe((m) => ({ ...m, lists: [nl, ...m.lists] }));
        return nl;
      },
      looksOf: (sid) => me.looks?.[sid] ?? [],
      async setLook(sid, index, uri) {
        patchMe((m) => { const looks = { ...(m.looks ?? {}) }; const arr = [...(looks[sid] ?? [])]; if (uri) { if (index >= arr.length) arr.push(uri); else arr[index] = uri; } else arr.splice(index, 1); looks[sid] = arr; return { ...m, looks }; });
        await repo?.setLook(sid, index, uri);
      },
      lang: me.lang ?? deviceLang(),
      async setLang(l) { patchMe((m) => ({ ...m, lang: l })); await repo?.setLang(l); },
      async addSuggestion(text) { patchMe((m) => ({ ...m, suggestions: [...(m.suggestions ?? []), text] })); await repo?.addSuggestion(text); },
      savedList: (id) => me.savedLists.includes(id),
      savesOf: (id) => (list(id)?.saves ?? 0) + (me.savedLists.includes(id) ? 1 : 0),
      async toggleSaveList(id) {
        patchMe((m) => ({ ...m, savedLists: m.savedLists.includes(id) ? m.savedLists.filter((x) => x !== id) : [...m.savedLists, id] }));
        await repo?.toggleSaveList(id);
      },
      async toggleListItem(listId, itemId) {
        patchMe((m) => ({ ...m, lists: m.lists.map((l) => (l.id === listId ? { ...l, itemIds: l.itemIds.includes(itemId) ? l.itemIds.filter((x) => x !== itemId) : [...l.itemIds, itemId] } : l)) }));
        await repo?.toggleListItem(listId, itemId);
      },
      reload,
    };
  }, [ready, snap, me, meId, meUser, repo, reload]);

  return <StoreCtx.Provider value={value}><LangProvider value={value.lang}>{children}</LangProvider></StoreCtx.Provider>;
}

export function useStore() {
  const ctx = useContext(StoreCtx);
  if (!ctx) throw new Error('useStore must be used inside StoreProvider');
  return ctx;
}
