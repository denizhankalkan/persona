import React, { useEffect, useState } from 'react';
import { View } from 'react-native';
import { Stack, useRouter } from 'expo-router';
import { Screen } from '@/components/Screen';
import { Band, Body, Button, Card, Chip, Display, Eyebrow, Field, Small } from '@/components/ui';
import { hasSession, sendMagicLink, signOut, supabaseEnabled, verifyOtp } from '@/data/supabase';
import { useStore } from '@/store';
import { useTheme } from '@/theme';

/** E-posta ile giriş (Supabase magic link + 6 haneli kod). Supabase yapılandırılmamışsa bilgi verir. */
export default function SignInScreen() {
  const { c } = useTheme();
  const { reload, me } = useStore();
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [code, setCode] = useState('');
  const [sent, setSent] = useState(false);
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState('');
  const [signedIn, setSignedIn] = useState(false);
  useEffect(() => { if (supabaseEnabled) hasSession().then(setSignedIn).catch(() => {}); }, []);

  if (!supabaseEnabled) {
    return (
      <>
        <Stack.Screen options={{ title: 'Hesap' }} />
        <Screen>
          <Band>
            <Eyebrow style={{ color: c.inkMuted }}>Hesap</Eyebrow>
            <Display size="xl" style={{ color: c.inkFg }}>Şimdilik bu cihazda.</Display>
            <Body style={{ color: c.inkFg, opacity: 0.8 }}>Dolabın ve yorumların bu telefonda saklanıyor. Arka uç bağlanınca (Supabase anahtarları) buradan e-postayla giriş yapıp her yerden ulaşırsın.</Body>
          </Band>
          <Card style={{ gap: 6 }}>
            <Eyebrow>Geliştirici notu</Eyebrow>
            <Small>.env dosyasına EXPO_PUBLIC_SUPABASE_URL ve EXPO_PUBLIC_SUPABASE_ANON_KEY yazınca bu ekran e-posta ile giriş ekranına dönüşür.</Small>
          </Card>
        </Screen>
      </>
    );
  }

  const send = async () => {
    setBusy(true); setErr('');
    try { await sendMagicLink(email.trim()); setSent(true); } catch (e: any) { setErr(e?.message ?? 'Gönderilemedi'); }
    setBusy(false);
  };
  const verify = async () => {
    setBusy(true); setErr('');
    try { await verifyOtp(email.trim(), code.trim()); await reload(); router.replace('/'); } catch (e: any) { setErr(e?.message ?? 'Kod doğrulanamadı'); }
    setBusy(false);
  };
  return (
    <>
      <Stack.Screen options={{ title: 'Hesap' }} />
      <Screen>
        <Band>
          <Eyebrow style={{ color: c.inkMuted }}>Hesap</Eyebrow>
          <Display size="xl" style={{ color: c.inkFg }}>{signedIn ? me.profile.name : 'E-postanla gir.'}</Display>
          <Body style={{ color: c.inkFg, opacity: 0.8 }}>{signedIn ? me.profile.handle : 'Şifre yok. Sana bir bağlantı ve 6 haneli kod göndeririz.'}</Body>
        </Band>
        {signedIn ? (
          <Card style={{ gap: 10 }}>
            <Body muted>Dolabın, yorumların ve izinlerin hesabına bağlı.</Body>
            <Chip label="Çıkış yap" tone="ink" onPress={async () => { await signOut(); setSignedIn(false); await reload(); }} />
          </Card>
        ) : (
          <Card style={{ gap: 10 }}>
            <Field value={email} onChangeText={setEmail} placeholder="e-posta" autoCapitalize="none" keyboardType="email-address" autoComplete="email" editable={!sent} />
            {sent ? (
              <>
                <Small>Gelen kutuna bak. Bağlantıya dokun ya da koddaki 6 haneyi yaz.</Small>
                <Field value={code} onChangeText={setCode} placeholder="6 haneli kod" keyboardType="number-pad" maxLength={6} />
                <Button variant="dark" label={busy ? 'Doğrulanıyor…' : 'Gir'} disabled={busy || code.trim().length < 6} onPress={verify} />
                <Chip label="E-postayı değiştir" onPress={() => { setSent(false); setCode(''); }} />
              </>
            ) : (
              <Button label={busy ? 'Gönderiliyor…' : 'Bağlantı gönder'} disabled={busy || !/^\S+@\S+\.\S+$/.test(email.trim())} onPress={send} />
            )}
            {err ? <Small style={{ color: c.danger }}>{err}</Small> : null}
            <Small>Girerek <Small weight="semi" muted={false} style={{ color: c.accent }} onPress={() => router.push('/gizlilik')}>gizlilik politikasını</Small> kabul edersin.</Small>
          </Card>
        )}
      </Screen>
    </>
  );
}
