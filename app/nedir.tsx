import React from 'react';
import { View } from 'react-native';
import { useRouter } from 'expo-router';
import { Screen } from '@/components/Screen';
import { Body, Button, Chip, Display, Divider, Eyebrow, Masthead } from '@/components/ui';
import { useStore } from '@/store';
import { useTheme } from '@/theme';

const BEATS = [
  ['Kaydet', 'Giydiğine “bende” de.', 'Parça, nereden aldın, kaça. Fotoğraf çekmek yok; resmi ürün linki yeter. İzin verdiğin kadar görünür.'],
  ['Puanla', 'Modele ve koleksiyona yıldız.', 'Letterboxd’da film ne ise bizde model o: Sézane’ın trençkotu, Chanel’in son koleksiyonu. Marka ve stil sayfaları parçalardan hesaplanır, tartışılır.'],
  ['Takip et', 'O kadın ne alıyor?', 'Dizi karakteri, herkese açık persona ya da takip ettiğin biri: dolabı, nereden aldığı, ne düşündüğü. Kıyas yok, algoritma yok.'],
  ['Konuş', 'Beğendin. Kimle konuşacaksın?', 'Her yorumun altında tartışma. Konuşma bir parçaya, markaya ya da listeye bağlıdır; kaybolmaz, aranır.'],
];

export default function IntroScreen() {
  const { c } = useTheme();
  const { setIntroSeen } = useStore();
  const router = useRouter();
  const go = async (to: string) => { await setIntroSeen(); router.replace(to as any); };
  return (
    <Screen>
      <View style={{ gap: 14 }}>
        <Masthead size={28} />
        <Divider strong />
        <Display size="xxl">Modanın Letterboxd’u.</Display>
        <Body>Kitap için Goodreads, film için Letterboxd vardı. Moda konuşmak için Instagram ve forumlar kalmıştı. Persona: giydiğini kaydet, puanla, yaz; takip ettiklerin ne giyiyor, nereden alıyor, gör.</Body>
      </View>
      <View>
        {BEATS.map(([e, t, b], i) => (
          <View key={e} style={{ gap: 4, paddingVertical: 14, borderTopWidth: 1, borderTopColor: i ? c.line : c.rule }}>
            <Eyebrow color={c.accent}>{e}</Eyebrow>
            <Display size="md">{t}</Display>
            <Body muted>{b}</Body>
          </View>
        ))}
      </View>
      <Button label="Hande’nin dolabıyla başla" right="1 dakika" onPress={() => go('/liste/dolap-hande')} />
      <View style={{ alignItems: 'center' }}><Chip label="Önce bir bakayım" onPress={() => go('/(tabs)/kesfet')} /></View>
    </Screen>
  );
}
