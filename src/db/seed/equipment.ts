/** Tipos de equipo. `icon` es la clave del ícono que dibuja la interfaz. */
export const EQUIPMENT = [
  { id: 'barra', name: 'Barra', icon: 'barra' },
  { id: 'mancuernas', name: 'Mancuernas', icon: 'mancuernas' },
  { id: 'maquina', name: 'Máquina', icon: 'maquina' },
  { id: 'polea', name: 'Polea', icon: 'polea' },
  { id: 'corporal', name: 'Peso corporal', icon: 'corporal' },
] as const;

export type EquipmentId = (typeof EQUIPMENT)[number]['id'];
