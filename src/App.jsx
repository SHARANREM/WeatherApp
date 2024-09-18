import { useState, useEffect } from 'react'
import './App.css'
import Preloader from './Preloader'
import WeatherApp from './WeatherApp';

function App() {
  const [loading, setLoading] = useState(true);
  useEffect(()=>{
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
    }, 3500);
  },[])

  return (
    <>
      {loading?<Preloader/>:<WeatherApp/>};
    </>
  )
}

export default App
