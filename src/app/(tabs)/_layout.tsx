import { Tabs } from 'expo-router';
import { StyleSheet, type ColorValue } from 'react-native';

import { NavIcon, type NavIconName } from '@/components/icons/NavIcon';
import { TrainTabButton } from '@/components/TrainTabButton';
import { color } from '@/theme';

const ICON_SIZE = 24;

/** Ícono de una pestaña; recibe el color activo o inactivo que decide la barra. */
const tabIcon = (name: NavIconName) =>
  function TabIcon({ color: tint }: { color: ColorValue }) {
    return <NavIcon name={name} size={ICON_SIZE} color={tint} />;
  };

/** Barra inferior: Inicio · Rutinas · [+ Entrenar] · Progreso · Perfil. */
export default function TabsLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: color.accent,
        tabBarInactiveTintColor: color.textMuted,
        tabBarStyle: styles.bar,
        tabBarLabelStyle: styles.label,
        sceneStyle: { backgroundColor: color.bg },
      }}>
      <Tabs.Screen name="index" options={{ title: 'Inicio', tabBarIcon: tabIcon('home') }} />
      <Tabs.Screen
        name="routines"
        options={{ title: 'Rutinas', tabBarIcon: tabIcon('routines') }}
      />
      <Tabs.Screen
        name="train"
        options={{
          title: 'Entrenar',
          tabBarButton: ({ onPress }) => <TrainTabButton onPress={onPress} />,
        }}
      />
      <Tabs.Screen
        name="progress"
        options={{ title: 'Progreso', tabBarIcon: tabIcon('progress') }}
      />
      <Tabs.Screen name="profile" options={{ title: 'Perfil', tabBarIcon: tabIcon('profile') }} />
    </Tabs>
  );
}

const styles = StyleSheet.create({
  bar: { backgroundColor: color.bg, borderTopColor: color.line },
  label: { fontSize: 11 },
});
