import React, { useState, useEffect } from 'react';
import './Containment.scss';

// const TIMER_DURATION = 15 * 60;
// const WARNING_THRESHOLD = 2 * 60;
const TIMER_DURATION = 1.5 * 60;
const WARNING_THRESHOLD = 10;

const Containment = ({ event }) => {
  const [phase, setPhase] = useState("standby"); // standby || breach || running
  const [timeLeft, setTimeLeft] = React.useState(null);
  const [running, setRunning] = React.useState(false);
  const intervalRef = React.useRef(null);

  console.log('Containment Event: ', event);

  useEffect(() => {
    if (!event.type) {
      setPhase("standby");
      return;
    }

    if (event.type === "start") {
      clearInterval(intervalRef.current);
      setPhase("breach");
    }

    if (event === "containment") {
      clearInterval(intervalRef.current);
      setTimeLeft(TIMER_DURATION);
      setPhase("running");

      intervalRef.current = setInterval(() => {
        setTimeLeft(prev => {
          if (prev <= 1) {
            clearInterval(intervalRef.current);
            setPhase("breach");
            return TIMER_DURATION;
          }
          return prev - 1;
        });
      }, 1000);
    }
  }, [event.count]);

  const formatTime = (secs) => {
    const m = String(Math.floor(secs / 60)).padStart(2, "0");
    const s = String(secs % 60).padStart(2, "0");
    return `${m}:${s}`;
  };

  const isWarning = phase === "running" && timeLeft !== null && timeLeft <= WARNING_THRESHOLD;

  return (
    <div className="containment">
      {/* <button onClick={startTimer}>Start Containment</button> */}
      {phase === "standby" && <div className="standby">Standby</div>}
      {phase === "breach" && <div className="breach">BREACH</div>}
      {phase === "running" && (
        <span className={`timer ${isWarning ? "warning" : ""}`}>
          {formatTime(timeLeft)}
        </span>
      )}
      <span className={`status ${(phase === "breach") ? "warning" : ""}`}>
        {(phase === "breach") ? "Unstable" : "Containment"}
      </span>
    </div>
  )
}

export default Containment;