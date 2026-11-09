import Ionicons from '@expo/vector-icons/Ionicons';
import { router, useFocusEffect } from 'expo-router';
import { useCallback, useState } from 'react';
import { Alert, FlatList, Pressable, StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Txt } from '../../components/Txt';
import { TEAM_BY_ID } from '../../data/teams';
import { TRACK_BY_ID } from '../../data/tracks';
import { WEATHER_BY_ID } from '../../data/weather';
import type { SetupRecord } from '../../domain/records';
import { recordStore } from '../../services/storage';
import { colors, radius, space } from '../../theme';

function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString(undefined, {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  });
}

export default function SavedScreen() {
  const insets = useSafeAreaInsets();
  const [records, setRecords] = useState<SetupRecord[] | null>(null);

  const load = useCallback(() => {
    recordStore.list().then(setRecords);
  }, []);

  useFocusEffect(load);

  function confirmDelete(record: SetupRecord) {
    const track = TRACK_BY_ID[record.trackId];
    Alert.alert(
      'Delete this setup?',
      `${track?.name ?? 'This setup'} will be removed from this phone. Opening it again will use credits.`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: () => recordStore.remove(record.id).then(load),
        },
      ],
    );
  }

  return (
    <FlatList
      style={styles.fill}
      data={records ?? []}
      keyExtractor={(r) => r.id}
      contentContainerStyle={{
        paddingTop: insets.top + space.lg,
        paddingHorizontal: space.lg,
        paddingBottom: space.xxl,
        gap: space.sm,
        flexGrow: 1,
      }}
      ListHeaderComponent={
        <View style={styles.head}>
          <Txt variant="display">Saved setups</Txt>
          <Txt color={colors.muted} style={styles.lede}>
            Every setup Claude has made for you, kept on this phone.
          </Txt>
        </View>
      }
      ListEmptyComponent={
        records === null ? undefined : (
          <View style={styles.empty}>
            <Txt variant="heading">Nothing saved yet</Txt>
            <Txt color={colors.muted} style={styles.emptyText}>
              Pick a team, a track and the weather on the Setup tab. The result is saved here
              automatically.
            </Txt>
          </View>
        )
      }
      renderItem={({ item }) => {
        const team = TEAM_BY_ID[item.teamId];
        const track = TRACK_BY_ID[item.trackId];
        const weather = WEATHER_BY_ID[item.weather];
        return (
          <View style={styles.card}>
            <Pressable
              accessibilityRole="button"
              accessibilityLabel={`Open ${track?.name} setup for ${team?.short}, ${weather?.label}`}
              onPress={() => router.push(`/setup/${item.id}`)}
              style={styles.cardMain}
            >
              <View style={[styles.livery, { backgroundColor: team?.color ?? colors.faint }]} />
              <Txt style={styles.flag}>{track?.flag}</Txt>
              <View style={styles.cardText}>
                <Txt variant="label" numberOfLines={1}>
                  {track?.name}
                </Txt>
                <Txt variant="small" color={colors.muted} numberOfLines={1}>
                  {team?.short}, {weather?.label}
                </Txt>
                <Txt variant="caption" color={colors.faint}>
                  {formatDate(item.createdAt)}
                </Txt>
              </View>
            </Pressable>
            <Pressable
              accessibilityRole="button"
              accessibilityLabel="Delete setup"
              hitSlop={8}
              onPress={() => confirmDelete(item)}
              style={styles.delete}
            >
              <Ionicons name="trash-outline" size={20} color={colors.faint} />
            </Pressable>
          </View>
        );
      }}
    />
  );
}

const styles = StyleSheet.create({
  fill: { flex: 1, backgroundColor: colors.bg },
  head: { marginBottom: space.md },
  lede: { marginTop: space.sm },
  empty: { paddingVertical: space.xxl },
  emptyText: { marginTop: space.sm, maxWidth: 340 },
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.panel,
    borderRadius: radius.chip,
    overflow: 'hidden',
  },
  cardMain: { flex: 1, flexDirection: 'row', alignItems: 'center', gap: space.md, paddingRight: space.sm },
  livery: { width: 6, alignSelf: 'stretch' },
  flag: { fontSize: 26, lineHeight: 32 },
  cardText: { flex: 1, paddingVertical: space.md, gap: 1 },
  delete: { padding: space.lg },
});
