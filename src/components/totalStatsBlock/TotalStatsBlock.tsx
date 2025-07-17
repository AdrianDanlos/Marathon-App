import React from "react";
import spinner2Img from "@assets/images/spinner2.png";
import "./TotalStatsBlock.css";

interface TotalStatsBlockProps {
  stravaLoading: boolean;
  totalKm: number | null;
  totalTime: string;
}

const TotalStatsBlock: React.FC<TotalStatsBlockProps> = ({
  stravaLoading,
  totalKm,
  totalTime,
}) => {
  if (stravaLoading) {
    return (
      <div id="total-km-combined">
        <img
          src={spinner2Img}
          alt="Loading..."
          className="spinner-img"
          role="status"
          aria-live="polite"
        />
      </div>
    );
  }

  return (
    <div id="total-km-combined">
      {totalKm !== null && <span className="total-distance">{totalKm} KM</span>}
      {totalTime && <span className="total-time">{totalTime}</span>}
    </div>
  );
};

export default TotalStatsBlock;
