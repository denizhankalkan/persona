import React from 'react';
import { Pressable, StyleSheet, Text, TextInput, View, type PressableProps, type TextInputProps, type TextProps, type ViewProps } from 'react-native';
import { space, useTheme } from '@/theme';
import { TulipMark, TulipTexture } from './Motif';
import { useT } from '@/i18n';

/* ---------- typography ---------- */
export function Display({ size = 'lg', italic, style, ...p }: TextProps & { size?: 'xxl' | 'xl' | 'lg' | 'md' | 'sm'; italic?: boolean }) {
  const { c, f } = useTheme();
  const fs = { xxl: 44, xl: 34, lg: 27, md: 21, sm: 18 }[size];
  return <Text {...p} style={[{ fontFamily: italic ? f.displayItalic : size === 'xxl' || size === 'xl' ? f.displayRegular : f.display, fontSize: fs, lineHeight: fs * 1.06, color: c.fg, letterSpacing: size === 'xxl' ? -0.5 : 0 }, style]} />;
}
export function Body({ muted, weight = 'regular', style, ...p }: TextProps & { muted?: boolean; weight?: 'regular' | 'medium' | 'semi' | 'bold' }) {
  const { c, f } = useTheme();
  const fam = { regular: f.body, medium: f.bodyMedium, semi: f.bodySemi, bold: f.bodyBold }[weight];
  return <Text {...p} style={[{ fontFamily: fam, fontSize: 15, lineHeight: 22, color: muted ? c.muted : c.fg }, style]} />;
}
export function Small({ muted = true, weight = 'regular', style, ...p }: TextProps & { muted?: boolean; weight?: 'regular' | 'medium' | 'semi' | 'bold' }) {
  const { c, f } = useTheme();
  const fam = { regular: f.body, medium: f.bodyMedium, semi: f.bodySemi, bold: f.bodyBold }[weight];
  return <Text {...p} style={[{ fontFamily: fam, fontSize: 12, lineHeight: 17, color: muted ? c.muted : c.fg }, style]} />;
}
/** tracked uppercase kicker — the Vogue label */
export function Eyebrow({ color, style, ...p }: TextProps & { color?: string }) {
  const { c, f } = useTheme();
  return <Text {...p} style={[{ fontFamily: f.bodyBold, fontSize: 10, lineHeight: 14, letterSpacing: 2, textTransform: 'uppercase', color: color ?? c.muted }, style]} />;
}
/** the wordmark on a black band with the tulip texture: the masthead of every root screen */
export function Masthead({ size = 16, style, bleed = 16, top = 0 }: { size?: number; style?: ViewProps['style']; bleed?: number; top?: number }) {
  const { c, f } = useTheme();
  return (
    <View style={[{ backgroundColor: '#0B0B0B', marginHorizontal: -bleed, paddingTop: top + 14, paddingBottom: 12, borderBottomWidth: 2, borderBottomColor: c.accent, overflow: 'hidden' }, style]}>
      <TulipTexture />
      <Text accessibilityRole="header" style={{ fontFamily: f.display, fontSize: size, lineHeight: size * 1.1, letterSpacing: size * 0.38, textTransform: 'uppercase', color: '#F3EEE3', textAlign: 'center' }}>Persona</Text>
    </View>
  );
}

