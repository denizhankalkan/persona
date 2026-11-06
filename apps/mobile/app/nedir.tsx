import React from 'react';
import { View } from 'react-native';
import { useRouter } from 'expo-router';
import { Screen } from '@/components/Screen';
import { Body, Button, Chip, Display, Eyebrow, Masthead } from '@/components/ui';
import { useStore } from '@/store';
import { useTheme } from '@/theme';
import { useT } from '@/i18n';

const BEATS: [string, string, string][] = [
  ['Vitrine koy', 'Aldığını göster.', 'Parça, nereden aldın, kaça. Fotoğraf çekmek yok; resmi ürün linki yeter. İzin verdiğin kadar görünür.'],
  ['Puanla', 'Modele ve koleksiyona yıldız.', 'Letterboxd’da film ne ise bizde model o: Sézane’ın trençkotu, Chanel’in son koleksiyonu. Marka ve stil sayfaları parçalardan hesaplanır, tartışılır.'],
  ['Takip et ', 'O kadın ne alıyor?', 'Dizi karakteri, herkese açık persona ya da takip ettiğin biri: dolabı, nereden aldığı, ne düşündüğü. Kıyas yok, algoritma yok.'],
  ['Konuş', 'Beğendin. Kimle konuşacaksın?', 'Her yorumun altında tartışma. Konuşma bir parçaya, markaya ya da listeye bağlıdır; kaybolmaz, aranır.'],
];

export default function IntroScreen() {
  const { c } = useTheme();
  const { setIntroSeen } = useStore();
  const { t } = useT();
  const router = useRouter();
  const go = async (to: string) => { await setIntroSeen(); router.replace(to as any); };
  return (
    <Screen>
      <Masthead size={28} />
      <View style={{ gap: 14 }}>
        <Display size="xxl">{t('Modanın Letterboxd’u.')}</Display>
        <Body>{t('Kitap için Goodreads, film için Letterboxd vardı. Moda konuşmak için Instagram ve forumlar kalmıştı. Persona: giydiğini vitrine koy, puanla, yaz; takip ettiklerin ne giyiyor, nereden alıyor, gör.')}</Body>
      </View>
      <View>
        {BEATS.map(([e, tt, b], i) => (
          <View key={e} style={{ gap: 4, paddingVertical: 14, borderTopWidth: 1, borderTopColor: i ? c.line : c.rule }}>
            <Eyebrow color={c.accent}>{t(e)}</Eyebrow>
            <Display size="md">{t(tt)}</Display>
            <Body muted>{t(b)}</Body>
          </View>
        ))}
      </View>
      <Button label={t('Hande’nin dolabıyla başla')} right={t('1 dakika')} onPress={() => go('/liste/dolap-hande')} />
      <View style={{ alignItems: 'center' }}><Chip label={t('Önce bir bakayım')} onPress={() => go('/(tabs)/kesfet')} /></View>
    </Screen>
  );
}
