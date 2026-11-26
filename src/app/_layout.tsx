import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';

import { MigrationGate } from '@/db/MigrationGate';
import { color } from '@/theme';

export default function RootLayout() {
  return (
    <>
      <StatusBar style="light" />
      <MigrationGate>
        <Stack
          screenOptions={{ headerShown: false, contentStyle: { backgroundColor: color.bg } }}
        />
      </MigrationGate>
    </>
  );
}
