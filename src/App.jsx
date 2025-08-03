import React from 'react';
import './App.css'
import { HashRouter as Router, Routes, Route } from 'react-router-dom';
import Navigator from './components/Navigator';
import ScreenRankings from './pages/ScreenRankings';
import TourneyScore from './pages/TourneyScore';
import SkyScreen from './pages/SkyScreen';

function App() {

  return (
    <>
      <Router>
        <Routes>
          <Route index element={<ScreenRankings />} />
          <Route element={<TourneyScore />} path='/tourney' />
          <Route element={<SkyScreen />} path='/skyscreen' />
        </Routes>
        <Navigator />
      </Router>
    </>
  )
}

export default App
