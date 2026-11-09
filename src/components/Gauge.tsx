import { StyleSheet, View } from 'react-native';
import { formatValue, type SettingSpec } from '../domain/settings';
import { colors, radius } from '../theme';
import { Txt } from './Txt';

interface Props {
  spec: SettingSpec;
  value: number;
  color: string;
}

/**
 * Mirrors the in-game slider: a bar from the minimum to the maximum with a
 * notch where this value sits, so a number reads as a position, not just a digit.
 */
export function Gauge({ spec, value, color }: Props) {
  const range = spec.max - spec.min;
  const ratio = range === 0 ? 0 : Math.min(1, Math.max(0, (value - spec.min) / range));
  const percent = `${(ratio * 100).toFixed(2)}%` as `${number}%`;

  return (
    <View
      accessible
      accessibilityLabel={`${spec.label} sits at ${Math.round(ratio * 100)} percent of its range`}
    >
      <View style={styles.track}>
        <View style={[styles.fill, { width: percent, backgroundColor: color }]} />
        <View style={[styles.notch, { left: percent }]} />
      </View>
      <View style={styles.ends}>
        <Txt variant="caption" color={colors.faint}>
          {formatValue(spec, spec.min)}
        </Txt>
        <Txt variant="caption" color={colors.faint}>
          {formatValue(spec, spec.max)}
        </Txt>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  track: {
    height: 6,
    borderRadius: radius.bar,
    backgroundColor: colors.raised,
    marginTop: 6,
    justifyContent: 'center',
  },
  fill: { height: 6, borderRadius: radius.bar },
  notch: {
    position: 'absolute',
    top: -5,
    width: 3,
    height: 16,
    marginLeft: -1.5,
    borderRadius: 1.5,
    backgroundColor: colors.text,
  },
  ends: { flexDirection: 'row', justifyContent: 'space-between', marginTop: 6 },
});
