import React from 'react';
import { View } from 'react-native';
import { ReviewForm } from './ReviewForm';
import { ReviewList, fmt } from './cards';
import { RatingBars, Section, Small, Stars } from './ui';
import { useStore, type SubjectRef } from '@/store';
import { useT } from '@/i18n';

/** The one review block every reviewable page shares: average, distribution, reviews, your form. */
export function RatingLine({ subject, size = 15 }: { subject: SubjectRef; size?: number }) {
  const { rating } = useStore();
  const { t } = useT();
  const r = rating(subject);
  const computed = subject.kind === 'brand' || subject.kind === 'style';
  if (!r.n) return <Small>{t('Henüz puan yok.')}</Small>;
  return (
    <View style={{ flexDirection: 'row', alignItems: 'flex-end', gap: 10, flexWrap: 'wrap' }}>
      <Stars value={r.avg} size={size} />
      <Small muted={false} weight="semi">{r.avg.toFixed(1)}</Small>
      <Small>{t('{n} görüş', { n: fmt(r.n) })}{computed ? ' · ' + t('parçalarından hesaplandı') : ''}</Small>
      {!computed ? <RatingBars dist={r.dist} height={size + 4} /> : null}
    </View>
  );
}

export function Reviews({ subject, title = 'Yorumlar', hint = 'önce takip ettiklerin' }: { subject: SubjectRef; title?: string; hint?: string }) {
  const { reviewsFor, myReviewFor } = useStore();
  const { t } = useT();
  const reviews = reviewsFor(subject);
  const mine = myReviewFor(subject);
  return (
    <Section title={t(title)} right={<Small>{reviews.length ? `${reviews.length} · ${t(hint)}` : t(hint)}</Small>}>
      <View style={{ gap: 18 }}>
        <ReviewList reviews={reviews} />
        {mine ? <Small>{t('Yorumunu yazdın; tartışmak için üstüne dokun.')}</Small> : <ReviewForm subject={subject} />}
      </View>
    </Section>
  );
}
