import { AthleteData } from "../src/utils/types";
import { badges } from "../src/utils/badges.js";

const envVariables = {
  client_id: process.env.STRAVA_CLIENT_ID,
  client_secret: process.env.STRAVA_CLIENT_SECRET,
  refresh_token_adrian: process.env.STRAVA_REFRESH_TOKEN_ADRIAN,
  refresh_token_joel: process.env.STRAVA_REFRESH_TOKEN_JOEL,
  refresh_token_asier: process.env.STRAVA_REFRESH_TOKEN_ASIER,
  refresh_token_hodei: process.env.STRAVA_REFRESH_TOKEN_HODEI,
};

// Type definitions
interface StravaTokenResponse {
  access_token: string;
  refresh_token: string;
  expires_at: number;
  token_type: string;
}

interface StravaActivity {
  id: number;
  name: string;
  type: string;
  distance: number;
  moving_time: number;
  elapsed_time: number;
  start_date: string;
  average_speed: number;
  max_speed: number;
  kudos_count: number;
  comment_count: number;
  athlete_count: number;
  photo_count: number;
  map: {
    id: string;
    summary_polyline: string;
    resource_state: number;
  };
  trainer: boolean;
  commute: boolean;
  manual: boolean;
  private: boolean;
  flagged: boolean;
  gear_id: string | null;
  from_accepted_tag: boolean;
  upload_id: number;
  external_id: string;
  visibility: string;
  heartrate_opt_out: boolean;
  display_hide_heartrate_option: boolean;
  elev_high: number;
  elev_low: number;
  pr_count: number;
  total_photo_count: number;
  has_heartrate: boolean;
  average_heartrate: number;
  max_heartrate: number;
  workout_type: number;
  suffer_score: number;
  start_date_local: string;
  total_elevation_gain: number;
}

interface AthleteResult {
  [athleteName: string]: AthleteData;
}

interface AthleteTokens {
  [key: string]: string;
}

// This is a Vercel serverless function that fetches data from the Strava API. Vercel reads the default export function and runs it as a serverless function.
export default async function handler(
  req: unknown,
  res: unknown
): Promise<void> {
  /* INSTRUCTIONS TO ALLOW STRAVA TO ACCESS USER DATA
  const redirect_uri = process.env.STRAVA_REDIRECT_URI;
  // Every user we want to gather data for should visit this URL to authorize the app and then send us the CODE from the generated URL
  const auth = `https://www.strava.com/oauth/authorize?client_id=${client_id}&response_type=code&redirect_uri=${encodeURIComponent(
    redirect_uri
  )}&approval_prompt=force&scope=activity:read_all`;
  //Afterwards we can use the code to get the refresh token for that user by running a curl request with the correct code
  curl -X POST https://www.strava.com/api/v3/oauth/token -d client_id=167611 -d client_secret=9b1e9971a91ede4d0e5f5e3808bd9c783162d1f5 -d code=8c04f3d3ff90443eaec4aa1d9bbc57e690e8c56e -d grant_type=authorization_code
  // Retrieve the refresh token from the response and add it to your environment variables for that specific user
  */

  const {
    client_id,
    client_secret,
    refresh_token_adrian,
    refresh_token_joel,
    refresh_token_asier,
    refresh_token_hodei,
  } = envVariables;

  const athleteTokens: AthleteTokens = {
    adrian: refresh_token_adrian as string,
    joel: refresh_token_joel as string,
    asier: refresh_token_asier as string,
    hodei: refresh_token_hodei as string,
  };

  // Add type assertion for res where needed
  const response = res as {
    status: (code: number) => { json: (body: unknown) => void };
  };

  // Create an async function to process each athlete
  const processAthlete = async ([athleteName, token]: [
    string,
    string
  ]): Promise<AthleteResult | null> => {
    try {
      if (!token) {
        console.error(`No refresh token found for ${athleteName}`);
        return null; // Return null instead of continuing
      }

      // Get a new access token
      const tokenRes = await fetch(
        `https://www.strava.com/api/v3/oauth/token?client_id=${client_id}&client_secret=${client_secret}&refresh_token=${token}&grant_type=refresh_token`,
        { method: "POST" }
      );

      // Check if the response is ok and is JSON
      if (!tokenRes.ok) {
        console.error(
          `Token refresh failed for ${athleteName}:`,
          tokenRes.status,
          tokenRes.statusText
        );
        return null; // Return null instead of continuing
      }

      const tokenData: StravaTokenResponse = await tokenRes.json();
      const access_token = tokenData.access_token;

      if (!access_token) {
        console.error(`No access token received for ${athleteName}`);
        return null;
      }

      // Fetch your latest activities
      const activitiesRes = await fetch(
        //TODO: If you want to fetch more than 200 activities, you can use the page parameter to paginate through results
        "https://www.strava.com/api/v3/athlete/activities?per_page=200",
        { headers: { Authorization: `Bearer ${access_token}` } }
      );

      if (!activitiesRes.ok) {
        console.error(
          `Activities fetch failed for ${athleteName}:`,
          activitiesRes.status,
          activitiesRes.statusText
        );
        return null;
      }

      const result: StravaActivity[] = await activitiesRes.json();
      const activities = getActivitiesSinceJune(result);

      return {
        [athleteName]: {
          totalKm: getTotalKm(activities),
          totalTime: getTotalTime(activities),
          longestRun: getLongestRunEver(activities),
          fastestPace: getFastestPaceEver(activities),
          badges: getBadges(activities),
        },
      };
    } catch (error) {
      console.error(`Error processing ${athleteName}:`, error);
      return null; // Return null on error
    }
  };

  // Run all athlete processing in parallel
  const athletePromises = Object.entries(athleteTokens).map(processAthlete);
  const results = await Promise.all(athletePromises);

  // Filter out null results (failed requests)
  const activities = results.filter(
    (result): result is AthleteResult => result !== null
  );

  response.status(200).json({
    activities,
  });
}

