import React, { useState, useEffect, useRef } from 'react';
import './Containment.scss';

const TIMER_DURATION = 15 * 60;
const WARNING_THRESHOLD = 2 * 60;

const Containment = ({ event }) => {
  const [phase, setPhase] = useState("standby"); // standby || breach || running
  const [timeLeft, setTimeLeft] = useState(null);

  const intervalRef = useRef(null);

  useEffect(() => {
    // Always clear first
    clearInterval(intervalRef.current);
    intervalRef.current = null;

    switch (event?.type) {
      case "start":
        setPhase("breach");
        setTimeLeft(null);
        break;

      case "containment":
        setPhase("running");
        setTimeLeft(TIMER_DURATION);

        intervalRef.current = setInterval(() => {
          setTimeLeft(prev => {
            if (prev === null) return null;
            if (prev <= 1) {
              clearInterval(intervalRef.current);
              intervalRef.current = null;
              setPhase("breach");
              return null;
            }
            return prev - 1;
          });
        }, 1000);
        break;

      case "end_round":
      default:
        setPhase("standby");
        setTimeLeft(null);
        break;
    }

    return () => {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    };
  }, [event?.count]);

  const formatTime = (secs) => {
    const m = String(Math.floor(secs / 60)).padStart(2, "0");
    const s = String(secs % 60).padStart(2, "0");

    return `${m}:${s}`;
  };

  const isWarning =
    phase === "running" &&
    timeLeft !== null &&
    timeLeft <= WARNING_THRESHOLD;

  return (
    <div className="containment">
      {(phase === "standby" || phase === "end_round") && (
        <div className="standby">
          Standby
        </div>
      )}

      {phase === "breach" && (
        <div className="breach">
          BREACH
        </div>
      )}

      {phase === "running" && (
        <span className={`timer ${isWarning ? "warning" : ""}`}>
          {formatTime(timeLeft)}
        </span>
      )}

      <span className={`status ${phase === "breach" ? "warning" : ""}`}>
        {phase === "breach"
          ? "Unstable"
          : "Containment"}
      </span>
    </div>
  );
};

export default Containment;