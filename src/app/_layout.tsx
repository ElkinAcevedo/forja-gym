import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';

import { DatabaseGate } from '@/db/DatabaseGate';
import { color } from '@/theme';

export default function RootLayout() {
  return (
    <>
      <StatusBar style="light" />
      <DatabaseGate>
        <Stack
          screenOptions={{ headerShown: false, contentStyle: { backgroundColor: color.bg } }}
        />
      </DatabaseGate>
    </>
  );
}
