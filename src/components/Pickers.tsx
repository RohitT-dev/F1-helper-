import * as Haptics from 'expo-haptics';
import Ionicons from '@expo/vector-icons/Ionicons';
import { useMemo, useState } from 'react';
import {
  FlatList,
  Modal,
  Pressable,
  StyleSheet,
  TextInput,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { TEAMS } from '../data/teams';
import { TRACKS, TRACK_BY_ID } from '../data/tracks';
import { WEATHER, type WeatherId } from '../data/weather';
import { colors, fonts, radius, space } from '../theme';
import { Txt } from './Txt';

function tap() {
  Haptics.selectionAsync().catch(() => undefined);
}

/** Two-column grid of constructors. The selected card is filled with its livery colour. */
export function TeamGrid({
  selectedId,
  onSelect,
}: {
  selectedId: string;
  onSelect(id: string): void;
}) {
  return (
    <View style={styles.grid}>
      {TEAMS.map((team) => {
        const selected = team.id === selectedId;
        return (
          <Pressable
            key={team.id}
            accessibilityRole="radio"
            accessibilityState={{ selected }}
            onPress={() => {
              tap();
              onSelect(team.id);
            }}
            style={[
              styles.team,
              selected ? { backgroundColor: team.color } : { backgroundColor: colors.panel },
            ]}
          >
            <View
              style={[
                styles.livery,
                { backgroundColor: selected ? team.onColor : team.color, opacity: selected ? 0.35 : 1 },
              ]}
            />
            <Txt
              variant="label"
              color={selected ? team.onColor : colors.text}
              numberOfLines={1}
              style={styles.teamName}
            >
              {team.short}
            </Txt>
          </Pressable>
        );
      })}
    </View>
  );
}

/** A row showing the chosen circuit. Tapping opens a searchable list of all 24. */
export function TrackField({
  selectedId,
  accent,
  onSelect,
}: {
  selectedId: string | null;
  accent: string;
  onSelect(id: string): void;
}) {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState('');
  const insets = useSafeAreaInsets();
  const selected = selectedId ? TRACK_BY_ID[selectedId] : null;

  const results = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return TRACKS;
    return TRACKS.filter((t) =>
      `${t.name} ${t.country}`.toLowerCase().includes(q),
    );
  }, [query]);

  function close() {
    setOpen(false);
    setQuery('');
  }

  return (
    <>
      <Pressable
        accessibilityRole="button"
        accessibilityLabel={selected ? `Track: ${selected.name}. Tap to change.` : 'Choose a track'}
        onPress={() => {
          tap();
          setOpen(true);
        }}
        style={styles.field}
      >
        <Txt style={styles.flag}>{selected ? selected.flag : '🏁'}</Txt>
        <View style={styles.fieldText}>
          <Txt variant="label" numberOfLines={1} color={selected ? colors.text : colors.muted}>
            {selected ? selected.name : 'Choose a track'}
          </Txt>
          {selected ? (
            <Txt variant="small" color={colors.muted}>
              {selected.country}
            </Txt>
          ) : null}
        </View>
        <Ionicons name="chevron-forward" size={20} color={colors.faint} />
      </Pressable>

      <Modal
        visible={open}
        animationType="slide"
        presentationStyle="pageSheet"
        onRequestClose={close}
      >
        <View style={[styles.sheet, { paddingTop: space.lg, paddingBottom: insets.bottom }]}>
          <View style={styles.sheetHead}>
            <Txt variant="title">Choose a track</Txt>
            <Pressable accessibilityRole="button" accessibilityLabel="Close" onPress={close} hitSlop={12}>
              <Ionicons name="close" size={26} color={colors.text} />
            </Pressable>
          </View>

          <View style={styles.search}>
            <Ionicons name="search" size={18} color={colors.faint} />
            <TextInput
              value={query}
              onChangeText={setQuery}
              placeholder="Search by circuit or country"
              placeholderTextColor={colors.faint}
              autoCorrect={false}
              clearButtonMode="while-editing"
              style={styles.searchInput}
            />
          </View>

          <FlatList
            data={results}
            keyExtractor={(t) => t.id}
            keyboardShouldPersistTaps="handled"
            contentContainerStyle={styles.list}
            ListEmptyComponent={
              <Txt color={colors.muted} style={styles.empty}>
                No track matches "{query.trim()}".
              </Txt>
            }
            renderItem={({ item }) => {
              const active = item.id === selectedId;
              return (
                <Pressable
                  accessibilityRole="button"
                  onPress={() => {
                    tap();
                    onSelect(item.id);
                    close();
                  }}
                  style={[styles.trackRow, active && { borderColor: accent }]}
                >
                  <Txt style={styles.flag}>{item.flag}</Txt>
                  <View style={styles.fieldText}>
                    <Txt variant="label" numberOfLines={1}>
                      {item.name}
                    </Txt>
                    <Txt variant="small" color={colors.muted}>
                      {item.country}
                    </Txt>
                  </View>
                  {active ? <Ionicons name="checkmark-circle" size={22} color={accent} /> : null}
                </Pressable>
              );
            }}
          />
        </View>
      </Modal>
    </>
  );
}

