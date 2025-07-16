import React from "react";
import "./RunnerCard.css";
import spinnerImg from "../../assets/images/spinner.png";

interface RunnerCardProps {
  cardId: string;
  img: string;
  stravaUrl: string;
  stravaImg: string;
  runnerKm: number | null;
  runnerTime: string | null;
  stravaLoading: boolean;
}

const RunnerCard: React.FC<RunnerCardProps> = ({
  cardId,
  img,
  stravaUrl,
  stravaImg,
  runnerKm,
  runnerTime,
  stravaLoading,
}) => (
  <a
    href={stravaUrl}
    target="_blank"
    className="runner-link"
    rel="noopener noreferrer"
  >
    <div id={cardId} className="runner-card">
      <img src={img} alt={cardId} className="runner-image" />
      <div className="strava-badge">
        <img src={stravaImg} alt="Strava" className="strava-badge" />
      </div>
      <div className="runner-result-area">
        {stravaLoading ? (
          <img
            src={spinnerImg}
            alt="Loading..."
            className="spinner-img"
          />
        ) : (
          <>
            {runnerKm !== null && <div id={`${cardId}-totalKm`}>{runnerKm} KM</div>}
            {runnerTime && (
              <div id={`${cardId}-totalTime`} className="runner-time">
                {runnerTime}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  </a>
);

export default RunnerCard;
