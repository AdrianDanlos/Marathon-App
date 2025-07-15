import React, { useRef, useEffect, useState } from "react";
import "./../index.css";
import asierImg from "./../assets/images/asier.jpg";
import hodeiImg from "./../assets/images/hodei.jpg";
import joelImg from "./../assets/images/joel.jpg";
import adrianImg from "./../assets/images/adrian.jpg";
import stravaImg from "./../assets/images/strava.png";
import trackImg from "./../assets/images/track.png";
import song from "./../assets/audio/song.mp3";
import CountdownTimer from "./countdownTimer/CountdownTimer";
import Sparkles from "./sparkles/Sparkles";
import RunnersGrid from "./runnerGrid/RunnersGrid";
import Motivation from "./motivation/Motivation";
import TrackLink from "./trackLink/TrackLink";

const TARGET_DATE = new Date("March 16, 2026 00:00:00").getTime();
const CARD_IDS = ["adrian", "asier", "hodei", "joel"];
const MOTIVATIONAL_MESSAGES = [
  "You've got this! 🚀",
  "Stay strong! 💪",
  "Keep pushing! 🔥",
  "You're unstoppable! ⚡",
  "Dream big! 🏆",
  "You're a champion! 🏃‍♂️",
];

const getRandomPercent = () => `${Math.random() * 100}%`;

type StravaPerson = {
  totalKm: number;
  totalTime: { time: string } | string;
};
type StravaRunner = { [key: string]: StravaPerson };

type CountdownState = {
  days: string;
  hours: string;
  minutes: string;
  seconds: string;
  isMarathonDay: boolean;
};

type Sparkle = { id: number; left: string; top: string };

type IntervalType = ReturnType<typeof setInterval> | null;

const MarathonPage: React.FC = () => {
  const audioRef = useRef<HTMLAudioElement>(null);
  const [countdown, setCountdown] = useState<CountdownState>({
    days: "00",
    hours: "00",
    minutes: "00",
    seconds: "00",
    isMarathonDay: false,
  });
  const [motivationIndex, setMotivationIndex] = useState(0);
  const [sparkles, setSparkles] = useState<Sparkle[]>([]);
  const [stravaData, setStravaData] = useState<StravaRunner[] | null>(null);
  const [stravaLoading, setStravaLoading] = useState(true);
  const [totalKmCombined, setTotalKmCombined] =
    useState<string>("Total: Loading");
  const [fadeInterval, setFadeInterval] = useState<IntervalType>(null);
  const sparkleId = useRef(0);

  // Countdown timer
  useEffect(() => {
    const interval = setInterval(() => {
      const now = Date.now();
      const distance = TARGET_DATE - now;
      if (distance < 0) {
        setCountdown((prev) => ({ ...prev, isMarathonDay: true }));
        clearInterval(interval);
        return;
      }
      setCountdown({
        days: String(Math.floor(distance / (1000 * 60 * 60 * 24))).padStart(
          2,
          "0"
        ),
        hours: String(
          Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60))
        ).padStart(2, "0"),
        minutes: String(
          Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60))
        ).padStart(2, "0"),
        seconds: String(Math.floor((distance % (1000 * 60)) / 1000)).padStart(
          2,
          "0"
        ),
        isMarathonDay: false,
      });
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  // Motivational message cycling
  useEffect(() => {
    const interval = setInterval(() => {
      setMotivationIndex((prev) => (prev + 1) % MOTIVATIONAL_MESSAGES.length);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  // Sparkle effect
  useEffect(() => {
    const interval = setInterval(() => {
      sparkleId.current += 1;
      setSparkles((prev) => [
        ...prev,
        {
          id: sparkleId.current,
          left: getRandomPercent(),
          top: getRandomPercent(),
        },
      ]);
      setTimeout(() => {
        setSparkles((prev) => prev.slice(1));
      }, 2000);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

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
        setTotalKmCombined(
          `<span class="total-distance">${totalKm} KM</span> <span class="total-time">${totalTime}</span>`
        );
      })
      .catch(() => {
        setStravaLoading(false);
        setTotalKmCombined("Total: Error");
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

  // Interactive click effect for countdown items
  const handleCountdownClick = (e: React.MouseEvent<HTMLDivElement>) => {
    const el = e.currentTarget;
    el.style.transform = "scale(0.95)";
    setTimeout(() => {
      el.style.transform = "scale(1)";
    }, 150);
  };

  // Marathon day content
  const isMarathonDay = countdown.isMarathonDay;
  const motivationalMessage = isMarathonDay
    ? "Let's do this! 🚀"
    : MOTIVATIONAL_MESSAGES[motivationIndex];
  const friendsMention = isMarathonDay
    ? "Time to show what you're made of! 🏆"
    : "Shoutout to the marathon squad! Let's make this epic!";

  const images = {
    asier: asierImg,
    hodei: hodeiImg,
    joel: joelImg,
    adrian: adrianImg,
  };

  return (
    <div className="container" style={{ position: "relative" }}>
      <Sparkles sparkles={sparkles} />
      <div className="content">
        <h1 className="title">
          {isMarathonDay ? "IT'S MARATHON DAY! 🏃‍♂️" : "BARCELONA MARATHON 2026!"}
        </h1>
        <div className="subtitle">
          {isMarathonDay
            ? "Go crush it! You've got this! 💪"
            : "4 Runners. 42.195km. 1 Destiny"}
        </div>
        <div
          id="total-km-combined"
          dangerouslySetInnerHTML={{ __html: totalKmCombined }}
        />
        <CountdownTimer
          countdown={countdown}
          isMarathonDay={isMarathonDay}
          onCountdownClick={handleCountdownClick}
        />
        <RunnersGrid
          CARD_IDS={CARD_IDS}
          images={images}
          stravaData={stravaData}
          stravaLoading={stravaLoading}
          stravaImg={stravaImg}
        />
        <Motivation
          isMarathonDay={isMarathonDay}
          motivationalMessage={motivationalMessage}
          friendsMention={friendsMention}
        />
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
