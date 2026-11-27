import { Modal, Pressable, StyleSheet, Text, View } from 'react-native';

import { color, font, radius, space } from '@/theme';

import { Button } from './Button';

type Props = {
  visible: boolean;
  title: string;
  message?: string;
  confirmTitle: string;
  onConfirm: () => void;
  onCancel: () => void;
};

/**
 * Pregunta de confirmación con el estilo de la app, en lugar del `Alert` del sistema, que no
 * sigue la paleta. Tocar fuera equivale a cancelar.
 */
export function ConfirmDialog({
  visible,
  title,
  message,
  confirmTitle,
  onConfirm,
  onCancel,
}: Props) {
  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={onCancel}>
      <View style={styles.backdrop}>
        <Pressable
          style={StyleSheet.absoluteFill}
          onPress={onCancel}
          accessibilityLabel="Cancelar"
        />
        <View style={styles.card} accessibilityViewIsModal>
          <Text style={styles.title}>{title}</Text>
          {message && <Text style={styles.message}>{message}</Text>}
          <View style={styles.actions}>
            <View style={styles.action}>
              <Button title="Cancelar" variant="secondary" onPress={onCancel} />
            </View>
            <View style={styles.action}>
              <Button title={confirmTitle} variant="primary" onPress={onConfirm} />
            </View>
          </View>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    justifyContent: 'center',
    padding: space.screen,
    backgroundColor: 'rgba(0,0,0,0.6)',
  },
  card: {
    gap: space.md,
    padding: space.screen,
    borderRadius: radius.card,
    borderWidth: 1,
    borderColor: color.line,
    backgroundColor: color.surface1,
  },
  title: { color: color.text, fontSize: font.heading, fontWeight: '800' },
  message: { color: color.textMuted, fontSize: font.body },
  actions: { flexDirection: 'row', gap: space.gap, marginTop: space.sm },
  action: { flex: 1 },
});
