import React, { useState, useEffect } from "react";
import "./RunnersGrid.css";
import RunnerCard from "../runnerCard/RunnerCard";
import { RunnersOverlay } from "../runnersOverlay/RunnersOverlay";
import asierImg from "@assets/images/asier.jpg";
import hodeiImg from "@assets/images/hodei.jpg";
import joelImg from "@assets/images/joel.jpg";
import adrianImg from "@assets/images/adrian.jpg";
import type { Athlete, AthleteData } from "../../utils/types";

interface RunnersGridProps {
  stravaData: Athlete[] | null;
  stravaLoading: boolean;
}

const RunnersGrid: React.FC<RunnersGridProps> = ({
  stravaData,
  stravaLoading,
}) => {
  const [showOverlay, setShowOverlay] = useState(false);
  const [animateOverlay, setAnimateOverlay] = useState(false);
  const [selectedRunnerKm, setSelectedRunnerKm] = useState<number | null>(null);

  const runners = [
    { id: "asier", img: asierImg },
    { id: "hodei", img: hodeiImg },
    { id: "joel", img: joelImg },
    { id: "adrian", img: adrianImg },
  ];

  useEffect(() => {
    if (showOverlay) {
      setTimeout(() => setAnimateOverlay(true), 10);
    } else {
      setAnimateOverlay(false);
      setSelectedRunnerKm(null);
    }
  }, [showOverlay]);

  return (
    <div className="runners-section">
      <div className="runners-grid" style={{ position: "relative" }}>
        <RunnersOverlay
          show={showOverlay}
          animate={animateOverlay}
          onClose={() => setShowOverlay(false)}
          runnerKm={selectedRunnerKm as number}
          stravaData={stravaData}
        />
        {!showOverlay &&
          runners.map(({ id, img }) => {
            const runnerStats = stravaData?.find(
              (item) => Object.keys(item)[0] === id
            )?.[id] as AthleteData | undefined;

            const totalKm = runnerStats?.totalKm ?? 0;
            const totalTime = runnerStats?.totalTime ?? '0';
            return (
              <RunnerCard
                key={id}
                cardId={id}
                img={img}
                runnerKm={totalKm}
                runnerTime={totalTime}
                stravaLoading={stravaLoading}
                onClick={() => {
                  setSelectedRunnerKm(totalKm);
                  setShowOverlay(true);
                }}
              />
            );
          })}
      </div>
    </div>
  );
};

export default RunnersGrid;
