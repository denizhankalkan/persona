export type ItemType = 'clothing' | 'perfume' | 'product';
export type Verification = 'ok' | 'guess' | 'none';
/** showcase = "vitrine ekle" (I bought it, I show it; "nereden aldım" lives here) · saved = "kaydet" (favorites) */
export type Shelf = 'showcase' | 'saved';
export type BrandStatus = 'loyal' | 'sometimes' | 'left';

/**
 * Letterboxd's film is our model. Stars go to two works only: a piece (a specific model,
 * "Sézane Clyde trençkot") and a collection (a show, "Chanel İlkbahar/Yaz 2026").
 * Brand, style and list pages exist and are discussed, but their score is computed from
 * the pieces; a person is never a subject.
 */
export type SubjectKind = 'item' | 'brand' | 'show' | 'style' | 'list';
export const STARRED: SubjectKind[] = ['item', 'show'];

export interface Brand {
  id: string;
  name: string;
  origin: string;
  /** community score snapshot, 1–5 */
  scores: { quality: number; fit: number; fabric: number; price: number };
  /** share of reviewers who marked "left" */
  leftPct: number;
  reviewCount: number;
  /** official site; the logo/share image is read from it */
  url?: string;
  styleIds?: string[];
}

export interface Item {
  id: string;
  type: ItemType;
  name: string;
  category: string;
  brandName?: string;
  brandId?: string;
  color: string;
  priceText?: string;
  year?: string;
  verification: Verification;
  note?: string;
  notes?: string;
  searchQuery: string;
  /** community count snapshot: how many showcases hold it */
  ownedCount: number;
  /** official product page; the photo is read from it */
  url?: string;
  /** direct photo URL when known */
  imageUrl?: string;
  styleIds?: string[];
  /** added by a user through "Ekle" (not in the editorial catalog) */
  addedBy?: string;
}

/** A runway or presentation: brand × season. Has a single identity, like a film. */
export interface Show {
  id: string;
  brandId?: string;
  brandName: string;
  /** "İlkbahar/Yaz 2026" */
  season: string;
  city: string;
  /** "Ekim 2025" */
  when: string;
  designer?: string;
  /** one line for the card */
  tagline?: string;
  note?: string;
  /** official show page or brand runway page; the photo is read from it */
  url?: string;
  imageUrl?: string;
  /** number of looks in the show, when known */
  lookCount?: number;
  reviewCount: number;
  avg: number;
  styleIds?: string[];
}

/** A way of dressing — boho, western, quiet luxury — reviewed like a genre. */
export interface Style {
  id: string;
  name: string;
  aka?: string;
  summary: string;
  /** signature pieces, in words */
  keyPieces: string[];
  era?: string;
  itemIds: string[];
  brandIds: string[];
  reviewCount: number;
  avg: number;
  imageUrl?: string;
  url?: string;
}

/**
 * Letterboxd's list: a titled set of pieces with notes. Character wardrobes and public
 * personas live here as editor lists; users make their own.
 */
export interface List {
  id: string;
  title: string;
  /** user id, or 'editor' for Persona's own lists */
  authorId: string;
  description?: string;
  itemIds: string[];
  /** note per piece ("1. bölüm, kafede") */
  notes?: Record<string, string>;
  /** when the list is a wardrobe of a character / public person */
  personaId?: string;
  saves: number;
  createdAt: number;
}

export interface Persona {
  id: string;
  kind: 'character' | 'person';
  name: string;
  shortName: string;
  handle?: string;
  followers?: string;
  source: string;
  bio: string;
  tags: string[];
  colors: [string, string];
  itemIds: string[];
  /** where a public person says they bought each item (what they chose to share) */
  purchases?: Record<string, Purchase>;
  isExample?: boolean;
  styleIds?: string[];
}

export interface Scene {
  id: string;
  personaId: string;
  episode: string;
  title: string;
  where: string;
  itemIds: string[];
}

export interface User {
  id: string;
  name: string;
  handle: string;
  bio?: string;
  visibility: Visibility;
  isExample?: boolean;
  /** up to 4 signature pieces (Letterboxd's four favourites) */
  signature?: string[];
}

export type Visibility = 'public' | 'followers' | 'private';
export type FollowStatus = 'pending' | 'accepted';

export interface ShelfEntry {
  userId: string;
  itemId: string;
  shelf: Shelf;
  createdAt: number;
  /** where it was bought — the thing people usually hide */
  store?: string;
  priceText?: string;
  url?: string;
  /** hidden from everyone but the owner */
  hidden?: boolean;
}

export interface Purchase {
  store: string;
  priceText?: string;
  url?: string;
}

export interface Review {
  id: string;
  userId: string;
  targetType: SubjectKind;
  targetId: string;
  /** 1–5 for a model or a collection; 0 = a discussion post on a brand, style or list (those are not starred) */
  rating: number;
  body: string;
  brandStatus?: BrandStatus;
  tags?: string[];
  createdAt: number;
  /** likes snapshot (others'); yours are in UserData.likedReviews */
  likes?: number;
}

export interface Comment {
  id: string;
  reviewId: string;
  userId: string;
  body: string;
  createdAt: number;
}

export interface Follow {
  followerId: string;
  followeeId: string;
  status: FollowStatus;
}

export interface PersonaFollow {
  userId: string;
  personaId: string;
}

export type Activity =
  | { id: string; kind: 'shelf'; userId: string; itemId: string; shelf: Shelf; createdAt: number }
  | { id: string; kind: 'review'; userId: string; reviewId: string; createdAt: number }
  | { id: string; kind: 'comment'; userId: string; commentId: string; createdAt: number }
  | { id: string; kind: 'list'; userId: string; listId: string; createdAt: number }
  | { id: string; kind: 'persona'; userId: string; personaId: string; createdAt: number };

export interface UserData {
  profile: { name: string; handle: string; bio: string; visibility: Visibility; signature: string[] };
  shelves: ShelfEntry[];
  reviews: Review[];
  comments: Comment[];
  /** people I follow, with request status */
  follows: Follow[];
  /** people who asked to follow me (pending) or follow me (accepted) */
  followers: Follow[];
  personaFollows: string[];
  brandTips: Record<string, string>;
  /** photos the user attached (data URIs locally; Storage URLs with Supabase) */
  photos?: Record<string, string>;
  /** official links the user added for subjects that lack one */
  links?: Record<string, string>;
  /** pieces the user added to the catalog through "Ekle" */
  items: Item[];
  /** the user's own lists */
  lists: List[];
  likedReviews: string[];
  /** lists the user saved (Letterboxd's like on a list) */
  savedLists: string[];
  /** runway frames the user added per show (data URIs locally; Storage URLs with Supabase), in look order */
  looks?: Record<string, string[]>;
  /** UI language override; undefined = device language */
  lang?: 'tr' | 'en' | 'fr' | 'ru';
  /** series/character suggestions typed in Ekranda (local, until a backend inbox exists) */
  suggestions?: string[];
  introSeen: boolean;
}
