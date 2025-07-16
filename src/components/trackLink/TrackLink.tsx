import React, { useState } from "react";
import "./TrackLink.css";
import type { RefObject } from "react";

interface TrackLinkProps {
  trackImg: string;
  audioRef: RefObject<HTMLAudioElement | null>;
  song: string;
}
type IntervalType = ReturnType<typeof setInterval> | null;

const TrackLink: React.FC<TrackLinkProps> = ({ trackImg, audioRef, song }) => {
  const [fadeInterval, setFadeInterval] = useState<IntervalType>(null);

  // Audio fade logic
  const handleMapMouseEnter = () => {
    if (fadeInterval) {
      clearInterval(fadeInterval);
      setFadeInterval(null);
    }
    const audio = audioRef.current;
    if (audio) {
      if (audio.paused) {
        audio.volume = 0.7;
        audio.play().catch(() => {});
      } else {
        audio.volume = 0.7;
      }
    }
  };

  const handleMapMouseLeave = () => {
    const audio = audioRef.current;
    if (audio && !audio.paused) {
      const fadeStep = 0.05;
      const interval = setInterval(() => {
        if (audio.volume > fadeStep) {
          audio.volume = Math.max(0, audio.volume - fadeStep);
        } else {
          audio.volume = 0;
          audio.pause();
          audio.currentTime = 0;
          clearInterval(interval);
          setFadeInterval(null);
        }
      }, 30);
      setFadeInterval(interval);
    }
  };
  return (
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
};

export default TrackLink;
