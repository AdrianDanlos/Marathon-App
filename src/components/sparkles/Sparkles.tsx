import React from "react";
import "./Sparkles.css";

type Sparkle = { id: number; left: string; top: string };

type SparklesProps = {
  sparkles: Sparkle[];
};

const Sparkles: React.FC<SparklesProps> = ({ sparkles }) => (
  <>
    {sparkles.map((sparkle) => (
      <div
        key={sparkle.id}
        style={{
          position: "absolute",
          left: sparkle.left,
          top: sparkle.top,
          fontSize: "1rem",
          opacity: 0.8,
          pointerEvents: "none",
          zIndex: 5,
          animation: "sparkle 2s ease-out forwards",
        }}
      >
        ✨
      </div>
    ))}
  </>
);

export default Sparkles;
