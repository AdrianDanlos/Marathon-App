import React, { useRef, useEffect, useState } from "react";
import asierImg from "@assets/images/asier.jpg";
import hodeiImg from "@assets/images/hodei.jpg";
import joelImg from "@assets/images/joel.jpg";
import adrianImg from "@assets/images/adrian.jpg";
import trackImg from "@assets/images/track.png";
import song from "@assets/audio/song.mp3";
import CountdownTimer from "./countdownTimer/CountdownTimer";
import RunnersGrid from "./runnerGrid/RunnersGrid";
import Motivation from "./motivation/Motivation";
import TrackLink from "./trackLink/TrackLink";
import spinner2Img from "@assets/images/spinner2.png";
import type { StravaRunner } from "../utils/types";

type IntervalType = ReturnType<typeof setInterval> | null;

const CARD_IDS = ["asier", "hodei", "joel", "adrian"];

const MarathonPage: React.FC = () => {
  const audioRef = useRef<HTMLAudioElement>(null);

  const [stravaData, setStravaData] = useState<StravaRunner[] | null>(null);
  const [stravaLoading, setStravaLoading] = useState(true);
  const [totalKm, setTotalKm] = useState<number | null>(null);
  const [totalTime, setTotalTime] = useState<string>("");
  const [fadeInterval, setFadeInterval] = useState<IntervalType>(null);

  // Strava data fetching (stubbed, adjust endpoint as needed)
  useEffect(() => {
    setStravaLoading(true);
    fetch("/api/strava")
      .then((res) => res.json())
      .then((data: unknown) => {
        const activities = (data as { activities: StravaRunner[] }).activities;
        setStravaData(activities);
        setStravaLoading(false);
        // Calculate total km and time
        let totalKm = 0;
        let totalMinutes = 0;
        activities.forEach((item) => {
          const person = Object.values(item)[0];
          if (!person) return;
          totalKm += person.totalKm;
          let timeStr = "";
          if (typeof person.totalTime === "string") {
            timeStr = person.totalTime;
          } else if (
            typeof person.totalTime === "object" &&
            person.totalTime !== null &&
            "time" in person.totalTime
          ) {
            timeStr = person.totalTime.time;
          }
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
      })
      .catch(() => {
        setStravaLoading(false);
        setTotalKm(null);
        setTotalTime("");
      });
  }, []);

  // Audio fade logic
  const handleMapMouseEnter = () => {
    if (fadeInterval) {
      clearInterval(fadeInterval);
      setFadeInterval(null);
    }
    const audio = audioRef.current;
    if (audio) {
      if (audio.paused) {
        audio.volume = 0.7;
        audio.play().catch(() => {});
      } else {
        audio.volume = 0.7;
      }
    }
  };

  const handleMapMouseLeave = () => {
    const audio = audioRef.current;
    if (audio && !audio.paused) {
      const fadeStep = 0.05;
      const interval = setInterval(() => {
        if (audio.volume > fadeStep) {
          audio.volume = Math.max(0, audio.volume - fadeStep);
        } else {
          audio.volume = 0;
          audio.pause();
          audio.currentTime = 0;
          clearInterval(interval);
          setFadeInterval(null);
        }
      }, 30);
      setFadeInterval(interval);
    }
  };

  const images = {
    asier: asierImg,
    hodei: hodeiImg,
    joel: joelImg,
    adrian: adrianImg,
  };

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
          <RunnersGrid
            CARD_IDS={CARD_IDS}
            images={images}
            stravaData={stravaData}
            stravaLoading={stravaLoading}
          />
        </div>
        <Motivation />
        <TrackLink
          trackImg={trackImg}
          handleMapMouseEnter={handleMapMouseEnter}
          handleMapMouseLeave={handleMapMouseLeave}
          audioRef={audioRef}
          song={song}
        />
      </div>
    </div>
  );
};

export default MarathonPage;
