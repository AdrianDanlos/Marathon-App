import { getClosestCityDistance } from "../../utils/cityDistances";
import { getLevelInfo } from "../../utils/levelUtils";
import type { AthleteData } from "../../utils/types";
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
  const { totalKm, longestRun, fastestPace, totalTime } = stravaData;
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
        </div>
        <div className="runners-overlay-stats">
          <div>
            <strong>Longest Run:</strong> {longestRun} km
          </div>
          <div>
            <strong>Fastest Pace:</strong> {fastestPace} min/km
          </div>
          <div>
            <strong>Total Time:</strong> {totalTime}
          </div>
          <div>
            <strong>Total KM:</strong> {totalKm} km
          </div>
          <div>
            <strong>Distance:</strong> {from} → {to} {country && `(${country})`}
          </div>
        </div>
      </div>
    </div>
  );
};
