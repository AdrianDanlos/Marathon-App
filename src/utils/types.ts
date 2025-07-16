export type Athlete = { [key: string]: AthleteData };

export interface AthleteData {
  totalKm: number;
  fastestPace: number;
  longestRun: number;
  totalTime: string;
  badges: string[];
}
