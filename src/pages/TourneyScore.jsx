import React, { useState, useEffect } from 'react';
import Containment from '../components/Containment';
import './TourneyScore.scss';

const TourneyScore = () => {
  const [scoreBoard, setScoreBoard] = useState([]);
  const [timerEvent, setTimerEvent] = useState({ type: null, count: 0 });
  const ALL_TEAMS = [
    { team_number: 1, team_name: "Afterburner" },
    { team_number: 2, team_name: "Concorde" },
    { team_number: 3, team_name: "Stratos" }
  ];
  const DEFAULT_TEAM = { total_points: 0, mvp: null, mvp_points: null };

  const getScore = (teamNumber) => scoreBoard.find((t) => t.team_number === teamNumber)?.total_points ?? 0;

  //const [effects, setEffects] = useState(null);

  useEffect(() => {
      const fetchScores = async()  => {  
        try {
          const response = await fetch(`https://the13thgeek-nodejs.fly.dev/tourney/scores`,
          //const response = await fetch(`http://localhost:8080/tourney/scores`,
            {
              method: 'POST',
              headers: {
                "x-api-key": '03811255-e942-4003-bc83-504857c32885',
                "Content-Type": "application/json"
              }
            });
          if(response) {
            const result = await response.json();
            //console.log('Fetched Scores: ', result.data.scores);
            const scores = result.data.scores;

            const normalizedScores = ALL_TEAMS.map((team) => {
              const found = scores.find((s) => s.team_number === team.team_number);
              return found ?? { ...DEFAULT_TEAM, ...team };
            });

            setScoreBoard(normalizedScores);
            //setEffects(result.effects);
          }
        } catch(e) {
          console.log('[Scores] Error: ' + e.message);
        }
      };

      fetchScores();
  
      // Real-time updater
      const ws = new WebSocket("wss:///the13thgeek-nodejs.fly.dev");
      //const ws = new WebSocket("ws://localhost:8080");
      ws.onmessage = (event) => {
        const data = JSON.parse(event.data);

        if(data.type === "HEIST_START" || data.type === "HEIST_DROP") {
          setTimerEvent(prev => ({ type: "start", count: prev.count + 1 }));
        }
        if(data.type === "SCORE_UPDATE") {
          fetchScores();
          setTimerEvent(prev => ({ type: "containment", count: prev.count + 1 }));
        }
        if(data.type === "HEIST_END_ROUND") {
          setTimerEvent(prev => ({ type: "end_round", count: prev.count + 1 }));
        }
      };
  
    },[]);

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
      <Containment event={timerEvent} />
    
    </div>
    {/* <pre>
      {JSON.stringify(scoreBoard, null, 2)}
    </pre> */}
    </>
  )
}

export default TourneyScore