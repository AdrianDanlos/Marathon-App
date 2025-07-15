import React, { useEffect, useState } from "react";
import "./Motivation.css";

type MotivationProps = {
  isMarathonDay: boolean;
  motivationalMessage: string;
  friendsMention: string;
};

const Motivation: React.FC<MotivationProps> = ({ isMarathonDay, motivationalMessage, friendsMention }) => {
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

  return (
    <div className="motivation">
      <div className={`motivation-text fade-motivation${fade ? " fade-in" : " fade-out"}`}>
        {displayedMessage}
      </div>
      <div className="friends-mention">
        {friendsMention}
      </div>
    </div>
  );
};

export default Motivation;
