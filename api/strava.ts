import { AthleteData } from "../src/utils/types";

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
}

interface AthleteResult {
  [athleteName: string]: AthleteData;
}

interface AthleteTokens {
  [key: string]: string;
}

// This is a Vercel serverless function that fetches data from the Strava API. Vercel reads the default export function and runs it as a serverless function.
export default async function handler(req: any, res: any): Promise<void> {
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

  res.status(200).json({
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
