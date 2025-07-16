import { getLevelInfo, getLevelName } from "../../levelUtils";
import { RunnerLevel } from "../runnerLevel/RunnerLevel";

interface RunnersOverlayProps {
  show: boolean;
  animate: boolean;
  runnerKm: number;
  onClose: () => void;
}

export const RunnersOverlay: React.FC<RunnersOverlayProps> = ({
  show,
  animate,
  onClose,
  runnerKm,
}) => {
  if (!show) return null;
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
