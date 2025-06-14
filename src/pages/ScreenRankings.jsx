import React, { useState, useEffect } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay } from 'swiper/modules';
import 'swiper/scss';
import './ScreenRankings.scss';

const ScreenRankings = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [topPlayers, setTopPlayers] = useState([]);
  const [scoreBoard, setScoreBoard] = useState(null);

  const convertTeamName = (num) => {
    switch (num) {
      case 1: return "Afterburner";
      case 2: return "Concorde";
      case 3: return "Stratos";
      default: return "(undefined)";
    }
  };

  const truncateText = (text, maxLength = 13 ) => {
    const isTruncated = text.length > maxLength;
    const displayText = isTruncated ? text.slice(0, maxLength) + "..." : text;
    return displayText;
  };

  useEffect(() => {

    const fetchData = async () => {
      try {
        const [topPlayers] = await Promise.all([
          fetch('https://the13thgeek-nodejs.fly.dev/mainframe/ranking', 
            { method: 'POST', 
              headers: { "x-api-key": '03811255-e942-4003-bc83-504857c32885', "Content-Type": "application/json" },
              body: JSON.stringify({ rank_type: 'exp', items_to_show: 15 })
            })
        ]);
        const dataTopPlayers = await topPlayers.json();

        setTopPlayers(dataTopPlayers);
        setIsLoading(false);
      } catch(e) {
        console.log('Error: ' + e.message);
      }
    };
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

    fetchData();
    fetchScores();

  },[]);

  return (
    <div className="display-container">
      { isLoading === true ? (
        <p>Loading</p>
      ) : (
        <Swiper 
            autoplay={{ delay: 10000, disableOnInteraction: false }} 
            loop={true}
            slidesPerView={1}
            speed={500}
            modules={[Autoplay]} 
            className="carousel-display">
          <SwiperSlide key='1' className='slide-item ranking'>
            <h1 className="screen-name">Top Players 1-5</h1>
            <div className="ranking-container">
              { topPlayers.length > 0 && (topPlayers.slice(0,5)).map((player,idx) => (
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
          </SwiperSlide>
          <SwiperSlide key='2' className='slide-item ranking'>
            <h1 className="screen-name">Top Players 6-10</h1>
            <div className="ranking-container">
              { topPlayers.length > 0 && (topPlayers.slice(5,10)).map((player,idx) => (
                <div className="item" key={idx+6}>
                  <div className="card-preview" style={{backgroundImage: `url(https://mainframe.the13thgeek.com/assets/cards/${player.sysname}.png)`}}>
                    <div className="rank">{idx+6}</div>  
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
          </SwiperSlide>
          <SwiperSlide key='3' className='slide-item ranking'>
            <h1 className="screen-name">Top Players 10-15</h1>
            <div className="ranking-container">
              { topPlayers.length > 0 && (topPlayers.slice(10,15)).map((player,idx) => (
                <div className="item" key={idx+11}>
                  <div className="card-preview" style={{backgroundImage: `url(https://mainframe.the13thgeek.com/assets/cards/${player.sysname}.png)`}}>
                    <div className="rank">{idx+11}</div>  
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
          </SwiperSlide>
          <SwiperSlide key='4' className='slide-item supersonic'>
            {scoreBoard && scoreBoard.map((team, idx) => (
              <div className={'team-box team-'+team.team_number} key={idx}>
                <h4>{convertTeamName(team.team_number)}</h4>
                <div className="mascot-bg"></div>
                <p className='team-score'>{team.total_points}</p>
                {team.mvp !== null && (
                  <div className="mvp">
                    <h5>{truncateText(team.mvp)}</h5>
                    <small>MVP</small>
                  </div>
                )}
              </div>
            ))}
          </SwiperSlide>
        </Swiper>
      )}
      
    </div>
  )
}

export default ScreenRankings