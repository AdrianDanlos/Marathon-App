import React, { useState, useEffect } from "react";
import "./RunnersGrid.css";
import RunnerCard from "../runnerCard/RunnerCard";
import { RunnersOverlay } from "../runnersOverlay/RunnersOverlay";
import asierImg from "@assets/images/asier.jpg";
import hodeiImg from "@assets/images/hodei.jpg";
import joelImg from "@assets/images/joel.jpg";
import adrianImg from "@assets/images/adrian.jpg";
import type { Athlete } from "../../utils/types";
import { getRunnerStats } from "../../utils/helpers";

interface RunnersGridProps {
  stravaData: Athlete[] | null;
  stravaLoading: boolean;
}

// Memoized runners array (static)
const runners = [
  { id: "asier", img: asierImg },
  { id: "hodei", img: hodeiImg },
  { id: "joel", img: joelImg },
  { id: "adrian", img: adrianImg },
];

const RunnersGrid: React.FC<RunnersGridProps> = ({ stravaData }) => {
  const [showOverlay, setShowOverlay] = useState(false);
  const [animateOverlay, setAnimateOverlay] = useState(false);
  const [selectedRunner, setSelectedRunner] = useState<string | null>(null);

  useEffect(() => {
    if (showOverlay) {
      setTimeout(() => setAnimateOverlay(true), 10);
    } else {
      setAnimateOverlay(false);
      setSelectedRunner(null);
    }
  }, [showOverlay]);

  return (
    <div className="runners-section">
      <div className="runners-grid" style={{ position: "relative" }}>
        {!showOverlay &&
          runners.map(({ id, img }) => {
            const runnerStats = stravaData
              ? getRunnerStats(stravaData, id)
              : null;
            return (
              <RunnerCard
                key={id}
                cardId={id}
                img={img}
                stravaData={runnerStats}
                onClick={() => {
                  if (stravaData) {
                    setSelectedRunner(id);
                    setShowOverlay(true);
                  }
                }}
              />
            );
          })}
        {stravaData && showOverlay && (
          <RunnersOverlay
            animate={animateOverlay}
            onClose={() => setShowOverlay(false)}
            stravaData={getRunnerStats(stravaData, selectedRunner!)}
            img={runners.find((runner) => runner.id === selectedRunner)?.img}
          />
        )}
      </div>
    </div>
  );
};

export default RunnersGrid;
