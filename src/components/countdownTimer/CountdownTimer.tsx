import React, { useEffect, useState } from "react";
import "./CountdownTimer.css";

const TARGET_DATE = new Date("March 16, 2026 00:00:00").getTime();

const CountdownTimer: React.FC = () => {
  const [time, setTime] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 });

  useEffect(() => {
    const interval = setInterval(() => {
      const now = Date.now();
      const distance = TARGET_DATE - now;
      
      if (distance < 0) {
        clearInterval(interval);
        return;
      }

      setTime({
        days: Math.floor(distance / (1000 * 60 * 60 * 24)),
        hours: Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
        minutes: Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60)),
        seconds: Math.floor((distance % (1000 * 60)) / 1000)
      });
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  const formatTime = (value: number) => value.toString().padStart(2, "0");

  return (
    <div className="countdown-container">
      <div className="countdown">
        {Object.entries(time).map(([unit, value], index) => (
          <React.Fragment key={unit}>
            <div className="countdown-item">
              <div className="countdown-number">{formatTime(value)}</div>
              <div className="countdown-label">{unit.charAt(0).toUpperCase() + unit.slice(1)}</div>
            </div>
            {index < 3 && <div className="countdown-separator">:</div>}
          </React.Fragment>
        ))}
      </div>
    </div>
  );
};

export default CountdownTimer;