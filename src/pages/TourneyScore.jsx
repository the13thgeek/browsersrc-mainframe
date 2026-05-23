import React, { useState, useEffect } from 'react';
import Containment from '../components/Containment';
import './TourneyScore.scss';

const TourneyScore = () => {
  const [scoreBoard, setScoreBoard] = useState([]);
  const [timerEvent, setTimerEvent] = useState(null);
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
            console.log('Fetched Scores: ', result.data.scores);

            setScoreBoard(result.data.scores);
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
          setTimerEvent("start");
        }
        if(data.type === "SCORE_UPDATE") {
          fetchScores();
          setTimerEvent("containment");
        }
      };
  
    },[]);

  return (
    <>
    <div className='tscore'>
      {scoreBoard && scoreBoard.length >= 0 && (
        <>
        <div className={`team afb`}>
          <div className="name">Afterburner</div>
          <div className="score">{scoreBoard[0] ? scoreBoard[0].total_points : 0}</div>
        </div>
        <div className={`team ccd`}>
          <div className="name">Concorde</div>
          <div className="score">{scoreBoard[1] ? scoreBoard[1].total_points : 0}</div>
        </div>
        <div className={`team sts`}>
          <div className="name">Stratos</div>
          <div className="score">{scoreBoard[2] ? scoreBoard[2].total_points : 0}</div>
        </div>
        <Containment event={timerEvent} />
        </>
      )}
      
    </div>
    {/* <pre>
      {JSON.stringify(scoreBoard, null, 2)}
    </pre> */}
    </>
  )
}

export default TourneyScore