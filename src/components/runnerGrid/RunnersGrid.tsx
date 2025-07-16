import React, { useState, useEffect } from "react";
import "./RunnersGrid.css";
import RunnerCard from "../runnerCard/RunnerCard";
import { RunnersOverlay } from "../runnersOverlay/RunnersOverlay";

interface StravaPerson {
  totalKm: number;
  totalTime: { time: string } | string;
}
type StravaRunner = { [key: string]: StravaPerson };

interface RunnersGridProps {
  CARD_IDS: string[];
  images: { [key: string]: string };
  stravaData: StravaRunner[] | null;
  stravaLoading: boolean;
}

const RunnersGrid: React.FC<RunnersGridProps> = ({
  CARD_IDS,
  images,
  stravaData,
  stravaLoading,
}) => {
  const [showOverlay, setShowOverlay] = useState(false);
  const [animateOverlay, setAnimateOverlay] = useState(false);
  const [selectedRunnerKm, setSelectedRunnerKm] = useState<number | null>(null);

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
          CARD_IDS.map((cardId) => {
            let runnerKm: number | null = null;
            let runnerTime: string | null = null;
            if (stravaData) {
              const runnerObj = stravaData.find(
                (item) => Object.keys(item)[0] === cardId
              );
              if (runnerObj) {
                const person = Object.values(runnerObj)[0];
                if (person) {
                  runnerKm = person.totalKm;
                  if (typeof person.totalTime === "string") {
                    runnerTime = person.totalTime;
                  } else if (
                    typeof person.totalTime === "object" &&
                    person.totalTime !== null &&
                    "time" in person.totalTime
                  ) {
                    runnerTime = person.totalTime.time;
                  }
                }
              }
            }
            return (
              <RunnerCard
                key={cardId}
                cardId={cardId}
                img={images[cardId]}
                runnerKm={runnerKm}
                runnerTime={runnerTime}
                stravaLoading={stravaLoading}
                onClick={() => {
                  setSelectedRunnerKm(runnerKm);
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
