import React from 'react';
import { useState, useEffect } from 'react';
import GachaMachineList from '../components/GachaMachineList';
import Airshow from '../components/Airshow';
import './SkyScreen.scss';

const SkyScreen = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [cards, setCards] = useState([]);
  const slides = [
    { component: 
      <div className='wrapper' key={currentSlide}>
        <Airshow />
      </div>,
      duration: 60000 },
    { component: 
      <div className="wrapper" key={currentSlide}>
        <div className='banner donkeykong'></div>, 
      </div>,
      duration: 15000 },
    { component: 
      <div className='wrapper' key={currentSlide}>
        <div className='banner stratos'></div>
      </div>,
      duration: 15000 },
    { component: 
      <div className='wrapper' key={currentSlide}>
        <div className='banner mainframe'></div>
      </div>,
      duration: 15000 },
    { component: 
      <div className='wrapper' key={currentSlide}>
        <GachaMachineList cards={cards} />
      </div>, 
      duration: 30000 },
    { component: 
      <div className="wrapper" key={currentSlide}>
        <div className='banner hd2'></div>, 
      </div>,
      duration: 15000 },
    { component: 
      <div className="wrapper" key={currentSlide}>
        <div className='banner nobeans'></div>, 
      </div>,
      duration: 15000 }
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
  },[]);

  useEffect(() => {    
    const loop = setTimeout(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length)
    }, slides[currentSlide].duration);

    return () => clearTimeout(loop);
  }, [currentSlide, slides]);

  return (
    <div className="skyscreen">
      {slides[currentSlide].component}
    </div>
  )
}

export default SkyScreen