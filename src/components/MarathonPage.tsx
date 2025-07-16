import React, { useEffect, useState } from "react";
import trackImg from "@assets/images/track.png";
import CountdownTimer from "./countdownTimer/CountdownTimer";
import RunnersGrid from "./runnerGrid/RunnersGrid";
import Motivation from "./motivation/Motivation";
import TrackLink from "./trackLink/TrackLink";
import spinner2Img from "@assets/images/spinner2.png";
import type { AthleteData, Athlete } from "../utils/types";

const MarathonPage: React.FC = () => {
  const [stravaData, setStravaData] = useState<Athlete[] | null>(null);
  const [stravaLoading, setStravaLoading] = useState(true);
  const [totalKm, setTotalKm] = useState<number | null>(null);
  const [totalTime, setTotalTime] = useState<string>("");

  useEffect(() => {
    setStravaLoading(true);
    fetch("/api/strava")
      .then((res) => res.json())
      .then(
        (data: {
          activities: {
            [username: string]: AthleteData;
          }[];
        }) => {
          const { activities } = data;
          setStravaData(activities);
          setStravaLoading(false);
          // Calculate total km and time
          let totalKm = 0;
          let totalMinutes = 0;
          activities.forEach((item) => {
            const person = Object.values(item)[0];
            totalKm += person.totalKm;
            const timeStr = person.totalTime;
            const hoursStr = (timeStr.match(/(\d+)h/) || ["0", "0"])[1];
            const minutesStr = (timeStr.match(/(\d+)m/) || ["0", "0"])[1];
            totalMinutes +=
              parseInt(hoursStr, 10) * 60 + parseInt(minutesStr, 10);
          });
          totalKm = Math.round(totalKm * 100) / 100;
          const totalHours = Math.floor(totalMinutes / 60);
          const remainingMinutes = totalMinutes % 60;
          const totalTime = `${totalHours}h ${remainingMinutes}m`;
          setTotalKm(totalKm);
          setTotalTime(totalTime);
        }
      )
      .catch(() => {
        setStravaLoading(false);
        setTotalKm(null);
        setTotalTime("");
      });
  }, []);

  return (
    <div className="container" style={{ position: "relative" }}>
      <div className="content">
        <h1 className="title">{"BARCELONA MARATHON 2026!"}</h1>
        <div className="subtitle">{"4 Runners. 42.195km. 1 Destiny"}</div>
        <div className="section-spacing">
          <div id="total-km-combined">
            {stravaLoading ? (
              <img src={spinner2Img} alt="Loading..." className="spinner-img" />
            ) : (
              <>
                {totalKm !== null && (
                  <span className="total-distance">{totalKm} KM</span>
                )}
                {totalTime && <span className="total-time">{totalTime}</span>}
              </>
            )}
          </div>
        </div>
        <div className="section-spacing">
          <CountdownTimer />
        </div>
        <div className="section-spacing">
          <RunnersGrid stravaData={stravaData} stravaLoading={stravaLoading} />
        </div>
        <Motivation />
        <TrackLink trackImg={trackImg} />
      </div>
    </div>
  );
};

export default MarathonPage;
