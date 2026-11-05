import React from 'react';
import { StyleSheet, View } from 'react-native';
import Svg, { Circle, Defs, G, Path, Pattern, Rect } from 'react-native-svg';
import { TIFFANY } from '@/theme';

const CREAM = '#F3EEE3';
const TULIP = ['M0 0c-7-6-8-16-5-24 2 6 4 8 5 10 1-2 3-4 5-10 3 8 2 18-5 24z', 'M0-14c-2-4-1-8 0-12 1 4 2 8 0 12z'];

function Tulip({ x, y, r, s = 0.55, fill = TIFFANY }: { x: number; y: number; r: number; s?: number; fill?: string }) {
  return (
    <G transform={`translate(${x} ${y}) rotate(${r}) scale(${s})`} fill={fill}>
      <Path d={TULIP[0]} /><Path d={TULIP[1]} />
    </G>
  );
}
function Flower({ x, y }: { x: number; y: number }) {
  return (
    <G fill={CREAM} opacity={0.45}>
      <Circle cx={x} cy={y} r={1.6} /><Circle cx={x + 4} cy={y - 4} r={1.6} /><Circle cx={x - 4} cy={y - 4} r={1.6} /><Circle cx={x - 2} cy={y - 8} r={1.6} /><Circle cx={x + 2} cy={y - 8} r={1.6} />
    </G>
  );
}

/**
 * Lale ve kıvrık dal — the "saz yolu" of İznik tiles and Bursa silk, drawn as a faint texture.
 * Only ever on black; never on cream, never over a photo. Absolute-fill it inside a band.
 */
export function TulipTexture({ opacity = 0.32 }: { opacity?: number }) {
  return (
    <View pointerEvents="none" style={[StyleSheet.absoluteFill, { opacity }]}>
      <Svg width="100%" height="100%">
        <Defs>
          <Pattern id="lale" width={150} height={120} patternUnits="userSpaceOnUse">
            <G fill="none" stroke={CREAM} strokeWidth={1} opacity={0.55}>
              <Path d="M-10 110c30-10 40-50 75-60s50-40 95-50" /><Path d="M-10 50c30-10 40-50 75-60" /><Path d="M65 170c30-10 40-50 75-60" />
              <Path d="M40 86c-8 2-14-2-16-8" /><Path d="M112 32c-8 2-14-2-16-8" /><Path d="M20 20c8-2 14 2 16 8" />
            </G>
            <Flower x={24} y={78} /><Flower x={118} y={22} /><Flower x={70} y={112} />
            <G opacity={0.75}>
              <Tulip x={65} y={50} r={-20} /><Tulip x={140} y={0} r={-20} /><Tulip x={-10} y={110} r={-20} /><Tulip x={26} y={92} r={25} /><Tulip x={101} y={38} r={25} />
            </G>
          </Pattern>
        </Defs>
        <Rect width="100%" height="100%" fill="url(#lale)" />
      </Svg>
    </View>
  );
}

/** a single tulip, for section rules, empty states and the app icon */
export function TulipMark({ size = 14, color = '#0B0B0B' }: { size?: number; color?: string }) {
  return (
    <Svg width={size} height={size * 1.1} viewBox="-8 -28 16 30">
      <G transform="scale(.6)" fill={color}><Path d={TULIP[0]} /><Path d={TULIP[1]} /></G>
    </Svg>
  );
}
