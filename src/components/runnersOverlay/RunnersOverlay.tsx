import { getLevelInfo, getLevelName } from "../../utils/levelUtils";
import type { StravaRunner } from "../../utils/types";
import { RunnerLevel } from "../runnerLevel/RunnerLevel";

interface RunnersOverlayProps {
  show: boolean;
  animate: boolean;
  runnerKm: number;
  stravaData: StravaRunner[] | null;
  onClose: () => void;
}

export const RunnersOverlay: React.FC<RunnersOverlayProps> = ({
  show,
  animate,
  onClose,
  runnerKm,
  stravaData,
}) => {
  if (!show) return null;

  console.log('stravaData :>> ', stravaData);
  const { level, progress, nextLevelKm } = getLevelInfo(runnerKm);

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
        <div className="runners-overlay-level-name">{getLevelName(level)}</div>
        <RunnerLevel
          level={level}
          progress={progress}
          nextLevelKm={nextLevelKm}
          runnerKm={runnerKm}
        />
      </div>
    </div>
  );
};
