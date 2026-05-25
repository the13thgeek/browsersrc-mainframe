import { useState, useEffect, useRef, useCallback } from 'react';
import './ContainmentTimer.scss';

const TIMER_DURATION_SEC = 15 * 60; // 15 minutes
const WARNING_THRESHOLD_SEC = 2 * 60; // 13 minutes

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
          setTimeout(() => onBreach?.(),10);
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
  //const isWarning = isRunning && timeLeft <= WARNING_THRESHOLD_SEC;
  const isCritical = isRunning && timeLeft <= 30;
  const isWarning  = isRunning && !isCritical && timeLeft <= WARNING_THRESHOLD_SEC;


  return (
    <div className="containment-timer">
      { isRunning && (
        <div className={`timer-indicator ${isCritical ? 'critical' : isWarning ? 'warning' : isRunning ? 'running' : ''}`}>
          {formatTime(timeLeft)}
        </div>
      )}
      { mode === MODE.STANDBY && (
        <div className="mode-display standby">Standby</div>
      )}
      { (mode === MODE.RESET || mode === MODE.CONTAIN) && (
        <div className={`mode-display contain ${isCritical ? 'critical' : isWarning ? 'warning' : isRunning ? 'running' : ''}`}>
         {isCritical ? 'Critical' : isWarning ? 'Unstable' : isRunning ? 'Containment' : ''}
        </div>
      )}
      { mode === MODE.BREACH && (
        <div className="mode-display breach">Breach</div>
      )}
    </div>
  )
}

export default ContainmentTimer