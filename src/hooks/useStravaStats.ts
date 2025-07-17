import { useEffect, useState } from "react";
import type { AthleteData, Athlete } from "../utils/types";

type StravaApiResponse = {
  activities: {
    [username: string]: AthleteData;
  }[];
};

export function useStravaStats() {
  const [stravaData, setStravaData] = useState<Athlete[] | null>(null);
  const [stravaLoading, setStravaLoading] = useState(true);
  const [totalKm, setTotalKm] = useState<number | null>(null);
  const [totalTime, setTotalTime] = useState<string>("");

  useEffect(() => {
    const fetchStravaData = async () => {
      try {
        const res = await fetch("/api/strava");
        const data: StravaApiResponse = await res.json();
        const { activities } = data;

        setStravaData(activities);

        // Calculate totals
        const totals = activities.reduce(
          (acc, item) => {
            const person = Object.values(item)[0];
            acc.km += person.totalKm;

            // Parse time string (e.g., "1h 30m")
            const hours = parseInt(
              person.totalTime.match(/(\d+)h/)?.[1] || "0",
              10
            );
            const minutes = parseInt(
              person.totalTime.match(/(\d+)m/)?.[1] || "0",
              10
            );
            acc.minutes += hours * 60 + minutes;

            return acc;
          },
          { km: 0, minutes: 0 }
        );
        setTotalKm(Number(totals.km.toFixed(2)));
        setTotalTime(
          `${Math.floor(totals.minutes / 60)}h ${totals.minutes % 60}m`
        );
      } catch (error) {
        console.error("Error fetching Strava data:", error);
        setTotalKm(null);
        setTotalTime("");
      } finally {
        setStravaLoading(false);
      }
    };

    fetchStravaData();
  }, []);

  return { stravaData, stravaLoading, totalKm, totalTime };
}
