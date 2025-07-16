type RunnerLevelProps = {
  level: number;
  progress: number;
  nextLevelKm: number;
  runnerKm: number | null;
};

export const RunnerLevel = (props: RunnerLevelProps) => {
  const { level, progress, nextLevelKm, runnerKm } = props;
  return (
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
  );
};
