import React, { useEffect, useState } from "react";
import "./Motivation.css";

const MOTIVATIONAL_MESSAGES = [
  "You've got this! 🚀",
  "Stay strong! 💪",
  "Keep pushing! 🔥",
  "You're unstoppable! ⚡",
  "Dream big! 🏆",
  "You're a champion! 🏃‍♂️",
];

const Motivation: React.FC = () => {
  const [index, setIndex] = useState(0);
  const [fade, setFade] = useState(true);

  useEffect(() => {
    const interval = setInterval(() => {
      setFade(false); // Start fade out
      setTimeout(() => {
        setIndex((prev) => (prev + 1) % MOTIVATIONAL_MESSAGES.length);
        setFade(true); // Fade in with new message
      }, 300);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="motivation">
      <div className={`motivation-text fade-motivation${fade ? " fade-in" : " fade-out"}`}>
        {MOTIVATIONAL_MESSAGES[index]}
      </div>
      <div className="friends-mention">
        Shoutout to the marathon squad! Let's make this epic!
      </div>
    </div>
  );
};

export default Motivation;