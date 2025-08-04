import React, { useState, useEffect } from 'react';
import './Airshow.scss';

const getRandomDelta = (value, min, max, step = 1) => {
  const delta = (Math.random() - 0.5) * step * 2;
  const newVal = Math.max(min, Math.min(max, value + delta));
  return Math.round(newVal);
};

const Airshow = () => {
  const [stats, setStats] = useState({
    airspeed: getRandomDelta(525, 520, 590, 10),
    altitude: getRandomDelta(36224, 36000, 41000, 100),
    temp: getRandomDelta(-44, -55, -40, 4),
    uplink: getRandomDelta(91, 80, 100, 3)
  });

  useEffect(() => {
    const interval = setInterval(() => {
      setStats(prev => ({
        airspeed: getRandomDelta(prev.airspeed, 520, 590, 10),
        altitude: getRandomDelta(prev.altitude, 36000, 41000, 100),
        temp: getRandomDelta(prev.temp, -55, -40, 4),
        uplink: getRandomDelta(prev.uplink, 80, 100, 3)
      }));
    }, 2000);

    return () => clearInterval(interval); // Clean up on unmount
  },[]);

  return (
    <div className='airshow'>
      <div className="logo">
        <img src="/browsersrc-mainframe/img/airshow-logo.png" alt="" />
      </div>
      <div className="stats">
        <div className="stat-table">
          <div className="item">
            <span className="field">Airspeed</span>
            <span className="value">{stats.airspeed} kts</span>
          </div>
          <div className="item">
            <span className="field">Altitude</span>
            <span className="value">{stats.altitude} ft</span>
          </div>
          <div className="item">
            <span className="field">Outside Temp</span>
            <span className="value">{stats.temp} &deg;C</span>
          </div>
          <div className="item">
            <span className="field">Uplink Signal</span>
            <span className="value">{stats.uplink}%</span>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Airshow