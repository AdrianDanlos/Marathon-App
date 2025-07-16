import type { Athlete, AthleteData } from "./types";

// Utility function for stats lookup
export const getRunnerStats = (
  stravaData: Athlete[] | null,
  id: string
) => {
  return stravaData?.find((item) => Object.keys(item)[0] === id)?.[id] as AthleteData;
};
