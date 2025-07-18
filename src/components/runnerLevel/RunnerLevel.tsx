import type { LevelInfo } from "../../utils/levelUtils";
import { STRINGS } from "../../utils/strings";

type RunnerLevelProps = {
  levelInfo: LevelInfo;
};

export const RunnerLevel = ({ levelInfo }: RunnerLevelProps) => {
  const { level, progress, nextLevelKm, totalKm } = levelInfo;
  return (
    <div className="runner-level">
      <div className="runner-level-label">
        {STRINGS.LEVEL} {level}
      </div>
      <div className="runner-level-bar">
        <div
          className="runner-level-bar-fill"
          style={{ width: `${progress}%` }}
        />
      </div>
      <div className="runner-level-next">
        {`${(nextLevelKm - totalKm).toFixed(1)} ${STRINGS.KM_TO_NEXT_LEVEL}`}
      </div>
    </div>
  );
};
