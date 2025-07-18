import React from "react";
import "./RunnerCard.css";
import spinnerImg from "../../assets/images/spinner.png";
import { RunnerLevel } from "../runnerLevel/RunnerLevel";
import { getLevelInfo } from "../../utils/levelUtils";
import type { AthleteData } from "../../utils/types";

interface RunnerCardProps {
  cardId: string;
  img: string;
  stravaData: AthleteData | null;
  onClick?: () => void;
}

const RunnerCard: React.FC<RunnerCardProps> = ({
  cardId,
  img,
  stravaData,
  onClick,
}) => {
  return (
    <div
      id={cardId}
      className="runner-card runner-link"
      onClick={onClick}
      style={{ cursor: onClick ? "pointer" : undefined }}
    >
      <img src={img} alt={cardId} className="runner-image" />
      <div className="runner-result-area">
        {!stravaData ? (
          <img src={spinnerImg} alt="Loading..." className="spinner-img" />
        ) : (
          <>
            <div className="runner-name">
              {/* First letter to uppercase */}
              {cardId.charAt(0).toUpperCase() + cardId.slice(1)}
            </div>
            <div id={`${cardId}-totalKm`}>{stravaData.totalKm} km</div>
            <div id={`${cardId}-totalTime`} className="runner-time">
              {stravaData.totalTime}
            </div>
            <RunnerLevel levelInfo={getLevelInfo(stravaData.totalKm)} />
          </>
        )}
      </div>
    </div>
  );
};

export default RunnerCard;
