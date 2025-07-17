import React from "react";
import trackImg from "@assets/images/track.png";
import CountdownTimer from "./countdownTimer/CountdownTimer";
import RunnersGrid from "./runnerGrid/RunnersGrid";
import Motivation from "./motivation/Motivation";
import TrackLink from "./trackLink/TrackLink";
import "./MarathonPage.css";
import TotalStatsBlock from "./totalStatsBlock/TotalStatsBlock";
import { useStravaStats } from "../hooks/useStravaStats";

const MARATHON_TITLE = "BARCELONA MARATHON 2026!";
const MARATHON_SUBTITLE = "4 Runners. 42.195km. 1 Destiny";

const MarathonPage: React.FC = () => {
  const { stravaData, stravaLoading, totalKm, totalTime } = useStravaStats();

  return (
    <div className="container">
      <div className="content">
        <h1 className="title">{MARATHON_TITLE}</h1>
        <h2 className="subtitle">{MARATHON_SUBTITLE}</h2>
        <div className="section-spacing">
          <TotalStatsBlock
            stravaLoading={stravaLoading}
            totalKm={totalKm}
            totalTime={totalTime}
          />
        </div>
        <div className="section-spacing">
          <CountdownTimer />
        </div>
        <div className="section-spacing">
          <RunnersGrid stravaData={stravaData} stravaLoading={stravaLoading} />
        </div>
        <Motivation />
        <TrackLink trackImg={trackImg} />
      </div>
    </div>
  );
};

export default MarathonPage;
