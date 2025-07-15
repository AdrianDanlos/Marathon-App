import React from "react";
import "./CountdownTimer.css";

type CountdownState = {
  days: string;
  hours: string;
  minutes: string;
  seconds: string;
};

type CountdownTimerProps = {
  countdown: CountdownState;
  isMarathonDay: boolean;
  onCountdownClick: (e: React.MouseEvent<HTMLDivElement>) => void;
};

const CountdownTimer: React.FC<CountdownTimerProps> = ({
  countdown,
  isMarathonDay,
  onCountdownClick,
}) => (
  <div className="countdown-container">
    <div className="countdown">
      {(["days", "hours", "minutes", "seconds"] as const).map((unit) => (
        <React.Fragment key={unit}>
          <div className="countdown-item" onClick={onCountdownClick}>
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

export default CountdownTimer;
