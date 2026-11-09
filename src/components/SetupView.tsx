import { StyleSheet, View } from 'react-native';
import type { Setup } from '../domain/normalize';
import {
  formatValue,
  GROUPS,
  settingsInGroup,
  type SettingSpec,
} from '../domain/settings';
import { colors, radius, space } from '../theme';
import { Gauge } from './Gauge';
import { Txt } from './Txt';

function SettingRow({
  spec,
  entry,
  accent,
}: {
  spec: SettingSpec;
  entry: Setup['settings'][SettingSpec['key']];
  accent: string;
}) {
  return (
    <View style={styles.row}>
      <View style={styles.head}>
        <Txt variant="label" style={styles.rowLabel}>
          {spec.label}
        </Txt>
        <Txt variant="value">{formatValue(spec, entry.value)}</Txt>
      </View>
      <Gauge spec={spec} value={entry.value} color={accent} />
      {entry.originalValue !== undefined ? (
        <Txt variant="small" color={colors.warn} style={styles.note}>
          Claude suggested {entry.originalValue}, which is outside the game's range, so it was
          capped at {formatValue(spec, entry.value)}.
        </Txt>
      ) : null}
      <Txt variant="body" color={colors.muted} style={styles.why}>
        {entry.why}
      </Txt>
    </View>
  );
}

/** The full setup: overview, the six setting groups, then driving tips. */
export function SetupView({ setup, accent }: { setup: Setup; accent: string }) {
  return (
    <View style={styles.wrap}>
      <View style={styles.panel}>
        <Txt variant="heading">The approach</Txt>
        <Txt variant="body" color={colors.muted} style={styles.summary}>
          {setup.summary}
        </Txt>
      </View>

      {GROUPS.map((group) => (
        <View key={group.id} style={styles.panel}>
          <Txt variant="heading">{group.title}</Txt>
          {settingsInGroup(group.id).map((spec, index) => (
            <View key={spec.key} style={index > 0 ? styles.divided : undefined}>
              <SettingRow spec={spec} entry={setup.settings[spec.key]} accent={accent} />
            </View>
          ))}
        </View>
      ))}

      {setup.drivingTips.length > 0 ? (
        <View style={styles.panel}>
          <Txt variant="heading">Driving this setup</Txt>
          {setup.drivingTips.map((tip, index) => (
            <View key={index} style={styles.tip}>
              <View style={[styles.tipBar, { backgroundColor: accent }]} />
              <Txt variant="body" color={colors.muted} style={styles.tipText}>
                {tip}
              </Txt>
            </View>
          ))}
        </View>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { gap: space.lg },
  panel: {
    backgroundColor: colors.panel,
    borderRadius: radius.panel,
    padding: space.lg,
  },
  summary: { marginTop: space.sm },
  row: { paddingTop: space.lg },
  divided: { borderTopWidth: StyleSheet.hairlineWidth, borderTopColor: colors.line, marginTop: space.lg },
  head: { flexDirection: 'row', alignItems: 'flex-end', justifyContent: 'space-between', gap: space.md },
  rowLabel: { flex: 1, paddingBottom: 4 },
  note: { marginTop: space.sm },
  why: { marginTop: space.sm },
  tip: { flexDirection: 'row', gap: space.md, marginTop: space.md },
  tipBar: { width: 3, borderRadius: 1.5 },
  tipText: { flex: 1 },
});
