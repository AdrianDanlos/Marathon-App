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

  const stats = [
    { label: "Longest Run", value: `${longestRun} km` },
    { label: "Fastest Pace", value: `${fastestPace} min/km` },
    { label: "Total Time", value: totalTime },
    { label: "Total KM", value: `${totalKm} km` },
    {
      label: "Distance",
      value: `${from} → ${to}${country ? ` (${country})` : ""}`,
    },
  ];

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
          {stats.map(({ label, value }) => (
            <div key={label} className="runners-overlay-stat-item">
              <strong>{label}:</strong>
              <span>{value}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
