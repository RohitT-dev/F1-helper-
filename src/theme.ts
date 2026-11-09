import type { TextStyle } from 'react-native';

export const colors = {
  bg: '#14171C',
  panel: '#1C2026',
  raised: '#272C34',
  line: '#313740',
  text: '#ECEEF1',
  muted: '#A0A8B3',
  faint: '#6F7884',
  danger: '#FF6B5E',
  warn: '#FFB84D',
  ok: '#4CD97B',
  // Tyre compound colours, used to mark the weather: slicks, intermediates, wets.
  dry: '#FFD60A',
  inter: '#3DDC84',
  wet: '#4DA3FF',
} as const;

export const fonts = {
  display: 'BigShouldersDisplay_800ExtraBold',
  displayBold: 'BigShouldersDisplay_700Bold',
  body: 'HankenGrotesk_400Regular',
  bodyMedium: 'HankenGrotesk_500Medium',
  bodySemi: 'HankenGrotesk_600SemiBold',
} as const;

export const space = { xs: 4, sm: 8, md: 12, lg: 16, xl: 24, xxl: 32 } as const;

export const radius = { panel: 18, chip: 12, bar: 3 } as const;

export const type = {
  display: { fontFamily: fonts.display, fontSize: 46, lineHeight: 48, letterSpacing: 0.2 },
  title: { fontFamily: fonts.display, fontSize: 34, lineHeight: 36 },
  heading: { fontFamily: fonts.displayBold, fontSize: 24, lineHeight: 28, letterSpacing: 0.3 },
  value: { fontFamily: fonts.display, fontSize: 34, lineHeight: 36, fontVariant: ['tabular-nums'] },
  label: { fontFamily: fonts.bodySemi, fontSize: 15, lineHeight: 20 },
  body: { fontFamily: fonts.body, fontSize: 15, lineHeight: 22 },
  small: { fontFamily: fonts.bodyMedium, fontSize: 13, lineHeight: 18 },
  caption: { fontFamily: fonts.bodyMedium, fontSize: 12, lineHeight: 16 },
} satisfies Record<string, TextStyle>;

export type TypeVariant = keyof typeof type;
