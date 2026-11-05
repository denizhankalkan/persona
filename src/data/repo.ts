import AsyncStorage from '@react-native-async-storage/async-storage';
import { BRANDS, COMMENTS, FOLLOWS, ITEMS, LISTS, PERSONAS, PERSONA_FOLLOWS, REVIEWS, SCENES, SHELVES, SHOWS, STYLES, USERS } from './seed';
import type { Brand, BrandStatus, Comment, Follow, FollowStatus, Item, List, Persona, PersonaFollow, Review, Scene, Shelf, ShelfEntry, Show, Style, SubjectKind, User, UserData, Visibility } from './types';

export const ME_ID = 'me';

export interface Snapshot {
  brands: Brand[];
  items: Item[];
  shows: Show[];
  styles: Style[];
  lists: List[];
  personas: Persona[];
  scenes: Scene[];
  users: User[];
  shelves: ShelfEntry[];
  reviews: Review[];
  comments: Comment[];
  follows: Follow[];
  personaFollows: PersonaFollow[];
  me: UserData;
  meId: string;
}

export type ShelfPatch = Partial<Pick<ShelfEntry, 'store' | 'priceText' | 'url' | 'hidden'>>;
export type NewItem = Omit<Item, 'id' | 'ownedCount' | 'verification' | 'searchQuery' | 'addedBy'>;

export interface Repo {
  load(): Promise<Snapshot>;
  setShelf(itemId: string, shelf: Shelf | null, patch?: ShelfPatch): Promise<void>;
  patchShelf(itemId: string, patch: ShelfPatch): Promise<void>;
  addReview(r: Omit<Review, 'id' | 'userId' | 'createdAt'>): Promise<Review>;
  deleteReview(id: string): Promise<void>;
  addComment(reviewId: string, body: string): Promise<Comment>;
  /** like / unlike a review. Returns the new state. */
  toggleLike(reviewId: string): Promise<boolean>;
  /** follow / request / unfollow. Returns the resulting status, or null when unfollowed. */
  setFollow(userId: string, want: boolean, targetVisibility: Visibility): Promise<FollowStatus | null>;
  respondFollower(userId: string, accept: boolean): Promise<void>;
  togglePersonaFollow(personaId: string): Promise<boolean>;
  updateProfile(p: UserData['profile']): Promise<void>;
  setIntroSeen(): Promise<void>;
  setBrandTip(itemId: string, brand: string): Promise<void>;
  /** attach a real photo (data URI) to a subject for this user; null removes it */
  setPhoto(subjectId: string, dataUri: string | null): Promise<void>;
  /** official link for a subject that lacks one */
  setLink(subjectId: string, url: string): Promise<void>;
  /** "Ekle": a piece that is not in the catalog yet */
  addItem(item: NewItem): Promise<Item>;
  addList(l: Pick<List, 'title' | 'description' | 'itemIds'>): Promise<List>;
  toggleListItem(listId: string, itemId: string): Promise<void>;
  /** save / unsave someone's list. Returns the new state. */
  toggleSaveList(listId: string): Promise<boolean>;
}

export const emptyUserData = (): UserData => ({
  profile: { name: 'Sen', handle: '@sen', bio: '', visibility: 'followers', signature: [] },
  shelves: [], reviews: [], comments: [], follows: [], followers: [], personaFollows: [], brandTips: {}, photos: {}, links: {}, items: [], lists: [], likedReviews: [], savedLists: [], introSeen: false,
});

const KEY = 'persona.userdata.v3';
const uid = () => Math.random().toString(36).slice(2, 10) + Date.now().toString(36);
export const slug = (s: string) => s.toLowerCase().replace(/ı/g, 'i').replace(/ğ/g, 'g').replace(/ü/g, 'u').replace(/ş/g, 's').replace(/ö/g, 'o').replace(/ç/g, 'c').replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');

/** Works offline: seed data + this device's own shelves, reviews, lists and follows. */
export class LocalRepo implements Repo {
  private me: UserData = emptyUserData();

  private async persist() {
    try { await AsyncStorage.setItem(KEY, JSON.stringify(this.me)); } catch {}
  }

  async load(): Promise<Snapshot> {
    let fresh = true;
    try {
      const raw = await AsyncStorage.getItem(KEY);
      if (raw) { this.me = { ...emptyUserData(), ...JSON.parse(raw) }; fresh = false; }
    } catch {}
    if (fresh) {
      // one pending request waiting for you, so the approval flow is visible from the first open
      this.me.followers = [{ followerId: 'selin', followeeId: ME_ID, status: 'pending' }];
    }
    if (!this.me.profile.signature) this.me.profile.signature = [];
    if (!this.me.savedLists) this.me.savedLists = [];
    return {
      brands: BRANDS, items: ITEMS, shows: SHOWS, styles: STYLES, lists: LISTS, personas: PERSONAS, scenes: SCENES, users: USERS,
      shelves: SHELVES, reviews: REVIEWS, comments: COMMENTS, follows: FOLLOWS, personaFollows: PERSONA_FOLLOWS,
      me: this.me, meId: ME_ID,
    };
  }

  async setShelf(itemId: string, shelf: Shelf | null, patch: ShelfPatch = {}) {
    const prev = this.me.shelves.find((s) => s.itemId === itemId);
    this.me.shelves = this.me.shelves.filter((s) => s.itemId !== itemId);
    if (shelf) this.me.shelves.unshift({ userId: ME_ID, itemId, shelf, createdAt: Date.now(), store: prev?.store, priceText: prev?.priceText, url: prev?.url, hidden: prev?.hidden, ...patch });
    await this.persist();
  }

