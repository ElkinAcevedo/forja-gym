import { ComingSoon } from '@/components/ComingSoon';

// shortcut: provisional hasta la tarea de la pantalla de Registro de esta misma fase.
export default function TrainScreen() {
  return (
    <ComingSoon
      title="Registro"
      phase={1}
      description="Registro rápido de series: precargadas, + / − y ✓ con descanso."
    />
  );
}
