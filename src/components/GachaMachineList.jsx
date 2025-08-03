import React from 'react';
import './GachaMachineList.scss';

const GachaMachineList = ({ cards }) => {

  return (
    <div className='banner gacha-list'>
      {cards.length > 0 ? (
        <ul className="card-list">
          {cards.map((card) => (
            <li key={card.id} className='card-thumb'>
              <img src={'/browsersrc-mainframe/img/cards/' + card.sysname + '-thumb.png'} alt="card" />
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