import React, {useState} from 'react'
import './WeatherApp.css'
import Header from './Header'
import WeatherDataMain from './WeatherDataMain'
const WheatherApp = () => {
  const [city,setCity] = useState("");
  const [coordinates, setCoordinates] = useState({ latitude: null, longitude: null });

  return (
    <>
      <Header setCity={setCity} setCoordinates={setCoordinates} />
      <WeatherDataMain city={city} coordinates={coordinates}/>
    </>
  )
}

export default WheatherApp