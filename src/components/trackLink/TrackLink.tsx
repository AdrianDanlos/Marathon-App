import React from "react";
import "./TrackLink.css";

interface TrackLinkProps {
  trackImg: string;
}

const TrackLink: React.FC<TrackLinkProps> = ({ trackImg }) => {
  return (
    <>
      <a
        href="https://www.zurichmaratobarcelona.es/recorrido/"
        target="_blank"
        className="track-link-bottom-right"
        rel="noopener noreferrer"
      >
        <img
          src={trackImg}
          alt="Marathon Track"
          className="track-image-bottom-right"
        />
      </a>
    </>
  );
};

export default TrackLink;
