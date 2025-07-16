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
  const [motivationIndex, setMotivationIndex] = useState(0);
  const motivationalMessage = MOTIVATIONAL_MESSAGES[motivationIndex];
  const friendsMention =
    "Shoutout to the marathon squad! Let's make this epic!";

  const [displayedMessage, setDisplayedMessage] = useState(motivationalMessage);
  const [fade, setFade] = useState(true);

  useEffect(() => {
    setFade(false); // Start fade out
    const timeout = setTimeout(() => {
      setDisplayedMessage(motivationalMessage); // Change message after fade out
      setFade(true); // Fade in
    }, 300); // 300ms fade out
    return () => clearTimeout(timeout);
  }, [motivationalMessage]);

  // Motivational message cycling
  useEffect(() => {
    const interval = setInterval(() => {
      setMotivationIndex((prev) => (prev + 1) % MOTIVATIONAL_MESSAGES.length);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="motivation">
      <div
        className={`motivation-text fade-motivation${
          fade ? " fade-in" : " fade-out"
        }`}
      >
        {displayedMessage}
      </div>
      <div className="friends-mention">{friendsMention}</div>
    </div>
  );
};

export default Motivation;
