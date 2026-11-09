import Ionicons from '@expo/vector-icons/Ionicons';
import { router, useLocalSearchParams } from 'expo-router';
import { useEffect, useState } from 'react';
import { ActivityIndicator, Alert, Pressable, StyleSheet, View } from 'react-native';
import { Button } from '../../components/Button';
import { Panel, ScreenScroll } from '../../components/Screen';
import { SetupView } from '../../components/SetupView';
import { Txt } from '../../components/Txt';
import { TEAM_BY_ID } from '../../data/teams';
import { TRACK_BY_ID } from '../../data/tracks';
import { WEATHER_BY_ID } from '../../data/weather';
import { parseSetupId } from '../../domain/ids';
import { useSetup } from '../../hooks/useSetup';
import { colors, space } from '../../theme';

function useElapsed(startedAt: number | null): number {
  const [now, setNow] = useState(() => Date.now());
  useEffect(() => {
    if (startedAt === null) return;
    setNow(Date.now());
    const timer = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(timer);
  }, [startedAt]);
  return startedAt === null ? 0 : Math.max(0, Math.floor((now - startedAt) / 1000));
}

function goBack() {
  if (router.canGoBack()) router.back();
  else router.replace('/');
}

export default function SetupScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { state, regenerate, retry, generate } = useSetup(id);
  const elapsed = useElapsed(state.startedAt);

  const combo = parseSetupId(id);
  const team = combo ? TEAM_BY_ID[combo.teamId] : null;
  const track = combo ? TRACK_BY_ID[combo.trackId] : null;
  const weather = combo ? WEATHER_BY_ID[combo.weather] : null;
  const accent = team?.color ?? colors.text;

  function confirmRegenerate() {
    Alert.alert(
      'Regenerate this setup?',
      'Claude builds it again using your credits. The new setup replaces the saved one.',
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Regenerate', onPress: regenerate },
      ],
    );
  }

  const canRegenerate = state.phase === 'ready' && state.record !== null;
  const date = state.record
    ? new Date(state.record.createdAt).toLocaleDateString(undefined, {
        day: 'numeric',
        month: 'long',
        year: 'numeric',
      })
    : null;

  return (
    <ScreenScroll>
      <View style={styles.bar}>
        <Pressable accessibilityRole="button" accessibilityLabel="Back" onPress={goBack} hitSlop={12} style={styles.barButton}>
          <Ionicons name="chevron-back" size={26} color={colors.text} />
          <Txt variant="label">Back</Txt>
        </Pressable>
        {canRegenerate ? (
          <Pressable accessibilityRole="button" accessibilityLabel="Regenerate setup" onPress={confirmRegenerate} hitSlop={12}>
            <Ionicons name="refresh" size={24} color={colors.text} />
          </Pressable>
        ) : null}
      </View>

      {team && track && weather ? (
        <View style={styles.hero}>
          <View style={[styles.heroBar, { backgroundColor: accent }]} />
          <Txt variant="title" style={styles.track}>
            {track.flag} {track.name}
          </Txt>
          <Txt variant="label" color={colors.muted}>
            {team.name}
          </Txt>
          <Txt variant="small" color={colors.faint}>
            {weather.label}, {weather.hint.toLowerCase()}
          </Txt>
        </View>
      ) : null}

      {state.phase === 'ready' && state.record ? (
        <Txt variant="small" color={colors.muted} style={styles.meta}>
          {state.fromCache ? `Saved on this phone, made ${date}.` : `Made just now by Claude. Saved on this phone.`}
        </Txt>
      ) : null}

      {state.error && state.phase === 'ready' ? (
        <Panel style={styles.banner}>
          <Txt variant="label" color={colors.warn}>
            Could not make a new setup
          </Txt>
          <Txt variant="small" color={colors.muted}>
            {state.error} Your saved setup is still shown below.
          </Txt>
        </Panel>
      ) : null}

      {state.phase === 'generating' ? (
        <Panel style={styles.banner}>
          <View style={styles.generating}>
            <ActivityIndicator color={accent} />
            <View style={styles.generatingText}>
              <Txt variant="label">{state.record ? 'Regenerating with Claude' : 'Claude is building your setup'}</Txt>
              <Txt variant="small" color={colors.muted}>
                {elapsed} seconds so far. This usually takes up to a minute.
              </Txt>
            </View>
          </View>
          {!state.record ? (
            <View style={styles.gapTop}>
              <Button title="Cancel" variant="outline" color={colors.muted} onPress={goBack} />
            </View>
          ) : null}
        </Panel>
      ) : null}

      {state.phase === 'loading' ? (
        <View style={styles.center}>
          <ActivityIndicator color={accent} />
        </View>
      ) : null}

      {state.phase === 'confirm' ? (
        <Panel style={styles.banner}>
          <Txt variant="heading">Build this setup?</Txt>
          <Txt color={colors.muted} style={styles.bannerText}>
            It is not saved on this phone yet. Claude builds it using your credits.
          </Txt>
          <Button title="Generate setup" color={accent} onColor={team?.onColor} onPress={generate} />
        </Panel>
      ) : null}

      {state.phase === 'no-key' ? (
        <Panel style={styles.banner}>
          <Txt variant="heading">An API key is needed</Txt>
          <Txt color={colors.muted} style={styles.bannerText}>
            This setup is not saved on this phone yet. Add your Anthropic API key in Settings and
            Claude will build it.
          </Txt>
          <Button
            title="Open Settings"
            icon="key-outline"
            color={accent}
            onColor={team?.onColor}
            onPress={() => router.navigate('/settings')}
          />
        </Panel>
      ) : null}

      {state.phase === 'error' ? (
        <Panel style={styles.banner}>
          <Txt variant="heading" color={colors.danger}>
            Setup failed
          </Txt>
          <Txt color={colors.muted} style={styles.bannerText}>
            {state.error}
          </Txt>
          <Button title="Try again" color={accent} onColor={team?.onColor} onPress={retry} />
        </Panel>
      ) : null}

      {state.phase === 'invalid' ? (
        <Panel style={styles.banner}>
          <Txt variant="heading">Setup not found</Txt>
          <Txt color={colors.muted} style={styles.bannerText}>
            This link does not match a team, track and weather.
          </Txt>
          <Button title="Go back" onPress={goBack} />
        </Panel>
      ) : null}

      {state.record ? (
        <View style={[styles.setup, state.phase === 'generating' && styles.dimmed]}>
          <SetupView setup={state.record.setup} accent={accent} />
        </View>
      ) : null}
    </ScreenScroll>
  );
}

const styles = StyleSheet.create({
  bar: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: space.lg },
  barButton: { flexDirection: 'row', alignItems: 'center', gap: 2, marginLeft: -6 },
  hero: { marginBottom: space.md },
  heroBar: { width: 56, height: 6, borderRadius: 3, marginBottom: space.md },
  track: { marginBottom: space.sm },
  meta: { marginBottom: space.lg },
  banner: { marginBottom: space.lg },
  bannerText: { marginTop: space.sm, marginBottom: space.lg },
  generating: { flexDirection: 'row', alignItems: 'center', gap: space.md },
  generatingText: { flex: 1, gap: 2 },
  gapTop: { marginTop: space.lg },
  center: { paddingVertical: space.xxl, alignItems: 'center' },
  setup: { marginTop: space.sm },
  dimmed: { opacity: 0.45 },
});
