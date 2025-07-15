import React from "react";
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
  stravaImg: string;
}

const stravaUrls: { [key: string]: string } = {
  asier: "https://www.strava.com/athletes/21162116",
  hodei: "https://www.strava.com/athletes/172716857",
  joel: "https://www.strava.com/athletes/120181216",
  adrian: "https://www.strava.com/athletes/71606225",
};

const RunnersGrid: React.FC<RunnersGridProps> = ({
  CARD_IDS,
  images,
  stravaData,
  stravaLoading,
  stravaImg,
}) => (
  <div className="runners-section">
    <div className="runners-grid">
      {CARD_IDS.map((cardId) => {
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
            stravaUrl={stravaUrls[cardId]}
            stravaImg={stravaImg}
            runnerKm={runnerKm}
            runnerTime={runnerTime}
            stravaLoading={stravaLoading}
          />
        );
      })}
    </div>
  </div>
);

export default RunnersGrid;
