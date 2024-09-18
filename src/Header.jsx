import {useState} from 'react'
import './WeatherApp.css'
import Logo from './assets/Logo.png'
const Header = ({setCity, setCoordinates }) => {
    const [cityInput,setCityInput] = useState(""); 

    window.addEventListener('load',getLocationData);
    
    function handleInput(e){setCityInput(e.target.value);}

    function getCityData() {
        if (cityInput.trim() !== "") {
          setCity(cityInput);
          setCityInput(""); 
        }
      }
      function getLocationData(){
        navigator.geolocation.getCurrentPosition(
            position => {
                let {latitude, longitude} = position.coords;
                setCoordinates({ latitude, longitude });;
            },
            error => {
                if(error.code === error.PERMISSION_DENIED){
                    alert("GeoLocation Permission Denied. Please reset location permission to grant access again")
                }
                console.error("Geolocation error:", error);
            }
        );
        
      }
  return (
    <div className='Header'>
        <h2 id='title'><img src={Logo} alt="Logo"/>Wheather App</h2>
        <div className="Wheather-Input">
            <input type="text"
                   placeholder='Enter City Name'
                   id='cityInput'
                   value={cityInput}
                   onChange={handleInput}/>
            <button id="searchBtn" onClick={getCityData}>
                <i className='bx bx-search-alt-2' ></i>
                Search
            </button>
        </div>
        <div className="Location-Input">
            <button id="locationBtn" onClick={getLocationData}>
                <i className='bx bx-current-location'></i>
                Current Location
            </button>
        </div>
    </div>
  )
}

export default Header