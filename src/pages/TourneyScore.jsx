import React, { useState, useEffect } from 'react';
import './TourneyScore.scss';

const TourneyScore = () => {
  const [scoreBoard, setScoreBoard] = useState([]);

  useEffect(() => {
      const fetchScores = async()  => {  
        try {
          const response = await fetch(`https://the13thgeek-nodejs.fly.dev/mainframe/showdown-scores`,
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
    <div className='tscore'>
      {scoreBoard && scoreBoard.length >= 3 && (
        <>
        <div className="team afb">
          <div className="name">Afterburner</div>
          <div className="score">{scoreBoard[0].total_points}</div>
        </div>
        <div className="team ccd">
          <div className="name">Concorde</div>
          <div className="score">{scoreBoard[1].total_points}</div>
        </div>
        <div className="team sts">
          <div className="name">Stratos</div>
          <div className="score">{scoreBoard[2].total_points}</div>
        </div>
        </>
      )}
      
    </div>
  )
}

export default TourneyScore