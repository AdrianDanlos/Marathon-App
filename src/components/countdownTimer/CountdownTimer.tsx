import React, { useEffect, useState } from "react";
import "./CountdownTimer.css";

type CountdownState = {
  days: string;
  hours: string;
  minutes: string;
  seconds: string;
  isMarathonDay: boolean;
};

const TARGET_DATE = new Date("March 16, 2026 00:00:00").getTime();

const CountdownTimer: React.FC = () => {
  const [countdown, setCountdown] = useState<CountdownState>({
    days: "00",
    hours: "00",
    minutes: "00",
    seconds: "00",
    isMarathonDay: false,
  });

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

  // Interactive click effect for countdown items
  const handleCountdownClick = (e: React.MouseEvent<HTMLDivElement>) => {
    const el = e.currentTarget;
    el.style.transform = "scale(0.95)";
    setTimeout(() => {
      el.style.transform = "scale(1)";
    }, 150);
  };

  return (
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
            {unit !== "seconds" && <div className="countdown-separator">:</div>}
          </React.Fragment>
        ))}
      </div>
    </div>
  );
};

export default CountdownTimer;
