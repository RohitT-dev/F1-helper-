import type { ReactNode } from 'react';
import { ScrollView, StyleSheet, View, type ViewStyle } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { colors, space } from '../theme';
import { Txt } from './Txt';

/** Scrolling screen with the app background, safe-area top padding and a 16px gutter. */
export function ScreenScroll({
  children,
  bottomPadding = space.xxl,
  contentStyle,
}: {
  children: ReactNode;
  bottomPadding?: number;
  contentStyle?: ViewStyle;
}) {
  const insets = useSafeAreaInsets();
  return (
    <ScrollView
      style={styles.fill}
      keyboardShouldPersistTaps="handled"
      contentContainerStyle={[
        { paddingTop: insets.top + space.lg, paddingBottom: bottomPadding, paddingHorizontal: space.lg },
        contentStyle,
      ]}
    >
      {children}
    </ScrollView>
  );
}

/** A heading followed by its content. */
export function Section({ title, children }: { title: string; children: ReactNode }) {
  return (
    <View style={styles.section}>
      <Txt variant="heading" style={styles.sectionTitle}>
        {title}
      </Txt>
      {children}
    </View>
  );
}

/** A flat rounded panel, the app's one container style. */
export function Panel({ children, style }: { children: ReactNode; style?: ViewStyle }) {
  return <View style={[styles.panel, style]}>{children}</View>;
}

const styles = StyleSheet.create({
  fill: { flex: 1, backgroundColor: colors.bg },
  section: { marginTop: space.xl },
  sectionTitle: { marginBottom: space.md },
  panel: { backgroundColor: colors.panel, borderRadius: 18, padding: space.lg },
});