const WEATHER_COLOR: Record<WeatherId, string> = {
  dry: colors.dry,
  'light-rain': colors.inter,
  'heavy-rain': colors.wet,
};

/** Three tiles marked with the tyre compound colour you would race on. */
export function WeatherPicker({
  selectedId,
  onSelect,
}: {
  selectedId: WeatherId;
  onSelect(id: WeatherId): void;
}) {
  return (
    <View style={styles.weatherRow}>
      {WEATHER.map((w) => {
        const selected = w.id === selectedId;
        return (
          <Pressable
            key={w.id}
            accessibilityRole="radio"
            accessibilityState={{ selected }}
            onPress={() => {
              tap();
              onSelect(w.id);
            }}
            style={[
              styles.weather,
              { borderColor: selected ? WEATHER_COLOR[w.id] : 'transparent' },
            ]}
          >
            <View style={[styles.tyre, { borderColor: WEATHER_COLOR[w.id] }]}>
              <View style={styles.tyreHub} />
            </View>
            <Txt variant="label">{w.label}</Txt>
            <Txt variant="caption" color={colors.muted}>
              {w.hint}
            </Txt>
          </Pressable>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  grid: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between', rowGap: space.sm },
  team: {
    width: '48.5%',
    minHeight: 54,
    borderRadius: radius.chip,
    flexDirection: 'row',
    alignItems: 'center',
    paddingRight: space.md,
    overflow: 'hidden',
  },
  livery: { width: 6, alignSelf: 'stretch', marginRight: space.md },
  teamName: { flex: 1 },

  field: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: space.md,
    backgroundColor: colors.panel,
    borderRadius: radius.chip,
    minHeight: 64,
    paddingHorizontal: space.lg,
  },
  fieldText: { flex: 1 },
  flag: { fontSize: 26, lineHeight: 32 },

  sheet: { flex: 1, backgroundColor: colors.bg, paddingHorizontal: space.lg },
  sheetHead: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  search: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: space.sm,
    backgroundColor: colors.panel,
    borderRadius: radius.chip,
    paddingHorizontal: space.md,
    marginTop: space.md,
    marginBottom: space.sm,
  },
  searchInput: {
    flex: 1,
    height: 48,
    color: colors.text,
    fontFamily: fonts.body,
    fontSize: 16,
  },
  list: { paddingBottom: space.xl, gap: space.sm },
  empty: { paddingVertical: space.xl, textAlign: 'center' },
  trackRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: space.md,
    backgroundColor: colors.panel,
    borderRadius: radius.chip,
    borderWidth: 1.5,
    borderColor: 'transparent',
    minHeight: 60,
    paddingHorizontal: space.md,
  },

  weatherRow: { flexDirection: 'row', gap: space.sm },
  weather: {
    flex: 1,
    backgroundColor: colors.panel,
    borderRadius: radius.chip,
    borderWidth: 1.5,
    paddingVertical: space.md,
    paddingHorizontal: space.sm,
    alignItems: 'center',
    gap: 2,
  },
  tyre: {
    width: 30,
    height: 30,
    borderRadius: 15,
    borderWidth: 5,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: space.sm,
  },
  tyreHub: { width: 8, height: 8, borderRadius: 4, backgroundColor: colors.faint },
});
