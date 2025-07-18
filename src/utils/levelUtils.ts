import { STRINGS } from "./strings";

export type LevelInfo = {
  level: number;
  progress: number;
  nextLevelKm: number;
  currentLevelKm: number;
  levelName: string;
  kmInCurrentLevel: number;
  kmNeededForLevel: number;
  totalKm: number;
};

export const getLevelInfo = (km: number): LevelInfo => {
  const base = 5;
  const factor = 1.1;
  let level = 1;
  let currentLevelKm = 0;
  let nextLevelKm = base;
  let increment = base;

  // Cumulative sum for nextLevelKm
  while (km >= nextLevelKm) {
    level++;
    currentLevelKm = nextLevelKm;
    increment = Math.round(base * Math.pow(factor, level - 1));
    nextLevelKm += increment;
  }

  const kmInCurrentLevel = km - currentLevelKm;
  const kmNeededForLevel = nextLevelKm - currentLevelKm;
  const progress = (kmInCurrentLevel / kmNeededForLevel) * 100;

  return {
    level,
    progress: Math.max(0, Math.min(progress, 100)),
    nextLevelKm,
    currentLevelKm,
    kmInCurrentLevel: Math.round(kmInCurrentLevel * 100) / 100,
    kmNeededForLevel: Math.round(kmNeededForLevel * 100) / 100,
    levelName: getLevelName(level),
    totalKm: km,
  };
};

export const runnerLevelNames = [
  "Teleadicto Sedentario", // Level 1
  "Paseante Dominguero", // Level 2
  "Arrastra Pies", // Level 3
  "Caminante de Barrio", // Level 4
  "Trotecito Ocasional", // Level 5
  "Corredor de Parque", // Level 6
  "Atleta de Banqueta", // Level 7
  "Explorador de Senderos", // Level 8
  "Principiante Persistente", // Level 9
  "Trotador Constante", // Level 10
  "Corredor Consistente", // Level 11
  "Maestro del Ritmo", // Level 12
  "Explorador de Resistencia", // Level 13
  "Devorador de Kilómetros", // Level 14
  "Impulsor de Velocidad", // Level 15
  "Dominador de Rutas", // Level 16
  "Destructor de Distancias", // Level 17
  "Demonio Veloz", // Level 18
  "Asesino del Asfalto", // Level 19
  "Guerrero del Pavimento", // Level 20
  "Depredador de Pistas", // Level 21
  "Máquina Maratoniana", // Level 22
  "Bestia Ultra", // Level 23
  "Titán de Resistencia", // Level 24
  "Fenómeno Corredor", // Level 25
  "Virtuoso de la Velocidad", // Level 26
  "Genio de las Distancias", // Level 27
  "Locomotora Legendaria", // Level 28
  "Millas Míticas", // Level 29
  "Entidad Épica de Resistencia", // Level 30
  "Velocista Sobrehumano", // Level 31
  "Gacela Divina", // Level 32
  "Ironman Inmortal", // Level 33
  "Rayo Celestial", // Level 34
  "Deidad de Distancias", // Level 35
  "Olímpico Omnipotente", // Level 36
  "Tornado Trascendente", // Level 37
  "Universo Imparable", // Level 38
  "Dios de Velocidad Infinita", // Level 39
  "Corredor Cuántico", // Level 40
];

const getLevelName = (level: number): string =>
  runnerLevelNames[level - 1] || STRINGS.MAX_LEVEL;
