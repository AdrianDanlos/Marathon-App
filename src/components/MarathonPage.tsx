import React, { useRef, useEffect, useState } from "react";
import "./../index.css"; // FIXME: Break it down in components
import asierImg from "./../assets/images/asier.jpg";
import hodeiImg from "./../assets/images/hodei.jpg";
import joelImg from "./../assets/images/joel.jpg";
import adrianImg from "./../assets/images/adrian.jpg";
import stravaImg from "./../assets/images/strava.png";
import trackImg from "./../assets/images/track.png";
import song from "./../assets/audio/song.mp3";

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

// Helper for sparkle
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
        console.log('data :>> ', data);
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

  return (
    <div className="container" style={{ position: "relative" }}>
      {/* Sparkles */}
      {sparkles.map((sparkle) => (
        <div
          key={sparkle.id}
          style={{
            position: "absolute",
            left: sparkle.left,
            top: sparkle.top,
            fontSize: "1rem",
            opacity: 0.8,
            pointerEvents: "none",
            zIndex: 5,
            animation: "sparkle 2s ease-out forwards",
          }}
        >
          ✨
        </div>
      ))}
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
        <div className="countdown-container">
          <div className="countdown">
            {(["days", "hours", "minutes", "seconds"] as const).map((unit) => (
              <React.Fragment key={unit}>
                <div className="countdown-item" onClick={handleCountdownClick}>
                  <div className="countdown-number" id={unit}>
                    {countdown[unit]}
                  </div>
                  <div className="countdown-label">
                    {unit.charAt(0).toUpperCase() + unit.slice(1)}
                  </div>
                </div>
                {unit !== "seconds" && (
                  <div className="countdown-separator">:</div>
                )}
              </React.Fragment>
            ))}
          </div>
        </div>
        <div className="runners-section">
          <div className="runners-grid">
            {CARD_IDS.map((cardId) => {
              const img =
                cardId === "asier"
                  ? asierImg
                  : cardId === "hodei"
                  ? hodeiImg
                  : cardId === "joel"
                  ? joelImg
                  : adrianImg;
              const stravaUrl =
                cardId === "asier"
                  ? "https://www.strava.com/athletes/21162116"
                  : cardId === "hodei"
                  ? "https://www.strava.com/athletes/172716857"
                  : cardId === "joel"
                  ? "https://www.strava.com/athletes/120181216"
                  : "https://www.strava.com/athletes/71606225";
              // Strava data for this runner
              let runnerKm: number | null = null;
              let runnerTime: string | null = null;
              if (stravaData) {
                const runnerObj = stravaData.find(
                  (item) => Object.keys(item)[0] === cardId
                );
                if (runnerObj) {
                  const person = Object.values(runnerObj)[0];
                  if (person) {
                    runnerKm = person.totalKm;
                    if (typeof person.totalTime === "string") {
                      runnerTime = person.totalTime;
                    } else if (
                      typeof person.totalTime === "object" &&
                      person.totalTime !== null &&
                      "time" in person.totalTime
                    ) {
                      runnerTime = person.totalTime.time;
                    }
                  }
                }
              }
              return (
                <a
                  href={stravaUrl}
                  target="_blank"
                  className="runner-link"
                  key={cardId}
                  rel="noopener noreferrer"
                >
                  <div id={cardId} className="runner-card">
                    <img src={img} alt={cardId} className="runner-image" />
                    <div className="strava-badge">
                      <img
                        src={stravaImg}
                        alt="Strava"
                        className="strava-badge"
                      />
                    </div>
                    <div className="runner-result-area">
                      {stravaLoading ? (
                        <img
                          src={stravaImg}
                          alt="Loading..."
                          className="spinner-img"
                          style={{ width: 24, height: 24, opacity: 0.5 }}
                        />
                      ) : (
                        <>
                          {runnerKm !== null && (
                            <div id={`${cardId}-totalKm`}>{runnerKm} KM</div>
                          )}
                          {runnerTime && (
                            <div
                              id={`${cardId}-totalTime`}
                              className="runner-time"
                            >
                              {runnerTime}
                            </div>
                          )}
                        </>
                      )}
                    </div>
                  </div>
                </a>
              );
            })}
          </div>
        </div>
        <div className="motivation">
          <div className="motivation-text">
            {isMarathonDay
              ? "Let's do this! 🚀"
              : MOTIVATIONAL_MESSAGES[motivationIndex]}
          </div>
          <div className="friends-mention">
            {isMarathonDay
              ? "Time to show what you're made of! 🏆"
              : "Shoutout to the marathon squad! Let's make this epic!"}
          </div>
        </div>
        <audio ref={audioRef} src={song} preload="auto" hidden />
        <a
          href="https://www.zurichmaratobarcelona.es/recorrido/"
          target="_blank"
          className="track-link-bottom-right"
          rel="noopener noreferrer"
        >
          <img
            src={trackImg}
            alt="Marathon Track"
            className="track-image-bottom-right"
            onMouseEnter={handleMapMouseEnter}
            onMouseLeave={handleMapMouseLeave}
          />
        </a>
      </div>
    </div>
  );
};

export default MarathonPage;
