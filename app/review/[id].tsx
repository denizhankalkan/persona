import React, { useState } from 'react';
import { Pressable, View } from 'react-native';
import { Stack, useLocalSearchParams, useRouter } from 'expo-router';
import { Screen } from '@/components/Screen';
import { Avatar, Body, Button, Chip, Display, Eyebrow, Field, LinkText, Section, Small, Stars, Tag } from '@/components/ui';
import { timeAgo } from '@/components/cards';
import { KIND_LABEL } from '@/data/repo';
import { useStore } from '@/store';
import { useTheme } from '@/theme';

/** One review and the conversation under it. Likes, no voting. */
export default function ReviewScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { c } = useTheme();
  const { review, userName, user, commentsFor, addComment, deleteReview, meId, subjectName, subjectSub, subjectRoute, likesOf, liked, toggleLike } = useStore();
  const router = useRouter();
  const [text, setText] = useState('');
  const r = review(String(id));
  if (!r) return <Screen><Small>Yorum bulunamadı.</Small></Screen>;
  const subject = { kind: r.targetType, id: r.targetId };
  const comments = commentsFor(r.id);
  const u = user(r.userId);
  const likes = likesOf(r.id);
  const on = liked(r.id);
  const send = async () => { const t = text.trim(); if (!t) return; setText(''); await addComment(r.id, t); };
  return (
    <>
      <Stack.Screen options={{ title: 'Tartışma' }} />
      <Screen>
        <Pressable onPress={() => router.push(subjectRoute(subject) as any)} style={{ flexDirection: 'row', alignItems: 'center', gap: 10, borderWidth: 1, borderColor: c.line, padding: 10 }}>
          <View style={{ flex: 1 }}>
            <Eyebrow color={c.accent}>{KIND_LABEL[r.targetType]}</Eyebrow>
            <Body weight="semi">{subjectName(subject)}</Body>
            <Small>{subjectSub(subject)}</Small>
          </View>
          <LinkText label="→" />
        </Pressable>
        <View style={{ gap: 10, borderBottomWidth: 1, borderBottomColor: c.rule, paddingBottom: 14 }}>
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8, flexWrap: 'wrap' }}>
            <Avatar name={r.userId === meId ? 'S' : u?.name ?? '?'} size={30} accent={r.userId === meId} />
            <Body weight="semi">{userName(r.userId)}</Body>
            {r.rating > 0 ? <Stars value={r.rating} size={15} /> : null}
            {r.brandStatus ? <Tag label={{ loyal: 'Sadığım', sometimes: 'Ara sıra', left: 'Koptum' }[r.brandStatus]} tone="ink" /> : null}
            <Small style={{ marginLeft: 'auto' }}>{timeAgo(r.createdAt)}</Small>
          </View>
          <Display size="md" style={{ lineHeight: 30, fontFamily: 'BodoniModa_400Regular' }}>{r.body}</Display>
          <View style={{ flexDirection: 'row', gap: 8, alignItems: 'center' }}>
            <Chip label={`${on ? '♥' : '♡'} ${likes}`} on={on} tone="green" onPress={() => toggleLike(r.id)} />
            <Chip label="Paylaş" />
            {r.userId === meId ? <Chip label="Sil" onPress={async () => { await deleteReview(r.id); router.back(); }} /> : null}
            <Small style={{ marginLeft: 'auto' }}>{comments.length} yanıt</Small>
          </View>
        </View>
        <Section title="Tartışma" kicker>
          <View style={{ gap: 12 }}>
            {comments.length ? comments.map((cm) => (
              <View key={cm.id} style={{ flexDirection: 'row', gap: 10, alignItems: 'flex-start' }}>
                <Avatar name={cm.userId === meId ? 'S' : user(cm.userId)?.name ?? '?'} size={28} accent={cm.userId === meId} />
                <View style={{ flex: 1, borderBottomWidth: 1, borderBottomColor: c.line, paddingBottom: 10, gap: 2 }}>
                  <View style={{ flexDirection: 'row', gap: 8, alignItems: 'baseline' }}><Body weight="semi" style={{ fontSize: 14 }}>{userName(cm.userId)}</Body><Small>{timeAgo(cm.createdAt)}</Small></View>
                  <Body style={{ fontSize: 14 }}>{cm.body}</Body>
                </View>
              </View>
            )) : <Small>Henüz yanıt yok. İlk sen yaz.</Small>}
          </View>
          <View style={{ gap: 8 }}>
            <Field multiline value={text} onChangeText={setText} maxLength={300} placeholder="Katıl: aynı fikirde misin, değil misin, neden?" />
            <Button variant="dark" label="Yanıtla" disabled={!text.trim()} onPress={send} />
          </View>
        </Section>
      </Screen>
    </>
  );
}
