import React from 'react';
import { NavLink } from 'react-router-dom'; 

const Navigator = () => {
  return (
    <nav>
      <ul>
        <li><NavLink to='/'>Rankings</NavLink></li>
        <li><NavLink to='/tourney'>Tourney Score</NavLink></li>
      </ul>
    </nav>
  )
}

export default Navigator