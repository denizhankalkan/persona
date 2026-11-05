import React, { useState } from 'react';
import { Pressable, View } from 'react-native';
import { useRouter } from 'expo-router';
import { Screen } from '@/components/Screen';
import { Avatar, Body, Button, Card, Chip, Display, Divider, Eyebrow, Field, LinkText, Masthead, Section, Small, Tag } from '@/components/ui';
import { ItemGrid, ItemRow, ListCard, PersonRow, ReviewList } from '@/components/cards';
import { ProductImage } from '@/components/ProductImage';
import { VISIBILITY_HELP, VISIBILITY_LABEL } from '@/data/repo';
import type { Item, Visibility } from '@/data/types';
import { useStore } from '@/store';
import { useTheme } from '@/theme';
import { supabaseEnabled } from '@/data/supabase';

export default function WardrobeScreen() {
  const { c, f } = useTheme();
  const { me, snap, item, meId, following, updateProfile, reviewsBy, isFollowingPersona, pendingRequests, respondFollower, storesOf, signatureOf, setSignature } = useStore();
  const router = useRouter();
  const [tab, setTab] = useState<'owned' | 'want' | 'lists' | 'reviews'>('owned');
  const [editing, setEditing] = useState(false);
  const [pickingSig, setPickingSig] = useState(false);
  const [name, setName] = useState(me.profile.name);
  const [handle, setHandle] = useState(me.profile.handle);
  const [bio, setBio] = useState(me.profile.bio);
  const [vis, setVis] = useState<Visibility>(me.profile.visibility);
  const entries = me.shelves.filter((s) => s.shelf === (tab === 'want' ? 'want' : 'owned')).map((s) => item(s.itemId)).filter(Boolean) as Item[];
  const clothing = entries.filter((i) => i.type === 'clothing');
  const other = entries.filter((i) => i.type !== 'clothing');
  const owned = me.shelves.filter((s) => s.shelf === 'owned').length;
  const want = me.shelves.filter((s) => s.shelf === 'want').length;
  const hidden = me.shelves.filter((s) => s.hidden).length;
  const myReviews = reviewsBy(meId);
  const personas = snap.personas.filter((p) => isFollowingPersona(p.id));
  const fol = following();
  const requests = pendingRequests();
  const stores = storesOf(meId);
  const withoutStore = me.shelves.filter((s) => s.shelf === 'owned' && !s.store).length;
  const sig = signatureOf(meId);
  const ownedItems = me.shelves.filter((s) => s.shelf === 'owned').map((s) => item(s.itemId)).filter(Boolean) as Item[];
  const toggleSig = (id: string) => {
    const cur = me.profile.signature ?? [];
    setSignature(cur.includes(id) ? cur.filter((x) => x !== id) : cur.length >= 4 ? [...cur.slice(1), id] : [...cur, id]);
  };
  const Stat = ({ n, label }: { n: number; label: string }) => (
    <View style={{ flex: 1, alignItems: 'center', gap: 2 }}>
      <Display size="md">{n}</Display>
      <Eyebrow>{label}</Eyebrow>
    </View>
  );
  return (
    <Screen tabbed>
      <View style={{ gap: 14 }}>
        <Masthead />
        <Divider strong />
        <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
          <Display size="lg">Dolabım</Display>
          <Pressable onPress={() => setEditing((e) => !e)}><Tag label={editing ? 'Vazgeç' : VISIBILITY_LABEL[me.profile.visibility]} tone="gold" /></Pressable>
        </View>
      </View>

      <View style={{ flexDirection: 'row', alignItems: 'center', gap: 12 }}>
        <Avatar name={me.profile.name === 'Sen' ? 'S' : me.profile.name} size={48} accent />
        <View style={{ flex: 1, gap: 1 }}>
          <Display size="md">{me.profile.name === 'Sen' ? 'Senin dolabın' : me.profile.name}</Display>
          <Small>{me.profile.handle}{me.profile.bio ? ' · ' + me.profile.bio : ''}{hidden ? ` · ${hidden} parça gizli` : ''}</Small>
        </View>
        <LinkText label="Düzenle" onPress={() => setEditing((e) => !e)} />
      </View>

      {editing ? (
        <Card style={{ gap: 12 }}>
          <Field value={name} onChangeText={setName} placeholder="Adın" />
          <Field value={handle} onChangeText={setHandle} placeholder="@kullanıcıadı" autoCapitalize="none" />
          <Field value={bio} onChangeText={setBio} placeholder="Bir satır: Kadıköy, Zara’dan koptum…" />
          <View style={{ gap: 6 }}>
            <Eyebrow>Dolabımı kim görsün?</Eyebrow>
            <View style={{ flexDirection: 'row', gap: 8, flexWrap: 'wrap' }}>
              {(Object.keys(VISIBILITY_LABEL) as Visibility[]).map((v) => <Chip key={v} label={VISIBILITY_LABEL[v]} on={vis === v} tone={v === 'private' ? 'ink' : 'green'} onPress={() => setVis(v)} />)}
            </View>
            <Small>{VISIBILITY_HELP[vis]}</Small>
          </View>
          <Button variant="dark" label="Kaydet" onPress={async () => { await updateProfile({ ...me.profile, name: name.trim() || 'Sen', handle: handle.trim().startsWith('@') ? handle.trim() : '@' + handle.trim(), bio: bio.trim(), visibility: vis }); setEditing(false); }} />
          <View style={{ flexDirection: 'row', gap: 16 }}>
            <LinkText label="Gizlilik politikası →" onPress={() => router.push('/gizlilik')} />
            {supabaseEnabled ? <LinkText label="Hesap →" onPress={() => router.push('/giris')} /> : null}
          </View>
        </Card>
      ) : null}

      <View style={{ flexDirection: 'row', borderTopWidth: 1, borderBottomWidth: 1, borderColor: c.line, paddingVertical: 12 }}>
        <Stat n={owned} label="Bende" /><Stat n={want} label="İstiyorum" /><Stat n={myReviews.length} label="Yorum" /><Stat n={me.lists.length} label="Liste" />
      </View>

      {requests.length ? (
        <Section title="Takip istekleri" right={<Small>{requests.length}</Small>}>
          {requests.map((u) => (
            <View key={u.id} style={{ flexDirection: 'row', alignItems: 'center', gap: 12, borderWidth: 1, borderColor: c.accent, padding: 12 }}>
              <Avatar name={u.name} />
              <View style={{ flex: 1 }}>
                <Body weight="semi" style={{ fontSize: 14 }}>{u.name} <Small>{u.handle}</Small></Body>
                <Small>Dolabını ve nereden aldıklarını görmek istiyor.</Small>
              </View>
              <Chip label="Onayla" on tone="green" onPress={() => respondFollower(u.id, true)} />
              <Chip label="Reddet" onPress={() => respondFollower(u.id, false)} />
            </View>
          ))}
        </Section>
      ) : null}

      <Section title="İmza parçalarım" kicker right={<LinkText label={pickingSig ? 'Tamam' : sig.length ? 'Değiştir' : 'Seç'} onPress={() => setPickingSig((v) => !v)} />}>
        {pickingSig ? (
          <View style={{ gap: 8 }}>
            <Small>Dördünü seç; “Bende” dediklerinden.</Small>
            <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 6 }}>
              {ownedItems.map((i) => <Chip key={i.id} label={i.name} on={me.profile.signature?.includes(i.id)} tone="green" onPress={() => toggleSig(i.id)} />)}
              {!ownedItems.length ? <Small>Önce bir parçaya “Bende” de.</Small> : null}
            </View>
          </View>
        ) : sig.length ? (
          <View style={{ flexDirection: 'row', gap: 8 }}>
            {sig.map((i) => (
              <Pressable key={i.id} onPress={() => router.push(`/item/${i.id}`)} style={{ flex: 1, gap: 4 }}>
                <ProductImage item={i} ratio={0.8} size={11} />
                <Small numberOfLines={2} style={{ fontSize: 10 }}>{i.name}</Small>
              </Pressable>
            ))}
            {Array.from({ length: 4 - sig.length }).map((_, k) => <View key={k} style={{ flex: 1 }} />)}
          </View>
        ) : (
          <View style={{ flexDirection: 'row', gap: 8 }}>
            {[0, 1, 2, 3].map((k) => <Pressable key={k} onPress={() => setPickingSig(true)} style={{ flex: 1, aspectRatio: 0.8, borderWidth: 1, borderStyle: 'dashed', borderColor: c.line, alignItems: 'center', justifyContent: 'center' }}><Body style={{ fontFamily: f.display, fontSize: 22, color: c.muted }}>+</Body></Pressable>)}
          </View>
        )}
      </Section>

      {owned ? (
        <Section title="Nereden alışveriş yapıyorum" kicker right={withoutStore ? <Small>{withoutStore} parçada yazmadın</Small> : undefined}>
          {stores.length ? (
            <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 6 }}>{stores.map((s) => <Tag key={s.store} label={`${s.store} · ${s.n}`} tone="green" />)}</View>
          ) : <Small>Parçalarına nereden aldığını yazınca burada toplanır. Takip ettiklerin görür; istediğini gizlersin.</Small>}
        </Section>
      ) : null}

      <View style={{ gap: 14 }}>
        <View style={{ flexDirection: 'row', gap: 6, flexWrap: 'wrap' }}>
          <Chip label={`Bende · ${owned}`} on={tab === 'owned'} tone="green" onPress={() => setTab('owned')} />
          <Chip label={`İstiyorum · ${want}`} on={tab === 'want'} onPress={() => setTab('want')} />
          <Chip label="Listelerim" on={tab === 'lists'} onPress={() => setTab('lists')} />
          <Chip label="Yorumlarım" on={tab === 'reviews'} onPress={() => setTab('reviews')} />
        </View>
        {tab === 'lists' ? (
          <View style={{ gap: 16 }}>
            {me.lists.length ? me.lists.map((l) => <ListCard key={l.id} l={l} wide />) : <Small>Henüz liste yapmadın. Bir parçanın sayfasında “Listeye” de.</Small>}
          </View>
        ) : tab === 'reviews' ? (
          <ReviewList reviews={myReviews} showTarget empty="Henüz yorum yazmadın. Bir parçaya, markaya, defileye ya da stile gir." />
        ) : entries.length === 0 ? (
          <Card style={{ alignItems: 'center', gap: 8, paddingVertical: 28 }}>
            <Display size="md" style={{ textAlign: 'center' }}>{tab === 'owned' ? '“Bende” dediğin her şey burada birikir.' : 'İstediklerin burada bekler.'}</Display>
            <Small style={{ textAlign: 'center' }}>Fotoğraf çekmene gerek yok. Bir listeye gir, parçaya dokun; ya da + ile ekle.</Small>
            <Chip label="Hande’nin dolabına git →" tone="green" onPress={() => router.push('/liste/dolap-hande')} />
          </Card>
        ) : (
          <>
            {clothing.length ? <ItemGrid items={clothing} cols={3} /> : null}
            {other.length ? <View>{other.map((i) => <ItemRow key={i.id} item={i} />)}</View> : null}
          </>
        )}
      </View>

      {personas.length ? (
        <Section title="Büründüğün personalar" kicker>
          {personas.map((p) => (
            <Pressable key={p.id} onPress={() => router.push(`/liste/dolap-${p.id}`)} style={{ flexDirection: 'row', alignItems: 'center', gap: 12, borderBottomWidth: 1, borderBottomColor: c.line, paddingVertical: 10 }}>
              <View style={{ flex: 1 }}><Display size="sm">{p.name}</Display><Small>{p.source}</Small></View>
              <LinkText label="Dolabı →" />
            </Pressable>
          ))}
        </Section>
      ) : null}

      <Section title="Takip ettiklerin" kicker right={<LinkText label="Kişi bul →" onPress={() => router.push('/(tabs)/kesfet')} />}>
        {fol.length ? <View>{fol.map((u) => <PersonRow key={u.id} u={u} />)}</View> : <Small>Kimseyi takip etmiyorsun. Takip ettiklerinin dolabını, nereden aldıklarını ve yorumlarını görürsün.</Small>}
      </Section>
    </Screen>
  );
}
