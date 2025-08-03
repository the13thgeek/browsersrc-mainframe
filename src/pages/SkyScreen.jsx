import React from 'react';
import { useState, useEffect } from 'react';
import GachaMachineList from '../components/GachaMachineList';
import './SkyScreen.scss';

const SkyScreen = () => {
  const [index, setIndex] = useState(0);
  const [cards, setCards] = useState([]);
  const timeout = 15000;
  const banners = [
    <div className='banner mainframe' key={1}></div>,
    <GachaMachineList key={2} cards={cards} />,
    <div className='banner nobeans' key={3}></div>
  ];


  useEffect(() => {
    async function fetchCards() {
      try {
        const res = await fetch(`https://the13thgeek-nodejs.fly.dev/mainframe/get-available-cards`,
        //const response = await fetch(`http://localhost:8080/mainframe/showdown-scores`,
          {
            method: 'POST',
            headers: {
              "x-api-key": '03811255-e942-4003-bc83-504857c32885',
              "Content-Type": "application/json"
            }
          });
        const data = await res.json();
        setCards(data.list);
      } catch(e) {
        console.error("Failed to fetch cards",e);
      }
    }
    fetchCards();

    const loop = setInterval(() => {
      setIndex((prev) => (prev+1) % banners.length);
    }, timeout);

    return () => clearInterval(loop);
  }, []);

  return (
    <div className="skyscreen">
      {banners[index]}
    </div>
  )
}

export default SkyScreen