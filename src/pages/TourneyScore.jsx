import React, { useState, useEffect } from 'react';
import './TourneyScore.scss';

const TourneyScore = () => {
  const [scoreBoard, setScoreBoard] = useState([]);
  const [effects, setEffects] = useState(null);

  useEffect(() => {
      const fetchScores = async()  => {  
        try {
          const response = await fetch(`https://the13thgeek-nodejs.fly.dev/mainframe/showdown-scores`,
          //const response = await fetch(`http://localhost:8080/mainframe/showdown-scores`,
            {
              method: 'POST',
              headers: {
                "x-api-key": '03811255-e942-4003-bc83-504857c32885',
                "Content-Type": "application/json"
              }
            });
          if(response) {
            const result = await response.json();
            
            setScoreBoard(result.scoreboard);
            setEffects(result.effects);
          }
        } catch(e) {
          console.log('[Scores] Error: ' + e.message);
        }
      };

      fetchScores();
  
      // Real-time updater
      const ws = new WebSocket("wss:///the13thgeek-nodejs.fly.dev");
      ws.onmessage = (event) => {
        const data = JSON.parse(event.data);

        if(data.type === "SCORE_UPDATE") {
          fetchScores();
        }
      };
  
    },[]);

  return (
    <>
    <div className='tscore'>
      {scoreBoard && scoreBoard.length >= 3 && (
        <>
        <div className={`team afb ${effects.blocked_teams.some(([team, reason]) => team === scoreBoard[0].team_number) ? 'grounded' : ''}`}>
          <div className="name">Afterburner</div>
          <div className="score">{scoreBoard[0].total_points}</div>
        </div>
        <div className={`team ccd ${effects.blocked_teams.some(([team, reason]) => team === scoreBoard[1].team_number) ? 'grounded' : ''}`}>
          <div className="name">Concorde</div>
          <div className="score">{scoreBoard[1].total_points}</div>
        </div>
        <div className={`team sts ${effects.blocked_teams.some(([team, reason]) => team === scoreBoard[2].team_number) ? 'grounded' : ''}`}>
          <div className="name">Stratos</div>
          <div className="score">{scoreBoard[2].total_points}</div>
        </div>
        </>
      )}
      
    </div>
    <pre>
      {JSON.stringify(effects, null, 2)}
    </pre>
    </>
  )
}

export default TourneyScore