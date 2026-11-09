import * as Haptics from 'expo-haptics';
import Ionicons from '@expo/vector-icons/Ionicons';
import { ActivityIndicator, Pressable, StyleSheet, View } from 'react-native';
import { colors, fonts, radius } from '../theme';
import { Txt } from './Txt';

interface Props {
  title: string;
  onPress(): void;
  /** Fill colour for `solid`, outline and text colour for `outline`. */
  color?: string;
  onColor?: string;
  variant?: 'solid' | 'outline';
  icon?: keyof typeof Ionicons.glyphMap;
  disabled?: boolean;
  loading?: boolean;
}

export function Button({
  title,
  onPress,
  color = colors.text,
  onColor = colors.bg,
  variant = 'solid',
  icon,
  disabled,
  loading,
}: Props) {
  const solid = variant === 'solid';
  const fg = solid ? onColor : color;

  return (
    <Pressable
      accessibilityRole="button"
      accessibilityState={{ disabled: !!disabled || !!loading }}
      disabled={disabled || loading}
      onPress={() => {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light).catch(() => undefined);
        onPress();
      }}
      style={({ pressed }) => [
        styles.base,
        solid ? { backgroundColor: color } : { borderColor: color, borderWidth: 1.5 },
        (disabled || loading) && styles.disabled,
        pressed && styles.pressed,
      ]}
    >
      <View style={styles.content}>
        {loading ? (
          <ActivityIndicator color={fg} />
        ) : (
          <>
            {icon ? <Ionicons name={icon} size={20} color={fg} /> : null}
            <Txt style={{ fontFamily: fonts.bodySemi, fontSize: 16 }} color={fg}>
              {title}
            </Txt>
          </>
        )}
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  base: {
    minHeight: 54,
    borderRadius: radius.chip,
    paddingHorizontal: 20,
    justifyContent: 'center',
  },
  content: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8 },
  disabled: { opacity: 0.4 },
  pressed: { opacity: 0.85, transform: [{ scale: 0.99 }] },
});
