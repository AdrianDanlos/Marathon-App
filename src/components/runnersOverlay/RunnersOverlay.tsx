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
  const levelInfo = getLevelInfo(stravaData.totalKm);
  const { totalKm, longestRun, fastestPace, totalTime } = stravaData;

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
            <strong>Total KM:</strong> {totalKm}
          </div>
          <div>
            <strong>Total Time:</strong> {totalTime}
          </div>
        </div>
      </div>
    </div>
  );
};
