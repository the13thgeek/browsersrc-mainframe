import React from 'react';
import './App.css'
import { HashRouter as Router, Routes, Route } from 'react-router-dom';
import Navigator from './components/Navigator';
import ScreenRankings from './pages/ScreenRankings';

function App() {

  return (
    <>
      <Router>
        <Routes>
          <Route index element={<ScreenRankings />} />
        </Routes>
        <Navigator />
      </Router>
    </>
  )
}

export default App
