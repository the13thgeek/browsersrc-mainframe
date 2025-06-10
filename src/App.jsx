import React from 'react';
import './App.css'
import { HashRouter as Router, Routes, Route } from 'react-router-dom';
import Navigator from './components/Navigator';
import ScreenRankings from './pages/ScreenRankings';
import TourneyScore from './pages/TourneyScore';

function App() {

  return (
    <>
      <Router>
        <Routes>
          <Route index element={<ScreenRankings />} />
          <Route element={<TourneyScore />} path='/tourney' />
        </Routes>
        <Navigator />
      </Router>
    </>
  )
}

export default App