  async patchShelf(itemId: string, patch: ShelfPatch) {
    this.me.shelves = this.me.shelves.map((s) => (s.itemId === itemId ? { ...s, ...patch } : s));
    await this.persist();
  }

  async addReview(r: Omit<Review, 'id' | 'userId' | 'createdAt'>) {
    const review: Review = { ...r, id: uid(), userId: ME_ID, createdAt: Date.now() };
    this.me.reviews = this.me.reviews.filter((x) => !(x.targetType === r.targetType && x.targetId === r.targetId));
    this.me.reviews.unshift(review);
    await this.persist();
    return review;
  }

  async deleteReview(id: string) {
    this.me.reviews = this.me.reviews.filter((x) => x.id !== id);
    this.me.comments = this.me.comments.filter((c) => c.reviewId !== id);
    await this.persist();
  }

  async addComment(reviewId: string, body: string) {
    const c: Comment = { id: uid(), reviewId, userId: ME_ID, body, createdAt: Date.now() };
    this.me.comments.push(c);
    await this.persist();
    return c;
  }

  async toggleLike(reviewId: string) {
    const on = this.me.likedReviews.includes(reviewId);
    this.me.likedReviews = on ? this.me.likedReviews.filter((x) => x !== reviewId) : [...this.me.likedReviews, reviewId];
    await this.persist();
    return !on;
  }

  async setFollow(userId: string, want: boolean, targetVisibility: Visibility) {
    this.me.follows = this.me.follows.filter((f) => f.followeeId !== userId);
    let status: FollowStatus | null = null;
    if (want) {
      status = targetVisibility === 'public' ? 'accepted' : 'pending';
      this.me.follows.push({ followerId: ME_ID, followeeId: userId, status });
    }
    await this.persist();
    return status;
  }

  /** demo only: the example person approves a pending request */
  async acceptPending(userId: string) {
    this.me.follows = this.me.follows.map((f) => (f.followeeId === userId ? { ...f, status: 'accepted' } : f));
    await this.persist();
  }

  async respondFollower(userId: string, accept: boolean) {
    this.me.followers = accept
      ? this.me.followers.map((f) => (f.followerId === userId ? { ...f, status: 'accepted' } : f))
      : this.me.followers.filter((f) => f.followerId !== userId);
    await this.persist();
  }

  async togglePersonaFollow(personaId: string) {
    const on = this.me.personaFollows.includes(personaId);
    this.me.personaFollows = on ? this.me.personaFollows.filter((x) => x !== personaId) : [...this.me.personaFollows, personaId];
    await this.persist();
    return !on;
  }

  async updateProfile(p: UserData['profile']) { this.me.profile = p; await this.persist(); }
  async setIntroSeen() { this.me.introSeen = true; await this.persist(); }
  async setBrandTip(itemId: string, brand: string) {
    if (brand) this.me.brandTips[itemId] = brand; else delete this.me.brandTips[itemId];
    await this.persist();
  }
  async setPhoto(id: string, dataUri: string | null) {
    this.me.photos = { ...(this.me.photos ?? {}) };
    if (dataUri) this.me.photos[id] = dataUri; else delete this.me.photos[id];
    await this.persist();
  }
  async setLink(id: string, url: string) {
    this.me.links = { ...(this.me.links ?? {}) };
    if (url) this.me.links[id] = url; else delete this.me.links[id];
    await this.persist();
  }
  async addItem(n: NewItem) {
    const item: Item = { ...n, id: 'u-' + slug(n.name).slice(0, 24) + '-' + uid().slice(0, 4), ownedCount: 0, verification: 'none', searchQuery: [n.brandName, n.name].filter(Boolean).join(' '), addedBy: ME_ID };
    this.me.items = [item, ...this.me.items];
    await this.persist();
    return item;
  }
  async addList(l: Pick<List, 'title' | 'description' | 'itemIds'>) {
    const list: List = { ...l, id: 'ul-' + uid(), authorId: ME_ID, saves: 0, createdAt: Date.now() };
    this.me.lists = [list, ...this.me.lists];
    await this.persist();
    return list;
  }
  async toggleListItem(listId: string, itemId: string) {
    this.me.lists = this.me.lists.map((l) => (l.id === listId ? { ...l, itemIds: l.itemIds.includes(itemId) ? l.itemIds.filter((x) => x !== itemId) : [...l.itemIds, itemId] } : l));
    await this.persist();
  }
  async toggleSaveList(listId: string) {
    const on = this.me.savedLists.includes(listId);
    this.me.savedLists = on ? this.me.savedLists.filter((x) => x !== listId) : [...this.me.savedLists, listId];
    await this.persist();
    return !on;
  }
}

export const BRAND_STATUS_LABEL: Record<BrandStatus, string> = { loyal: 'Sadığım', sometimes: 'Ara sıra', left: 'Koptum' };
export const VISIBILITY_LABEL: Record<Visibility, string> = { public: 'Herkese açık', followers: 'Takipçilerime', private: 'Gizli' };
export const VISIBILITY_HELP: Record<Visibility, string> = {
  public: 'Dolabın, nereden aldıkların ve yorumların herkese görünür.',
  followers: 'Yalnızca onayladığın takipçiler görür. Takip istekleri sana gelir.',
  private: 'Kimse görmez. Yorumların yine de herkese açık kalır.',
};
export const KIND_LABEL: Record<SubjectKind, string> = { item: 'Parça', brand: 'Marka', show: 'Defile', style: 'Stil', list: 'Liste' };
export const KIND_ROUTE: Record<SubjectKind, string> = { item: '/item/', brand: '/marka/', show: '/defile/', style: '/stil/', list: '/liste/' };
