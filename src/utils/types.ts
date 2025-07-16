export type StravaPerson = {
  totalKm: number;
  totalTime: { time: string } | string;
};
export type StravaRunner = { [key: string]: StravaPerson };
