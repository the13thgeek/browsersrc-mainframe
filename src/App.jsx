import React from 'react';
import './App.css'
import { HashRouter as Router, Routes, Route } from 'react-router-dom';
import Navigator from './components/Navigator';
import ScreenRankings from './pages/ScreenRankings';
import TourneyScore from './pages/TourneyScore';
import TourneyScoreMin from './pages/TourneyScoreMin';
import SkyScreen from './pages/SkyScreen';
import ScreenAlertOverlay from './pages/ScreenAlertOverlay';

function App() {

  return (
    <>
      <Router>
        <Routes>
          <Route index element={<ScreenRankings />} />
          <Route element={<TourneyScore />} path='/tourney' />
          <Route element={<TourneyScoreMin />} path='/tourney/min' />
          <Route element={<SkyScreen />} path='/skyscreen' />
          <Route element={<ScreenAlertOverlay />} path='/alert' />
        </Routes>
        <Navigator />
      </Router>
    </>
  )
}

export default App
