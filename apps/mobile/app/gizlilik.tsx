import React from 'react';
import { View } from 'react-native';
import { Stack } from 'expo-router';
import { Screen } from '@/components/Screen';
import { Body, Card, Display, Eyebrow, Small } from '@/components/ui';

const SECTIONS: [string, string][] = [
  ['Ne topluyoruz', 'Hesap için e-posta adresin. Uygulamada kendin yazdıkların: raflarına eklediğin parçalar, nereden aldığın bilgisi, yorumların, yanıtların, takip ettiklerin ve profil bilgilerin (ad, kullanıcı adı, kısa açıklama). Fotoğraf, konum, rehber, reklam kimliği toplanmaz.'],
  ['Kim görür', 'Yorumların ve yanıtların herkese açıktır. Dolabın ve nereden aldıkların, seçtiğin görünürlüğe göre görünür: herkese açık, yalnızca onayladığın takipçilere ya da hiç kimseye. Tek tek parçaları da gizleyebilirsin. Varsayılan ayar “takipçilerime”dir.'],
  ['Ne yapmıyoruz', 'Verilerini satmıyoruz, reklam için kullanmıyoruz, üçüncü taraflara aktarmıyoruz. Mağaza bağlantılarına dokunduğunda o mağazanın sitesine gidersin; orada o sitenin kuralları geçerlidir.'],
  ['Nerede tutuluyor', 'Veriler Supabase altyapısında, Avrupa Birliği içindeki sunucularda, şifreli bağlantıyla tutulur. Hesabın yokken veriler yalnızca cihazında kalır.'],
  ['Silme', 'Hesabını silmek istediğinde uygulama içinden ya da e-postayla talep edersin; hesabın ve tüm içeriğin 30 gün içinde kalıcı olarak silinir. Tek tek yorum, parça ve nereden aldığın bilgisini istediğin an kendin silersin.'],
  ['Yaş', 'Uygulama 13 yaş ve üzeri içindir.'],
  ['İletişim', 'Sorular için: destek@persona.app (yayın öncesi güncellenecek).'],
];

export default function PrivacyScreen() {
  return (
    <>
      <Stack.Screen options={{ title: 'Gizlilik' }} />
      <Screen>
        <View style={{ gap: 4 }}>
          <Eyebrow>Gizlilik politikası</Eyebrow>
          <Display size="xl">Ne aldığını sen anlatırsın; biz saklarız.</Display>
          <Small>Son güncelleme: 4 Kasım 2026</Small>
        </View>
        {SECTIONS.map(([t, b]) => (
          <Card key={t} style={{ gap: 6 }}>
            <Display size="sm">{t}</Display>
            <Body muted>{b}</Body>
          </Card>
        ))}
      </Screen>
    </>
  );
}