const getTotalKm = (activities: StravaActivity[]): number => {
  const totalKm = activities.reduce((sum, act) => sum + act.distance / 1000, 0);
  return Math.round(totalKm * 100) / 100;
};

const getTotalTime = (activities: StravaActivity[]): string => {
  const totalSeconds = activities.reduce(
    (sum, act) => sum + act.moving_time,
    0
  );
  // Convert seconds to hours, minutes, seconds
  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  return `${hours}h ${minutes}m`;
};

const getActivitiesSinceJune = (
  activities: StravaActivity[]
): StravaActivity[] => {
  const now = new Date();
  const year = now.getFullYear();
  const juneFirst = new Date(`${year}-06-01T00:00:00Z`);
  return activities.filter(
    (act) => act.type === "Run" && new Date(act.start_date) >= juneFirst
  );
};

// Returns the longest run ever (in km)
const getLongestRunEver = (activities: StravaActivity[]): number => {
  const runs = activities.filter((act) => act.type === "Run");
  if (runs.length === 0) return 0;
  const longest = runs.reduce(
    (max, act) => (act.distance > max.distance ? act : max),
    runs[0]
  );
  return Math.round((longest.distance / 1000) * 100) / 100; // km
};

// Returns the fastest pace ever (min/km)
const getFastestPaceEver = (activities: StravaActivity[]): number => {
  const runs = activities.filter(
    (act) => act.type === "Run" && act.distance > 0 && act.moving_time > 0
  );
  if (runs.length === 0) return 0;
  // pace in min/km = (moving_time in seconds) / (distance in meters) * 1000 / 60
  const paces = runs.map((act) => act.moving_time / (act.distance / 1000) / 60); // min/km
  const fastest = Math.min(...paces);
  return Math.round(fastest * 100) / 100;
};

