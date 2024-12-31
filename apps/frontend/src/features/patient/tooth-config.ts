export interface ToothPartConfig {
  name: string;
  color: string;
  opacity?: number;
  visible?: boolean;
}

export interface ToothConfig {
  parts: ToothPartConfig[];
  position?: [number, number, number];
  rotation?: [number, number, number];
  scale?: [number, number, number];
}

export const defaultToothConfig: ToothConfig = {
  parts: [
    {
      name: 'Buildup',
      color: '#e8d9c0', // ivory/bone color
      opacity: 1,
      visible: true,
    },
    {
      name: 'Cementum',
      color: '#d4c4a8', // slightly darker ivory
      opacity: 1,
      visible: true,
    },
    {
      name: 'Enamel2',
      color: '#f2f2f2', // white/off-white
      opacity: 1,
      visible: true,
    },
    {
      name: 'L', // Lingual surface
      color: '#e8e8e8',
      opacity: 1,
      visible: true,
    },
    {
      name: 'V', // Vestibular/Facial surface
      color: '#e8e8e8',
      opacity: 1,
      visible: true,
    },
  ],
  position: [0, 0, 0],
  rotation: [0, 0, 0],
  scale: [1, 1, 1],
};
