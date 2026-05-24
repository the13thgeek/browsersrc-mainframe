import React, { useState, useEffect, useRef, useCallback } from 'react';
import ContainmentTimer, { MODE } from '../components/ContainmentTimer';
import './TourneyScore.scss';

const ts = () => `+${Date.now() % 100000}ms`;

const TourneyScore = () => {
  const [scoreBoard, setScoreBoard] = useState([]);
  const [timerMode, setTimerMode] = useState(MODE.STANDBY);
  const resetTimeoutRef = useRef(null);
  
  const triggerReset = () => {
    console.trace(`[${ts()}] triggerReset called`);
    clearTimeout(resetTimeoutRef.current);
    setTimerMode(MODE.CONTAIN);
    resetTimeoutRef.current = setTimeout(() => {
      console.log(`[${ts()}] setTimeout firing → MODE.RESET`);
      setTimerMode(MODE.RESET);
    }, 0);
  };

  const handleBreach = useCallback(() => {
    console.log(`[${ts()}] handleBreach called → MODE.BREACH`);
    setTimerMode(MODE.BREACH);
  }, []);

  const ALL_TEAMS = [
    { team_number: 1, team_name: "Afterburner" },
    { team_number: 2, team_name: "Concorde" },
    { team_number: 3, team_name: "Stratos" }
  ];
  const DEFAULT_TEAM = { total_points: 0, mvp: null, mvp_points: null };

  const getScore = (teamNumber) => scoreBoard.find((t) => t.team_number === teamNumber)?.total_points ?? 0;

  useEffect(() => {
    let active = true;

    const fetchScores = async () => {
      console.log(`[${ts()}] fetchScores() called`);
      try {
        const response = await fetch(`https://the13thgeek-nodejs.fly.dev/tourney/scores`, {
          method: 'POST',
          headers: {
            "x-api-key": '03811255-e942-4003-bc83-504857c32885',
            "Content-Type": "application/json"
          }
        });
        if (response) {
          console.log(`[${ts()}] fetchScores() response received`);
          const result = await response.json();
          const scores = result.data.scores;
          const normalizedScores = ALL_TEAMS.map((team) => {
            const found = scores.find((s) => s.team_number === team.team_number);
            return found ?? { ...DEFAULT_TEAM, ...team };
          });
          setScoreBoard(normalizedScores);
        }
      } catch (e) {
        console.log(`[${ts()}] fetchScores() error: ` + e.message);
      }
    };

    fetchScores();

    const ws = new WebSocket("wss://the13thgeek-nodejs.fly.dev");
    ws.onmessage = (event) => {
      if (!active) return;
      (async () => {
        const data = JSON.parse(event.data);
        console.log(`[${ts()}] WS received: ${data.type}`);

        if (data.type === "HEIST_GRAB" || data.type === "HEIST_STEAL_SUCCESS" || data.type === "HEIST_PASS") {
          fetchScores();
          console.log(`[${ts()}] → triggerReset()`);
          triggerReset();
        }
        else if (data.type === "HEIST_STEAL_FALSE") {
          fetchScores();
          console.log(`[${ts()}] → no reset`);
        }
        else if (data.type === "HEIST_END_ROUND") {
          fetchScores();
          console.log(`[${ts()}] → MODE.STANDBY`);
          setTimerMode(MODE.STANDBY);
        }
        else if (data.type === "HEIST_DROP" || data.type === "HEIST_START") {
          fetchScores();
          console.log(`[${ts()}] → MODE.BREACH`);
          setTimerMode(MODE.BREACH);
        }
      })();
    };

    return () => {
      console.log(`[${ts()}] cleanup: closing WS`);
      active = false;
      ws.close();
    };
  }, []);

  return (
    <>
      <div className='tscore'>
        <div className={`team afb`}>
          <div className="name">Afterburner</div>
          <div className="score">{getScore(1)}</div>
        </div>
        <div className={`team ccd`}>
          <div className="name">Concorde</div>
          <div className="score">{getScore(2)}</div>
        </div>
        <div className={`team sts`}>
          <div className="name">Stratos</div>
          <div className="score">{getScore(3)}</div>
        </div>
        <ContainmentTimer mode={timerMode} onBreach={handleBreach} />
      </div>
    </>
  );
};

export default TourneyScore;