const getBadges = (runs: StravaActivity[]): string[] => {
  const badgeResults: string[] = [];

  // Early Bird: any run started between 3:00 AM and 8:00 AM (local time)
  if (
    runs.some((run) => {
      const hour = new Date(run.start_date_local || run.start_date).getHours();
      return hour >= 3 && hour < 8;
    })
  ) {
    badgeResults.push(badges.earlyBird.key);
  }

  // Night Owl: any run started after 10:00 PM (local time)
  if (
    runs.some((act) => {
      const d = new Date(act.start_date_local || act.start_date);
      return d.getHours() >= 22;
    })
  ) {
    badgeResults.push(badges.nightOwl.key);
  }

  // Marathon Milestone: total distance ever >= 42.195 km
  const totalKmEver = runs.reduce((sum, act) => sum + act.distance / 1000, 0);
  if (totalKmEver >= 42.195) {
    badgeResults.push(badges.marathonMilestone.key);
  }

  // Half Marathon Race: any run >= 21 km in a session
  if (runs.some((act) => act.distance / 1000 >= 21)) {
    badgeResults.push(badges.halfMarathonRace.key);
  }

  // Marathon Race: any run >= 42 km in a session
  if (runs.some((act) => act.distance / 1000 >= 42)) {
    badgeResults.push(badges.marathonRace.key);
  }

  // Climber: any run with total_elevation_gain >= 200m
  if (
    runs.some(
      (act) => act.total_elevation_gain && act.total_elevation_gain >= 200
    )
  ) {
    badgeResults.push(badges.climber.key);
  }

  // Consistency King: ran on 5 different days in a single week
  if (
    (() => {
      const weekMap: Record<string, Set<string>> = {};
      runs.forEach((act) => {
        const d = new Date(act.start_date_local || act.start_date);
        const year = d.getFullYear();
        const week = getWeekNumber(d);
        const key = `${year}-W${week}`;
        if (!weekMap[key]) weekMap[key] = new Set();
        weekMap[key].add(d.toDateString());
      });
      return Object.values(weekMap).some((days) => days.size >= 5);
    })()
  ) {
    badgeResults.push(badges.consistencyKing.key);
  }

  // Monthly Ultramaraton: 100km in a single calendar month
  if (
    (() => {
      const monthMap: Record<string, number> = {};
      runs.forEach((act) => {
        const d = new Date(act.start_date_local || act.start_date);
        const key = `${d.getFullYear()}-${d.getMonth()}`;
        monthMap[key] = (monthMap[key] || 0) + act.distance / 1000;
      });
      return Object.values(monthMap).some((km) => km >= 100);
    })()
  ) {
    badgeResults.push(badges.monthlyUltramaraton.key);
  }

  // Sunset Chaser: finished a run between 7–9 PM (local time)
  if (
    runs.some((act) => {
      const start = new Date(act.start_date_local || act.start_date);
      const end = new Date(start.getTime() + act.moving_time * 1000);
      const hour = end.getHours();
      return hour >= 19 && hour < 21;
    })
  ) {
    badgeResults.push(badges.sunsetChaser.key);
  }

  // Weekend Warrior: ran on both Saturday and Sunday in the same weekend
  if (
    (() => {
      const weekMap: Record<string, Set<number>> = {};
      runs.forEach((act) => {
        const d = new Date(act.start_date_local || act.start_date);
        const year = d.getFullYear();
        const week = getWeekNumber(d);
        const key = `${year}-W${week}`;
        if (!weekMap[key]) weekMap[key] = new Set();
        weekMap[key].add(d.getDay());
      });
      return Object.values(weekMap).some((days) => days.has(0) && days.has(6));
    })()
  ) {
    badgeResults.push(badges.weekendWarrior.key);
  }

  // Continental Cruiser: total distance ever >= 500 km
  if (totalKmEver >= 500) {
    badgeResults.push(badges.continentalCruiser.key);
  }

  // Transcontinental Titan: total distance ever >= 1000 km
  if (totalKmEver >= 1000) {
    badgeResults.push(badges.transcontinentalTitan.key);
  }

  // Helper: get ISO week number
  function getWeekNumber(d: Date) {
    d = new Date(Date.UTC(d.getFullYear(), d.getMonth(), d.getDate()));
    const dayNum = d.getUTCDay() || 7;
    d.setUTCDate(d.getUTCDate() + 4 - dayNum);
    const yearStart = new Date(Date.UTC(d.getUTCFullYear(), 0, 1));
    return Math.ceil(((d.getTime() - yearStart.getTime()) / 86400000 + 1) / 7);
  }

  return badgeResults;
};
