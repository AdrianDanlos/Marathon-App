import React from "react";
import "./RunnerCard.css";
import spinnerImg from "../../assets/images/spinner.png";
import { RunnerLevel } from "../runnerLevel/RunnerLevel";
import { getLevelInfo } from "../../utils/levelUtils";

interface RunnerCardProps {
  cardId: string;
  img: string;
  runnerKm: number | null;
  runnerTime: string | null;
  stravaLoading: boolean;
  onClick?: () => void;
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
            <RunnerLevel
              level={level}
              progress={progress}
              nextLevelKm={nextLevelKm}
              runnerKm={runnerKm}
            />
          </>
        )}
      </div>
    </div>
  );
};

export default RunnerCard;
