import React from 'react'
import Animation from './assets/Preloader.gif'
import './WeatherApp.css'
const Preloader = () => {
  return (
      <div id='LoadingAnimation'>
        <img src={Animation}alt="Loading..."/>
      </div>
      )
}

export default Preloader