import { getClosestCityDistance } from "../../utils/cityDistances";
import { getLevelInfo } from "../../utils/levelUtils";
import type { AthleteData } from "../../utils/types";
import { Badges } from "../badges/Badges";
import { RunnerLevel } from "../runnerLevel/RunnerLevel";
import "./RunnersOverlay.css";

interface RunnersOverlayProps {
  animate: boolean;
  stravaData: AthleteData;
  onClose: () => void;
}

export const RunnersOverlay: React.FC<RunnersOverlayProps> = ({
  animate,
  onClose,
  stravaData,
}) => {
  const { totalKm, longestRun, fastestPace, totalTime, badges } = stravaData;
  const levelInfo = getLevelInfo(totalKm);
  const { from, to, country } = getClosestCityDistance(totalKm);

  return (
    <div className={`runners-overlay${animate ? " show" : ""}`}>
      <button
        className="runners-overlay-back"
        onClick={onClose}
        aria-label="Back to runners"
      >
        ←
      </button>
      <div className="runners-overlay-content">
        <div>
          <div className="runners-overlay-level-name">
            {levelInfo.levelName}
          </div>
          <RunnerLevel levelInfo={levelInfo} />
          <Badges badges={badges} />
        </div>
        <div className="runners-overlay-stats">
          <div>
            <strong>Longest Run:</strong>
            <span>{longestRun} km</span>
          </div>
          <div>
            <strong>Fastest Pace:</strong>
            <span>{fastestPace} min/km</span>
          </div>
          <div>
            <strong>Total Time:</strong>
            <span>{totalTime}</span>
          </div>
          <div>
            <strong>Total KM:</strong>
            <span>{totalKm} km</span>
          </div>
          <div>
            <strong>Distance:</strong>
            <span>
              {from} → {to} {country && `(${country})`}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
