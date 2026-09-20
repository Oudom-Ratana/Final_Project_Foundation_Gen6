import React, { useState, useEffect } from "react";

/**
 * TypewriterText - Smooth typewriter animation with blinking cursor.
 */
export default function TypewriterText({
  phrases = [
    "Experience IMAX Precision",
    "Feel the 4DX Motion & Effects",
    "Immerse in Dolby Atmos Surround",
    "VIP Luxury Recliner Comfort",
  ],
  speed = 75,
  deleteSpeed = 45,
  pauseTime = 1800,
  className = "",
  cursorClassName = "text-[#B90101]",
}) {
  const [currentPhraseIndex, setCurrentPhraseIndex] = useState(0);
  const [displayText, setDisplayText] = useState("");
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    if (!phrases || phrases.length === 0) return;

    const currentPhrase = phrases[currentPhraseIndex % phrases.length];
    let timer;

    if (!isDeleting) {
      if (displayText.length < currentPhrase.length) {
        timer = setTimeout(() => {
          setDisplayText(currentPhrase.slice(0, displayText.length + 1));
        }, speed);
      } else {
        timer = setTimeout(() => {
          setIsDeleting(true);
        }, pauseTime);
      }
    } else {
      if (displayText.length > 0) {
        timer = setTimeout(() => {
          setDisplayText(currentPhrase.slice(0, displayText.length - 1));
        }, deleteSpeed);
      } else {
        setIsDeleting(false);
        setCurrentPhraseIndex((prev) => (prev + 1) % phrases.length);
      }
    }

    return () => clearTimeout(timer);
  }, [
    displayText,
    isDeleting,
    currentPhraseIndex,
    phrases,
    speed,
    deleteSpeed,
    pauseTime,
  ]);

  return (
    <span className={`inline-flex items-center min-h-[1.25em] ${className}`}>
      <span>{displayText || "\u200B"}</span>
      <span
        aria-hidden="true"
        className={`ml-1 inline-block w-[2.5px] h-[1.15em] bg-current align-middle animate-pulse ${cursorClassName}`}
      />
    </span>
  );
}
