import React from "react";
import "./TrackLink.css";
import type { RefObject } from "react";

interface TrackLinkProps {
  trackImg: string;
  handleMapMouseEnter: () => void;
  handleMapMouseLeave: () => void;
  audioRef: RefObject<HTMLAudioElement | null>;
  song: string;
}

const TrackLink: React.FC<TrackLinkProps> = ({
  trackImg,
  handleMapMouseEnter,
  handleMapMouseLeave,
  audioRef,
  song,
}) => (
  <>
    <audio ref={audioRef} src={song} preload="auto" hidden />
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
        onMouseEnter={handleMapMouseEnter}
        onMouseLeave={handleMapMouseLeave}
      />
    </a>
  </>
);

export default TrackLink;
