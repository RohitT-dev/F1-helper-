import Ionicons from '@expo/vector-icons/Ionicons';
import { Tabs } from 'expo-router';
import { useSelection } from '../../state/selection';
import { colors, fonts } from '../../theme';

export default function TabsLayout() {
  const { accent } = useSelection();

  function icon(name: keyof typeof Ionicons.glyphMap) {
    return function TabIcon({ focused, size }: { focused: boolean; size: number }) {
      return <Ionicons name={name} size={size} color={focused ? accent : colors.faint} />;
    };
  }

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        sceneStyle: { backgroundColor: colors.bg },
        tabBarActiveTintColor: accent,
        tabBarInactiveTintColor: colors.faint,
        tabBarLabelStyle: { fontFamily: fonts.bodyMedium, fontSize: 12 },
        tabBarStyle: {
          backgroundColor: colors.panel,
          borderTopColor: colors.line,
        },
      }}
    >
      <Tabs.Screen name="index" options={{ title: 'Setup', tabBarIcon: icon('speedometer-outline') }} />
      <Tabs.Screen name="saved" options={{ title: 'Saved', tabBarIcon: icon('bookmark-outline') }} />
      <Tabs.Screen name="settings" options={{ title: 'Settings', tabBarIcon: icon('settings-outline') }} />
    </Tabs>
  );
}
