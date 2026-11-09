import { router, useFocusEffect } from 'expo-router';
import { useCallback, useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { Button } from '../../components/Button';
import { Section, ScreenScroll } from '../../components/Screen';
import { TeamGrid, TrackField, WeatherPicker } from '../../components/Pickers';
import { Txt } from '../../components/Txt';
import { makeSetupId } from '../../domain/ids';
import { apiKeyStore, recordStore } from '../../services/storage';
import { useSelection } from '../../state/selection';
import { colors, radius, space } from '../../theme';

const ACTION_BAR_HEIGHT = 112;

export default function BuildScreen() {
  const { teamId, trackId, weather, team, accent, setTeamId, setTrackId, setWeather } =
    useSelection();
  const [cached, setCached] = useState(false);
  const [hasKey, setHasKey] = useState(true);

  const id = trackId ? makeSetupId({ teamId, trackId, weather }) : null;

  useFocusEffect(
    useCallback(() => {
      let live = true;
      apiKeyStore.get().then((key) => live && setHasKey(!!key));
      if (id) {
        recordStore.get(id).then((record) => live && setCached(!!record));
      } else {
        setCached(false);
      }
      return () => {
        live = false;
      };
    }, [id]),
  );

  const needsKey = !cached && !hasKey;
  const label = !id ? 'Choose a track' : cached ? 'Open saved setup' : 'Get setup';

  return (
    <View style={styles.fill}>
      <ScreenScroll bottomPadding={ACTION_BAR_HEIGHT + space.xl}>
        <Txt variant="display">Set up the car</Txt>
        <Txt color={colors.muted} style={styles.lede}>
          Pick a team, a circuit and the weather. Claude returns all 21 settings, each with the
          reason behind it.
        </Txt>

        <Section title="Team">
          <TeamGrid selectedId={teamId} onSelect={setTeamId} />
        </Section>

        <Section title="Track">
          <TrackField selectedId={trackId} accent={accent} onSelect={setTrackId} />
        </Section>

        <Section title="Weather">
          <WeatherPicker selectedId={weather} onSelect={setWeather} />
        </Section>
      </ScreenScroll>

      <View style={styles.bar}>
        {needsKey ? (
          <Txt variant="small" color={colors.warn} style={styles.barNote}>
            Add your Anthropic API key in Settings to generate setups.
          </Txt>
        ) : (
          <Txt variant="small" color={colors.muted} style={styles.barNote}>
            {cached
              ? 'Saved on this phone. Opening it uses no credits.'
              : id
                ? 'Asks Claude once, then saves the result on this phone.'
                : `${team.short} setups need a circuit.`}
          </Txt>
        )}
        {needsKey ? (
          <Button
            title="Open Settings"
            icon="key-outline"
            color={accent}
            onColor={team.onColor}
            onPress={() => router.navigate('/settings')}
          />
        ) : (
          <Button
            title={label}
            color={accent}
            onColor={team.onColor}
            disabled={!id}
            onPress={() => id && router.push(`/setup/${id}`)}
          />
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  fill: { flex: 1, backgroundColor: colors.bg },
  lede: { marginTop: space.sm, maxWidth: 360 },
  bar: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    padding: space.lg,
    gap: space.sm,
    backgroundColor: colors.bg,
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: colors.line,
    borderTopLeftRadius: radius.panel,
    borderTopRightRadius: radius.panel,
  },
  barNote: { textAlign: 'center' },
});
