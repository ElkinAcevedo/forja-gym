import { ComingSoon } from '@/components/ComingSoon';

// shortcut: los ajustes básicos llegan en esta Fase 1; el perfil completo en la Fase 3.
export default function ProfileScreen() {
  return (
    <ComingSoon
      title="Perfil"
      phase={3}
      description="Tus datos, peso corporal, objetivo, metas, logros y ajustes."
    />
  );
}
