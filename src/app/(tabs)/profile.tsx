import { ScrollView, StyleSheet, Switch, Text } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { Card } from '@/components/Card';
import { SETTING_ICONS } from '@/components/icons/settingIcons';
import { SectionHeader } from '@/components/SectionHeader';
import { Segmented } from '@/components/Segmented';
import { SettingRow } from '@/components/SettingRow';
import { db } from '@/db/client';
import type { TrainingGoal, WeightUnit } from '@/domain/enums';
import { formatScheme, suggestedScheme } from '@/domain/training';
import { INCREMENT_OPTIONS } from '@/domain/units';
import { useFocusData } from '@/hooks/useFocusData';
import { getProfile, getRepSchemes, updateSettings, type SettingsPatch } from '@/services/profile';
import { color, font, space } from '@/theme';

const GOALS: { value: TrainingGoal; label: string; description: string }[] = [
  {
    value: 'strength',
    label: 'Fuerza',
    description: 'Pocas repeticiones y mucho peso. Descansos largos.',
  },
  {
    value: 'hypertrophy',
    label: 'Hipertrofia',
    description: 'Rango medio de repeticiones para ganar músculo.',
  },
  {
    value: 'endurance',
    label: 'Resistencia',
    description: 'Muchas repeticiones con cargas moderadas. Descansos cortos.',
  },
];

const UNITS: { value: WeightUnit; label: string }[] = [
  { value: 'kg', label: 'kg' },
  { value: 'lb', label: 'lb' },
];

const loadProfile = () => ({ profile: getProfile(db), rules: getRepSchemes(db) });

/**
 * Perfil con los ajustes que cambian el comportamiento de la app.
 * shortcut: el resto del perfil (peso corporal, metas, logros, exportar) llega en la Fase 3.
 */
export default function ProfileScreen() {
  const [data, reload] = useFocusData(loadProfile);
  if (!data) return null;
  const { profile, rules } = data;

  const save = (patch: SettingsPatch) => {
    updateSettings(db, patch, new Date());
    reload();
  };

  const goal = GOALS.find((g) => g.value === profile.goal) ?? GOALS[1];
  const compound = formatScheme(suggestedScheme(rules, profile.goal, true));
  const accessory = formatScheme(suggestedScheme(rules, profile.goal, false));
  const unit = profile.unit;

  return (
    <SafeAreaView style={styles.screen} edges={['top']}>
      <ScrollView contentContainerStyle={styles.content}>
        <Text style={styles.title}>Perfil</Text>

        <SectionHeader title="Objetivo de entrenamiento" />
        <Card style={styles.goalCard}>
          <Segmented
            label="Objetivo de entrenamiento"
            variant="full"
            options={GOALS}
            value={profile.goal}
            onChange={(value) => save({ goal: value })}
          />
          <Text style={styles.muted}>
            {goal.description} Las series se ajustan solas: compuestos{' '}
            <Text style={styles.strong}>{compound}</Text>, accesorios{' '}
            <Text style={styles.strong}>{accessory}</Text>.
          </Text>
        </Card>

        <SectionHeader title="Ajustes" />
        <Card style={styles.settings}>
          <SettingRow
            icon={SETTING_ICONS.units}
            title="Unidades"
            description="Todos los pesos de la app">
            <Segmented
              label="Unidades"
              options={UNITS}
              value={unit}
              onChange={(value) => save({ unit: value })}
            />
          </SettingRow>

          <SettingRow
            icon={SETTING_ICONS.increment}
            title="Incremento de peso"
            description={`Lo que suman los botones + / − (${unit})`}>
            <Segmented
              label="Incremento de peso"
              // La opción se guarda como su equivalente en kg (1 / 2.5 / 5).
              options={INCREMENT_OPTIONS.kg.map((kg, i) => ({
                value: kg,
                label: String(INCREMENT_OPTIONS[unit][i]),
              }))}
              value={profile.incrementKg}
              onChange={(value) => save({ incrementKg: value })}
            />
          </SettingRow>

          <SettingRow
            icon={SETTING_ICONS.autofill}
            title="Autollenar series"
            description="Precargar con tu última sesión"
            last>
            <Switch
              accessibilityLabel="Autollenar series"
              value={profile.autofill}
              onValueChange={(value) => save({ autofill: value })}
              trackColor={{ false: color.surface2, true: color.accent }}
              thumbColor={profile.autofill ? color.bg : color.textMuted}
            />
          </SettingRow>
        </Card>

        <Text style={[styles.muted, styles.next]}>
          Peso corporal, metas, logros y exportar tus datos llegan en la Fase 3.
        </Text>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: color.bg },
  content: { padding: space.screen, gap: space.gap, paddingBottom: space.screen * 2 },
  title: { color: color.text, fontSize: font.title, fontWeight: '800', letterSpacing: -0.5 },
  muted: { color: color.textMuted, fontSize: font.caption, lineHeight: 18 },
  strong: { color: color.text, fontWeight: '700' },
  goalCard: { gap: space.md },
  settings: { paddingVertical: space.xs },
  next: { textAlign: 'center', marginTop: space.lg },
});
