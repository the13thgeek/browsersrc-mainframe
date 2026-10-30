import React from 'react';
import './GachaMachineList.scss';

const GachaMachineList = ({ nameplates }) => {

  return (
    <div className='banner gacha-list'>
      {nameplates.length > 0 ? (
        <ul className="card-list">
          {nameplates.map((nameplate) => (
            <li key={nameplate.id} className='card-thumb'>
              <img src={`/browsersrc-mainframe/img/cards/${nameplate.sysname}-thumb.png`} alt={nameplate.name} />
            </li>
          ))}
        </ul>
      ) : (
        <p>Loading...</p>
      )}
      <div className='instruction'>
        <p>Redeem <b>Mystery Card Pull</b> and try your luck on getting one of these!</p>
      </div>
    </div>
  )
}

export default GachaMachineList