import { useState, useEffect, useRef, useCallback } from 'react';
import './ContainmentTimer.scss';

//const TIMER_DURATION_SEC = 15 * 60; // 15 minutes
//const WARNING_THRESHOLD_SEC = 13 * 60; // 13 minutes
const TIMER_DURATION_SEC = 1.25 * 60;
const WARNING_THRESHOLD_SEC = 30;

export const MODE = {
  STANDBY: 'STANDBY',
  BREACH: 'BREACH',
  CONTAIN: 'CONTAIN',
  RESET: 'RESET'
}

const formatTime = (seconds) => {
  const min = Math.floor(seconds / 60).toString().padStart(2, '0');
  const sec = (seconds % 60).toString().padStart(2, '0');
  return `${min}:${sec}`;
}

const ContainmentTimer = ({ mode, onBreach }) => {
  const [timeLeft, setTimeLeft] = useState(TIMER_DURATION_SEC);
  const intervalRef = useRef(null);
  const prevMode = useRef(mode);

  const stopTimer = useCallback(() => {
    clearInterval(intervalRef.current);
    intervalRef.current = null;
  }, []);

  const startTimer = useCallback((from = TIMER_DURATION_SEC) => {
    stopTimer();
    setTimeLeft(from);
    intervalRef.current = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          clearInterval(intervalRef.current);
          intervalRef.current = null;
          onBreach?.();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  }, [stopTimer, onBreach]);

  useEffect(() => {
    const prev = prevMode.current;
    prevMode.current = mode;

    if (mode === MODE.CONTAIN && prev !== MODE.CONTAIN) {
      startTimer();
    } else if (mode === MODE.RESET) {
      startTimer();
    } else if (mode === MODE.STANDBY || mode === MODE.BREACH) {
      stopTimer();
      setTimeLeft(TIMER_DURATION_SEC);
    }

  }, [mode, startTimer, stopTimer]);

  useEffect(() => () => stopTimer(), [stopTimer]);

  const isRunning = mode === MODE.CONTAIN || mode === MODE.RESET;
  const isWarning = isRunning && timeLeft <= WARNING_THRESHOLD_SEC;

  return (
    <div className="containment-timer">
      <div className={`timer-indicator ${isWarning ? 'warning' : ''}`}>
      {formatTime(timeLeft)}
      </div>
      <div className="mode-display">{mode}</div>
    </div>
  )
}

export default ContainmentTimer