/* ---------- surfaces ---------- */
export function Card({ style, ...p }: ViewProps) {
  const { c } = useTheme();
  return <View {...p} style={[{ backgroundColor: c.surface, borderWidth: 1, borderColor: c.line, padding: space.lg }, style]} />;
}
/** black block with a turquoise hairline on top and the faint tulip texture: hero of a brand / show / list page */
export function Band({ style, children, ...p }: ViewProps) {
  const { c } = useTheme();
  return (
    <View {...p} style={[{ backgroundColor: '#0B0B0B', padding: 20, borderTopWidth: 3, borderTopColor: c.accent, gap: 10, overflow: 'hidden' }, style]}>
      <TulipTexture opacity={0.22} />
      {children}
    </View>
  );
}
/** section head with a hairline rule underneath (Vogue's section rule) */
export function Section({ title, right, children, style, kicker, ornament }: { title?: string; right?: React.ReactNode; children: React.ReactNode; style?: ViewProps['style']; kicker?: boolean; ornament?: boolean }) {
  const { c } = useTheme();
  return (
    <View style={[{ gap: space.md }, style]}>
      {title ? (
        <View style={{ flexDirection: 'row', alignItems: 'baseline', justifyContent: 'space-between', gap: 10, borderBottomWidth: 1, borderBottomColor: c.rule, paddingBottom: 6 }}>
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8, flexShrink: 1 }}>
            {kicker ? <Eyebrow color={c.fg}>{title}</Eyebrow> : <Display size="md">{title}</Display>}
            {ornament ? <TulipMark color={c.fg} /> : null}
          </View>
          {right}
        </View>
      ) : null}
      {children}
    </View>
  );
}
export function Row({ style, ...p }: ViewProps) {
  return <View {...p} style={[{ flexDirection: 'row', alignItems: 'center', gap: 10 }, style]} />;
}
export function Divider({ strong }: { strong?: boolean }) { const { c } = useTheme(); return <View style={{ height: 1, backgroundColor: strong ? c.rule : c.line }} />; }

