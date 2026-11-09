import { useFocusEffect } from 'expo-router';
import { useCallback, useState } from 'react';
import { Alert, Linking, StyleSheet, TextInput, View } from 'react-native';
import { Button } from '../../components/Button';
import { Panel, ScreenScroll, Section } from '../../components/Screen';
import { Txt } from '../../components/Txt';
import { looksLikeAnthropicKey, maskKey } from '../../domain/apiKey';
import { MODEL } from '../../services/claude';
import { apiKeyStore, recordStore } from '../../services/storage';
import { useSelection } from '../../state/selection';
import { colors, fonts, radius, space } from '../../theme';

export default function SettingsScreen() {
  const { accent, team } = useSelection();
  const [storedKey, setStoredKey] = useState<string | null>(null);
  const [input, setInput] = useState('');
  const [inputError, setInputError] = useState<string | null>(null);
  const [savedCount, setSavedCount] = useState(0);

  const load = useCallback(() => {
    apiKeyStore.get().then(setStoredKey);
    recordStore.list().then((records) => setSavedCount(records.length));
  }, []);

  useFocusEffect(load);

  async function saveKey() {
    if (!looksLikeAnthropicKey(input)) {
      setInputError('That does not look like an Anthropic API key. Keys start with sk-ant-.');
      return;
    }
    try {
      await apiKeyStore.set(input);
      setStoredKey(input.trim());
      setInput('');
      setInputError(null);
    } catch {
      setInputError('Could not save the key to this phone. Try again.');
    }
  }

  function confirmRemoveKey() {
    Alert.alert('Remove your API key?', 'Saved setups stay on this phone. New setups will need a key.', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Remove key',
        style: 'destructive',
        onPress: () => apiKeyStore.clear().then(load),
      },
    ]);
  }

  function confirmClear() {
    Alert.alert(
      'Delete all saved setups?',
      `All ${savedCount} saved setups will be removed from this phone. Opening one again will use credits.`,
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Delete all', style: 'destructive', onPress: () => recordStore.clear().then(load) },
      ],
    );
  }

  return (
    <ScreenScroll>
      <Txt variant="display">Settings</Txt>

      <Section title="Anthropic API key">
        <Panel>
          {storedKey ? (
            <>
              <Txt variant="label">Key saved</Txt>
              <Txt color={colors.muted} style={styles.keyMask}>
                {maskKey(storedKey)}
              </Txt>
              <Button title="Remove key" variant="outline" color={colors.danger} onPress={confirmRemoveKey} />
            </>
          ) : (
            <>
              <Txt color={colors.muted}>
                Paste a key from the Anthropic Console. Setups are generated with your own credits.
              </Txt>
              <TextInput
                value={input}
                onChangeText={(text) => {
                  setInput(text);
                  setInputError(null);
                }}
                placeholder="sk-ant-..."
                placeholderTextColor={colors.faint}
                secureTextEntry
                autoCapitalize="none"
                autoCorrect={false}
                spellCheck={false}
                textContentType="password"
                style={styles.input}
              />
              {inputError ? (
                <Txt variant="small" color={colors.danger} style={styles.error}>
                  {inputError}
                </Txt>
              ) : null}
              <View style={styles.gap} />
              <Button
                title="Save key"
                color={accent}
                onColor={team.onColor}
                disabled={input.trim().length === 0}
                onPress={saveKey}
              />
              <Txt
                variant="small"
                color={accent}
                style={styles.link}
                onPress={() => Linking.openURL('https://console.anthropic.com/settings/keys')}
                accessibilityRole="link"
              >
                Get a key at console.anthropic.com
              </Txt>
            </>
          )}
          <Txt variant="small" color={colors.faint} style={styles.fine}>
            The key is kept in this phone's secure storage and is sent only to Anthropic when you
            generate a setup.
          </Txt>
        </Panel>
      </Section>

      <Section title="Model">
        <Panel>
          <Txt variant="label">Claude Opus 5.5</Txt>
          <Txt variant="small" color={colors.faint}>
            {MODEL}
          </Txt>
          <Txt color={colors.muted} style={styles.modelNote}>
            Each new team, track and weather combination is one request. Saved setups never call
            Claude again unless you regenerate them.
          </Txt>
        </Panel>
      </Section>

      <Section title="Saved setups">
        <Panel>
          <Txt color={colors.muted}>
            {savedCount === 0
              ? 'No setups saved on this phone.'
              : `${savedCount} ${savedCount === 1 ? 'setup is' : 'setups are'} saved on this phone.`}
          </Txt>
          {savedCount > 0 ? (
            <View style={styles.gapTop}>
              <Button title="Delete all saved setups" variant="outline" color={colors.danger} onPress={confirmClear} />
            </View>
          ) : null}
        </Panel>
      </Section>

      <Section title="About the numbers">
        <Panel>
          <Txt color={colors.muted}>
            Settings are reasoned starting points to tune by feel, not guaranteed-fastest values.
            Claude knows how each setting behaves and the real circuits, but it has no access to
            your lap times. Use each explanation to nudge the car toward what you feel on track.
          </Txt>
        </Panel>
      </Section>
    </ScreenScroll>
  );
}

const styles = StyleSheet.create({
  keyMask: { marginTop: space.xs, marginBottom: space.lg },
  modelNote: { marginTop: space.md },
  input: {
    marginTop: space.md,
    height: 52,
    borderRadius: radius.chip,
    backgroundColor: colors.raised,
    color: colors.text,
    paddingHorizontal: space.md,
    fontFamily: fonts.body,
    fontSize: 16,
  },
  error: { marginTop: space.sm },
  gap: { height: space.md },
  gapTop: { marginTop: space.lg },
  link: { marginTop: space.md, textDecorationLine: 'underline', alignSelf: 'flex-start' },
  fine: { marginTop: space.lg },
});
