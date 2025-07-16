import React, { useState, useEffect } from "react";
import "./RunnersGrid.css";
import RunnerCard from "../runnerCard/RunnerCard";

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
  const [showHello, setShowHello] = useState(false);
  const [animateHello, setAnimateHello] = useState(false);

  useEffect(() => {
    if (showHello) {
      setTimeout(() => setAnimateHello(true), 10);
    } else {
      setAnimateHello(false);
    }
  }, [showHello]);

  return (
    <div className="runners-section">
      <div className="runners-grid" style={{ position: "relative" }}>
        {showHello ? (
          <div className={`runners-overlay${animateHello ? " show" : ""}`}>
            <button
              className="runners-overlay-back"
              onClick={() => setShowHello(false)}
              aria-label="Back to runners"
            >
              ←
            </button>
            <div className="runners-overlay-text">hello world</div>
          </div>
        ) : (
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
                onClick={() => setShowHello(true)}
              />
            );
          })
        )}
      </div>
    </div>
  );
};

export default RunnersGrid;
