import React, { useState, useEffect } from 'react';
import './ScreenRankings.scss';

const ScreenRankings = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [topPlayers, setTopPlayers] = useState([]);

  useEffect(() => {

    const fetchData = async () => {
      try {
        const [topPlayers] = await Promise.all([
          fetch('https://the13thgeek-nodejs.fly.dev/mainframe/ranking', 
            { method: 'POST', 
              headers: { "x-api-key": '03811255-e942-4003-bc83-504857c32885', "Content-Type": "application/json" },
              body: JSON.stringify({ rank_type: 'exp', items_to_show: 5 })
            })
        ]);
        const dataTopPlayers = await topPlayers.json();

        setTopPlayers(dataTopPlayers);
        setIsLoading(false);
      } catch(e) {
        console.log('Error: ' + e.message);
      }
    };

    fetchData();

  },[]);

  return (
    <div className="src-box">
      { isLoading === true ? (
        <p>Loading</p>
      ) : (
        <>
        <h1 className="screen-name">Top Players</h1>
        <div className="ranking-container">
          { topPlayers.length > 0 && topPlayers.map((player,idx) => (
            <div className="item" key={idx}>
              <div className="card-preview" style={{backgroundImage: `url(https://mainframe.the13thgeek.com/assets/cards/${player.sysname}.png)`}}>
                <div className="rank">{idx+1}</div>  
                <div className="avatar">
                  <img src={player.twitch_avatar} alt="Avatar" />
                </div>
              </div>
              <div className="content">
                <h3 className='player-name'>{player.twitch_display_name}</h3>
                {/* { JSON.stringify(player,null,2) }     */}
              </div>
            </div>
          ))}
        </div>
        </>
      )}
      
    </div>
  )
}

export default ScreenRankings