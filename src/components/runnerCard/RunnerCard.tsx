import React from "react";
import "./RunnerCard.css";
import spinnerImg from "../../assets/images/spinner.png";

interface RunnerCardProps {
  cardId: string;
  img: string;
  runnerKm: number | null;
  runnerTime: string | null;
  stravaLoading: boolean;
  onClick?: () => void;
}

// Add a function to calculate level and progress
function getLevelInfo(km: number | null) {
  if (km === null || isNaN(km) || km < 0) {
    return { level: 1, progress: 0, nextLevelKm: 5, currentLevelKm: 0 };
  }

  const base = 5;
  const factor = 1.1;
  let level = 1;
  let currentLevelKm = 0;
  let nextLevelKm = base;
  let increment = base;

  // Cumulative sum for nextLevelKm
  while (km >= nextLevelKm) {
    level++;
    currentLevelKm = nextLevelKm;
    increment = Math.round(base * Math.pow(factor, level - 1));
    nextLevelKm += increment;
  }

  const kmInCurrentLevel = km - currentLevelKm;
  const kmNeededForLevel = nextLevelKm - currentLevelKm;
  const progress = (kmInCurrentLevel / kmNeededForLevel) * 100;

  return {
    level,
    progress: Math.max(0, Math.min(progress, 100)),
    nextLevelKm,
    currentLevelKm,
    kmInCurrentLevel: Math.round(kmInCurrentLevel * 100) / 100,
    kmNeededForLevel: Math.round(kmNeededForLevel * 100) / 100,
  };
}

const RunnerCard: React.FC<RunnerCardProps> = ({
  cardId,
  img,
  runnerKm,
  runnerTime,
  stravaLoading,
  onClick,
}) => {
  const { level, progress, nextLevelKm } = getLevelInfo(runnerKm);
  return (
    <div
      id={cardId}
      className="runner-card runner-link"
      onClick={onClick}
      style={{ cursor: onClick ? "pointer" : undefined }}
    >
      <img src={img} alt={cardId} className="runner-image" />
      <div className="runner-result-area">
        {stravaLoading ? (
          <img src={spinnerImg} alt="Loading..." className="spinner-img" />
        ) : (
          <>
            {runnerKm !== null && (
              <div id={`${cardId}-totalKm`}>{runnerKm} KM</div>
            )}
            {runnerTime && (
              <div id={`${cardId}-totalTime`} className="runner-time">
                {runnerTime}
              </div>
            )}
            <div className="runner-level">
              <div className="runner-level-label">Level {level}</div>
              <div className="runner-level-bar">
                <div
                  className="runner-level-bar-fill"
                  style={{ width: `${progress}%` }}
                />
              </div>
              <div className="runner-level-next">
                {runnerKm !== null
                  ? `${(nextLevelKm - runnerKm).toFixed(1)} km to next level`
                  : ""}
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default RunnerCard;
