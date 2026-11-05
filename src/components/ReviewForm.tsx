import React, { useState } from 'react';
import { View } from 'react-native';
import { Button, Chip, Eyebrow, Field, StarPicker } from './ui';
import { useStore, type SubjectRef } from '@/store';
import { BRAND_STATUS_LABEL } from '@/data/repo';
import type { BrandStatus } from '@/data/types';

const PLACEHOLDER: Record<SubjectRef['kind'], string> = {
  item: 'İki satır yeter: nasıl oturdu, nerede giydin, tekrar alır mıydın?',
  brand: 'Kalıp, kumaş, fiyat. Neden sadıksın ya da neden koptun?',
  show: 'Koleksiyon ne söyledi? Giyer miydin? Önceki sezona göre?',
  style: 'Bu stil kime, ne zaman iyi? Trend mi, kalıcı mı?',
  list: 'Liste işe yarıyor mu, eksik ne, hangi parça fazla?',
};

/** Goodreads-style: stars + a couple of lines. Discussion happens under the review. */
export function ReviewForm({ subject, onDone }: { subject: SubjectRef; onDone?: () => void }) {
  const { addReview } = useStore();
  const [rating, setRating] = useState(0);
  const [body, setBody] = useState('');
  const [status, setStatus] = useState<BrandStatus | undefined>();
  const [busy, setBusy] = useState(false);
  const ok = rating > 0 && body.trim().length > 3;
  const submit = async () => {
    if (!ok || busy) return;
    setBusy(true);
    await addReview({ targetType: subject.kind, targetId: subject.id, rating, body: body.trim(), brandStatus: subject.kind === 'brand' ? status : undefined });
    setBusy(false); setRating(0); setBody(''); onDone?.();
  };
  return (
    <View style={{ gap: 10 }}>
      <Eyebrow>Sen ne düşünüyorsun?</Eyebrow>
      <StarPicker value={rating} onChange={setRating} />
      {subject.kind === 'brand' ? (
        <View style={{ flexDirection: 'row', gap: 6 }}>
          {(Object.keys(BRAND_STATUS_LABEL) as BrandStatus[]).map((s) => <Chip key={s} label={BRAND_STATUS_LABEL[s]} on={status === s} onPress={() => setStatus(status === s ? undefined : s)} />)}
        </View>
      ) : null}
      <Field multiline value={body} onChangeText={setBody} maxLength={600} placeholder={PLACEHOLDER[subject.kind]} />
      <Button variant="dark" label={busy ? 'Kaydediliyor…' : 'Yorumu kaydet'} disabled={!ok || busy} onPress={submit} />
    </View>
  );
}