/* ---------- controls ---------- */
export function Button({ label, right, variant = 'primary', style, ...p }: PressableProps & { label: string; right?: string; variant?: 'primary' | 'dark' | 'ghost' | 'accent' }) {
  const { c, f } = useTheme();
  const bg = variant === 'accent' ? c.accent : variant === 'ghost' ? c.surface : c.ink;
  const fg = variant === 'accent' ? c.accentInk : variant === 'ghost' ? c.fg : c.inkFg;
  return (
    <Pressable {...p} style={({ pressed }) => [{ backgroundColor: bg, paddingVertical: 15, paddingHorizontal: 18, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', gap: 12, borderWidth: 1, borderColor: variant === 'ghost' ? c.fg : bg, opacity: pressed ? 0.85 : p.disabled ? 0.4 : 1 }, style as any]}>
      <Text style={{ fontFamily: f.bodyBold, fontSize: 12, letterSpacing: 2, textTransform: 'uppercase', color: fg }}>{label}</Text>
      {right ? <Text style={{ fontFamily: f.bodySemi, fontSize: 12, color: fg, opacity: 0.8 }}>{right}</Text> : null}
    </Pressable>
  );
}
export function Chip({ label, on, onPress, tone = 'neutral' }: { label: string; on?: boolean; onPress?: () => void; tone?: 'neutral' | 'green' | 'gold' | 'ink' }) {
  const { c, f } = useTheme();
  const bg = on ? (tone === 'green' ? c.accent : c.ink) : c.surface;
  const fg = on ? (tone === 'green' ? c.accentInk : c.inkFg) : tone === 'green' ? c.accent : c.fg;
  const border = on ? bg : tone === 'green' ? c.accent : tone === 'ink' ? c.fg : c.line;
  return (
    <Pressable onPress={onPress} disabled={!onPress} style={{ borderWidth: 1, borderColor: border, backgroundColor: bg, paddingVertical: 7, paddingHorizontal: 12 }}>
      <Text style={{ fontFamily: f.bodyBold, fontSize: 10, letterSpacing: 1.4, textTransform: 'uppercase', color: fg }}>{label}</Text>
    </Pressable>
  );
}
export function Tag({ label, tone = 'neutral' }: { label: string; tone?: 'neutral' | 'green' | 'gold' | 'ink' | 'dashed' }) {
  const { c, f } = useTheme();
  const map = {
    neutral: { bg: c.surface2, fg: c.muted, border: c.surface2, dashed: false },
    green: { bg: c.accentSoft, fg: c.accent, border: c.accentSoft, dashed: false },
    gold: { bg: c.surface, fg: c.fg, border: c.fg, dashed: false },
    ink: { bg: c.ink, fg: c.inkFg, border: c.ink, dashed: false },
    dashed: { bg: 'transparent', fg: c.muted, border: c.line, dashed: true },
  }[tone];
  return (
    <View style={{ paddingVertical: 3, paddingHorizontal: 8, backgroundColor: map.bg, borderWidth: 1, borderColor: map.border, borderStyle: map.dashed ? 'dashed' : 'solid', alignSelf: 'flex-start' }}>
      <Text style={{ fontFamily: f.bodyBold, fontSize: 9, letterSpacing: 1.2, textTransform: 'uppercase', color: map.fg }}>{label}</Text>
    </View>
  );
}
export function Field(p: TextInputProps) {
  const { c, f } = useTheme();
  return <TextInput placeholderTextColor={c.muted} {...p} style={[{ fontFamily: f.body, fontSize: 15, color: c.fg, backgroundColor: c.surface, borderWidth: 1, borderColor: c.line, paddingVertical: 11, paddingHorizontal: 12, minHeight: p.multiline ? 80 : undefined, textAlignVertical: p.multiline ? 'top' : 'center' }, p.style]} />;
}
export function Stars({ value, size = 13, color }: { value: number; size?: number; color?: string }) {
  const { c } = useTheme();
  const full = Math.floor(value), half = value - full >= 0.5;
  return <Text style={{ color: color ?? c.fg, fontSize: size, letterSpacing: 1 }}>{'★'.repeat(full) + (half ? '½' : '') + '☆'.repeat(Math.max(0, 5 - full - (half ? 1 : 0)))}</Text>;
}
export function StarPicker({ value, onChange }: { value: number; onChange: (n: number) => void }) {
  const { c } = useTheme();
  const { t } = useT();
  return (
    <View style={{ flexDirection: 'row', gap: 6 }}>
      {[1, 2, 3, 4, 5].map((n) => (
        <Pressable key={n} onPress={() => onChange(n)} accessibilityLabel={t('{n} yıldız', { n })} style={{ width: 40, height: 40, borderWidth: 1, borderColor: n <= value ? c.fg : c.line, backgroundColor: n <= value ? c.ink : c.surface, alignItems: 'center', justifyContent: 'center' }}>
          <Text style={{ fontSize: 18, color: n <= value ? c.inkFg : c.line }}>★</Text>
        </Pressable>
      ))}
    </View>
  );
}
export function Avatar({ name, size = 36, accent }: { name: string; size?: number; accent?: boolean }) {
  const { c, f } = useTheme();
  return (
    <View style={{ width: size, height: size, borderRadius: size / 2, backgroundColor: accent ? c.accent : c.surface2, alignItems: 'center', justifyContent: 'center' }}>
      <Text style={{ fontFamily: f.display, fontSize: size * 0.45, color: accent ? c.accentInk : c.fg }}>{(name || '?').charAt(0).toUpperCase()}</Text>
    </View>
  );
}
export function Bar({ value, low }: { value: number; low?: boolean }) {
  const { c } = useTheme();
  return (
    <View style={{ height: 6, backgroundColor: c.line, overflow: 'hidden', flex: 1 }}>
      <View style={{ width: `${Math.max(0, Math.min(100, value))}%`, height: '100%', backgroundColor: low ? c.danger : c.accent }} />
    </View>
  );
}
/** rating distribution, 1→5, as five thin bars */
export function RatingBars({ dist, height = 22 }: { dist: number[]; height?: number }) {
  const { c } = useTheme();
  const max = Math.max(1, ...dist);
  return (
    <View style={{ flexDirection: 'row', gap: 3, alignItems: 'flex-end', height }} accessibilityLabel="Puan dağılımı">
      {dist.map((n, i) => <View key={i} style={{ width: 14, height: Math.max(2, (n / max) * height), backgroundColor: i >= 3 ? c.accent : c.line }} />)}
    </View>
  );
}
/** Tiffany text link */
export function LinkText({ label, onPress, style }: { label: string; onPress?: () => void; style?: TextProps['style'] }) {
  const { c, f } = useTheme();
  return <Pressable onPress={onPress}><Text style={[{ fontFamily: f.bodyBold, fontSize: 11, letterSpacing: 1.4, textTransform: 'uppercase', color: c.accent }, style]}>{label}</Text></Pressable>;
}
export const styles = StyleSheet.create({});
