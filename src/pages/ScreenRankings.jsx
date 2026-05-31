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

  const ALL_TEAMS = [
    { team_number: 1, team_name: "Delta Syndicate" },
    { team_number: 2, team_name: "Sigma Collective" },
    { team_number: 3, team_name: "Zeta Enclave" }
  ];
  const DEFAULT_TEAM = { total_points: 0, mvp: null, mvp_points: null };

  const getScore = (teamNumber) => scoreBoard?.find((t) => t.team_number === teamNumber)?.total_points ?? 0;
  const getMvp = (teamNumber) => scoreBoard?.find((t) => t.team_number === teamNumber)?.mvp ?? null;

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
        const ranks = dataTopPlayers.data;
        const minItems = 15;

        while(ranks.length < minItems) {
          ranks.push({
            active_card: null,
            exp: -1,
            id: -1,
            is_premium: 0,
            level: 0,
            levelProgress: 0,
            sub_months: 0,
            sysname: "standard",
            team: null,
            title: "n00b",
            twitch_avatar: "img/avatar-null.png",
            twitch_display_name: "[no data]",
            values: 0
          });
        }

        setTopPlayers(ranks);
        setIsLoading(false);
      } catch(e) {
        console.log('Error: ' + e.message);
      }
    };
    const fetchScores = async () => {
      try {
        const response = await fetch(`https://the13thgeek-nodejs.fly.dev/tourney/scores`, {
          method: 'POST',
          headers: {
            "x-api-key": '03811255-e942-4003-bc83-504857c32885',
            "Content-Type": "application/json"
          }
        });
        if (response) {
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
            <h1 className="screen-name">Top Players 11-15</h1>
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
          <SwiperSlide key='4' className='slide-item heist'>
            <div className='team-box team-1'>
              <h4>Delta Syndicate</h4>    
              <div className="mascot-bg"></div>
              <p className='team-score'>{getScore(1)}</p>
              {getMvp(1) !== null && (
                <div className='mvp'>
                  <h5>{getMvp(1)}</h5>
                  <small>MVP</small>
                </div>
              )}
            </div>
            <div className='team-box team-2'>
              <h4>Sigma Collective</h4>    
              <div className="mascot-bg"></div>
              <p className='team-score'>{getScore(2)}</p>
              {getMvp(2) !== null && (
                <div className='mvp'>
                  <h5>{getMvp(2)}</h5>
                  <small>MVP</small>
                </div>
              )}
            </div>
            <div className='team-box team-3'>
              <h4>Zeta Enclave</h4>    
              <div className="mascot-bg"></div>
              <p className='team-score'>{getScore(3)}</p>
              {getMvp(3) !== null && (
                <div className='mvp'>
                  <h5>{getMvp(3)}</h5>
                  <small>MVP</small>
                </div>
              )}
            </div>
          </SwiperSlide>
        </Swiper>
      )}
      
    </div>
  )
}

export default ScreenRankings