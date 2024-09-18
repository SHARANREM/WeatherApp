import React, {useEffect, useState} from 'react'
import './WeatherApp.css'
import moment from 'moment'
import sunrise from './assets/sunrise.png'
import sunset from './assets/sunset.png'
import speed from './assets/spped.png'
import visiblity from './assets/visibility.png'
import pressure from './assets/pressure-gauge.png'
const WheatherDataLeft = ({city,coordinates}) => {
    const api_key = '592a21a668593703639f163f24d6d6a8';
    const aqiList = ['Good', 'Fair', 'Moderate', 'Poor', 'Very Poor'];

    const [currentWeatherData, setCurrentWeatherData] = useState(null);
    const [fivesDayForecast, setFiveDaysForecast] = useState([]);
    const [airDetails, setAirDetails] = useState(null);
    const [hourForecastData, setHourForecastData] = useState([]);

    function getWeatherDetails(name, lat, lon, country, state){
        const fore_API = `https://api.openweathermap.org/data/2.5/forecast/?lat=${lat}&lon=${lon}&appid=${api_key}`;
        const Weather_API = `https://api.openweathermap.org/data/2.5/weather/?lat=${lat}&lon=${lon}&appid=${api_key}`;
        const Air_API = `https://api.openweathermap.org/data/2.5/air_pollution?lat=${lat}&lon=${lon}&appid=${api_key}`;
        const days = [
            'Sunday',
            'Monday',
            'Tuesday',
            'Wednesday',
            'Thursday',
            'Friday',
            'Saturday'
        ];
        const months = [
            'Jan',
            'Feb',
            'Mar',
            'Apr',
            'May',
            'Jun',
            'Jul',
            'Aug',
            'Sep',
            'Oct',
            'Nov',
            'Dec'
        ];

        fetch(Air_API)
        .then(resp => resp.json())
        .then(data =>{
            //console.log(data);
            let {co, no, no2, o3, so2, pm2_5, pm10, nh3} = data.list[0].components;
            const quality = data.list[0].main.aqi;
            const qualityGrade = aqiList[quality-1];
            setAirDetails({
                Co:co,
                No:no,
                No2:no2,
                O3:o3,
                So2:so2,
                Pm2_5:pm2_5,
                Pm10:pm10,
                Nh3:nh3,
                Quality:quality,
                QualityGrade:qualityGrade,
            });
        })
        .catch(()=>{
            alert("Failed to fetch Air_API")
        });

        fetch(Weather_API)
        .then(resp => resp.json())
        .then(data => {
            //console.log("Data received:", data); 
            //console.log("Sys object:", data.sys);
    if (data && data.sys) {
        let {sunrise, sunset} = data.sys;
        let {timezone, visibility} = data;
        let {humidity, pressure, feels_like} = data.main;
        let {speed} = data.wind;
        let sRise = moment.utc(sunrise, 'X').add(timezone, 'seconds').format('hh:mm A');
        let sSet = moment.utc(sunset, 'X').add(timezone, 'seconds').format('hh:mm A');
        //console.log(typeof(visiblity));
        setCurrentWeatherData({
            temp: (data.main.temp - 273.15).toFixed(2),
            description: data.weather[0].description,
            icon: data.weather[0].icon,
            name: data.name,
            country: data.sys.country,
            date: new Date(),
            SRise: sRise,
            SSet: sSet,
            Humidity:humidity,
            Pressure:pressure,
            Feels_like:(feels_like-273.15).toFixed(2),
            Speed:speed,
            Visiblity:visibility/1000,
        });
    } else {
        console.error("Unexpected data format", data);
    }
        })
        .catch(()=>{
            alert("Failed to Load Weather API");
        });

        fetch(fore_API)
        .then(resp => resp.json())
        .then(data=>{
            //console.log(data);
            let hourlyForecast = data.list;
            
            let uniqueForecast = [];
            let fiveDaysForecast = data.list.filter(forecast => {
                let forecastDate = new Date(forecast.dt_txt).getDate();
                if(!uniqueForecast.includes(forecastDate)){
                    return uniqueForecast.push(forecastDate);
                }
            });
            const hourlyForecastResults = hourlyForecast.map((forecast)=>{
                let hrForecastDate = new Date(forecast.dt_txt);
                let hr = hrForecastDate.getHours();
                let a = 'PM';
                if(hr < 12) a = 'AM';
                if(hr == 0) hr = 12;
                if(hr > 12) hr = hr-12;
                return{
                    icon: `https://openweathermap.org/img/wn/${forecast.weather[0].icon}@2x.png`,
                    temp: (forecast.main.temp - 273.15).toFixed(2),
                    time: `${hr} ${a}`,
                }
            });
            const first7HourlyForecasts = hourlyForecastResults.slice(0, 8);
            setHourForecastData(first7HourlyForecasts);
           // console.log(fiveDaysForecast);
            const fiveDayResults = fiveDaysForecast.map((forecast) => {
                const date = new Date(forecast.dt_txt);
                return {
                    Date: {
                        day: date.getDate(),
                        month: date.getMonth(),
                        year: date.getFullYear(),
                        dayOfWeek: days[date.getDay()],
                    },
                    icon: `https://openweathermap.org/img/wn/${forecast.weather[0].icon}.png`,
                    temperature: (forecast.main.temp - 273.15).toFixed(2),
                    dayOfWeekName: days[date.getDay()],
                    monthName: months[date.getMonth()],
                };
            });  
            setFiveDaysForecast(fiveDayResults);
        })
        .catch(()=>{
            alert("Failed to fetch Forecast API")
        });

    }

    useEffect(()=>{
        let Rev_Geo_API = `http://api.openweathermap.org/geo/1.0/reverse?lat=${coordinates.latitude}&lon=${coordinates.longitude}&limit=1&appid=${api_key}`;

        fetch(Rev_Geo_API)
        .then(resp => resp.json())
        .then(data => {
            let {name, country, state} = data[0];
            getWeatherDetails(name, coordinates.latitude, coordinates.longitude,country,state);
        })
        .catch(()=>{
            alert("Can't Fetch your Location");
        });
        
    },[coordinates]);

    useEffect(()=>{
        let cityName = city;
        if(cityName === "") return;
        let API_URL = `https://api.openweathermap.org/geo/1.0/direct?q=${city}&limit=1&appid=${api_key}`;

        fetch(API_URL)
            .then(resp => resp.json())
            .then(data => {
                let {name, lat, lon, country, state} = data[0];
                getWeatherDetails(name, lat, lon, country, state);
                //console.log(data);
            })
            .catch((e)=>{
                alert("Failed to load API");
                //console.log(e);
            });
    },[city]);

  return (<>
  <div className="weather-data">
    <div className='WeatherDataLeft'>
        <div className="card">
            <div className="current-weather">
                <div className="top">
                    <div className="details">
                        <p>Now</p>
                        <h2>{currentWeatherData!==null?currentWeatherData.temp:"_____"}&deg;C</h2>
                        <p>{currentWeatherData!==null?currentWeatherData.description:"_____"}</p>
                    </div>
                    <div className="icon">
                        <img src={`https://openweathermap.org/img/wn/${currentWeatherData!==null?currentWeatherData.icon:"04d"}@2x.png`} alt="" />
                    </div>
                </div>
                <div className="footer">
                    <hr />
                    <p><i className='bx bxs-calendar' ></i>{currentWeatherData!==null?currentWeatherData.date.toDateString():"_____"}</p>
                    <p><i className='bx bx-location-plus bx-flip-horizontal' ></i>{currentWeatherData!==null?currentWeatherData.name:"_____"}, {currentWeatherData!==null?currentWeatherData.country:"_____"}</p>
                </div>
            </div>
        </div>
        <div className="card">
            <h2>5 days Forecast</h2>
            {fivesDayForecast.length > 0 ? fivesDayForecast.map((forecast, index) => (
                <div className="day-forecast" key={index}>
                <div className="foreitem">
                    <div className="icon-wrapper">
                        <img src={forecast.icon} alt="Forecast Icon" />
                        <span>{forecast.temperature}&deg;C</span>
                    </div>
                    <p>{forecast.dayOfWeekName}</p>
                    <p>{forecast.monthName} {forecast.Date.day}</p>
                </div>
                </div>
        )) : 
            <div className="day-forecast">
                <div className="foreitem">
                    <div className="icon-wrapper">
                        <img src={fivesDayForecast.length>0?fivesDayForecast.icon:"https://openweathermap.org/img/wn/02d.png"} alt="" />
                        <span>_____&deg;C</span>
                    </div>
                    <p>_____</p>
                    <p>_____</p>
                </div>
                <div className="foreitem">
                    <div className="icon-wrapper">
                        <img src="https://openweathermap.org/img/wn/02d.png" alt="" />
                        <span>_____&deg;C</span>
                    </div>
                    <p>_____</p>
                    <p>_____</p>
                </div>
                <div className="foreitem">
                    <div className="icon-wrapper">
                        <img src="https://openweathermap.org/img/wn/02d.png" alt="" />
                        <span>_____&deg;C</span>
                    </div>
                    <p>_____</p>
                    <p>_____</p>
                </div>
                <div className="foreitem">
                    <div className="icon-wrapper">
                        <img src="https://openweathermap.org/img/wn/02d.png" alt="" />
                        <span>_____&deg;C</span>
                    </div>
                    <p>_____</p>
                    <p>_____</p>
                </div>
                <div className="foreitem">
                    <div className="icon-wrapper">
                        <img src="https://openweathermap.org/img/wn/02d.png" alt="" />
                        <span>_____&deg;C</span>
                    </div>
                    <p>_____</p>
                    <p>_____</p>
                </div>
                
            </div>
            }
        </div>  
    </div>
    <div className='Weather-right'>
        <h2>Today's Highlights</h2>
        <div className="highlights">
            <div className="card">
                <div className="card-head">
                    <p>Air Quality Index</p>
                    <p className={`air-index aqi-${airDetails!==null?airDetails.Quality:"_____"}`}>{airDetails!==null?airDetails.QualityGrade:"_____"}</p> 
                </div>
                <div className="air-indices">
                <i className='bx bx-wind bx-lg'></i>
                <div className="itemss">
                    <p>PM2.5</p>
                    <h2>{airDetails!==null?airDetails.Pm2_5:"_____"}</h2>
                </div>
                <div className="itemss">
                    <p>PM10</p>
                    <h2>{airDetails!==null?airDetails.Pm10:"_____"}</h2>
                </div>
                <div className="itemss">
                    <p>SO2</p>
                    <h2>{airDetails!==null?airDetails.So2:"_____"}</h2>
                </div>
                <div className="itemss">
                    <p>CO</p>
                    <h2>{airDetails!==null?airDetails.Co:"_____"}</h2>
                </div>
                <div className="itemss">
                    <p>NO</p>
                    <h2>{airDetails!==null?airDetails.No:"_____"}</h2>
                </div>
                <div className="itemss">
                    <p>NO2</p>
                    <h2>{airDetails!==null?airDetails.No2:"_____"}</h2>
                </div>
                <div className="itemss">
                    <p>NH3</p>
                    <h2>{airDetails!==null?airDetails.Nh3:"_____"}</h2>
                </div>
                <div className="itemss">
                    <p>O3</p>
                    <h2>{airDetails!==null?airDetails.O3:"_____"}</h2>
                </div>
                </div>
            </div>
            <div className="card">
                <div className="card-head">
                    <p>Sunrise & Sunset</p>
                </div>
                <div className="sunrise-sunset">
                    <div className="item mar">
                        <div className="icon">
                            <img src={sunrise} alt="Sunrise" />
                        </div>
                        <div>
                            <p>Sunrise</p>
                            <h2>{currentWeatherData!==null?currentWeatherData.SRise:"_____"}</h2>
                        </div>
                    </div>
                    <div className="item">
                        <div className="icon">
                            <img src={sunset} alt="Sunset" />
                        </div>
                        <div>
                            <p>Sunset</p>
                            <h2>{currentWeatherData!==null?currentWeatherData.SSet:"_____"}</h2>
                        </div>
                    </div>
                </div>
            </div>
            <div className="card">
                <div className="card-head">
                    <p>Humidity</p>
                </div>
                <div className="card-item">
                <i className='bx bx-droplet bx-lg'></i>
                <h2 id='humidityVal'>{currentWeatherData!==null?currentWeatherData.Humidity:"_____"} %</h2>
                </div>
            </div>
            <div className="card">
                <div className="card-head">
                    <p>Pressure</p>
                </div>
                <div className="card-item">
                <img src={pressure} alt="Pressure" />
                <h2 id='pressureVal'>{currentWeatherData!==null?currentWeatherData.Pressure:"_____"} hPa</h2>
                </div>
            </div>
            <div className="card">
                <div className="card-head">
                    <p> Visiblity</p>
                </div>
                <div className="card-item">
                <img src={visiblity} alt="Sunset" />
                <h2 id='visiblityVal'>{currentWeatherData!==null?currentWeatherData.Visiblity:"_____"} km</h2>
                </div>
            </div>
            <div className="card">
                <div className="card-head">
                    <p>Wind Speed</p>
                </div>
                <div className="card-item">
                <img src={speed} alt="Sunset" />
                <h2 id='windSpeedVal'>{currentWeatherData!==null?currentWeatherData.Speed:"_____"} m/s</h2>
                </div>
            </div>
            <div className="card">
                <div className="card-head">
                    <p>Feels Like</p>
                </div>
                <div className="card-item">
                <i className='bx bxs-thermometer bx-lg'></i>
                <h2 id='feelsVal'>{currentWeatherData!==null?currentWeatherData.Feels_like:"_____"} &deg;C</h2>
                </div>
            </div>
        </div>
        <h2>Today at</h2>
        <div className="hourly-forecast">
            {hourForecastData.length > 0 ? hourForecastData.map((forecast, index) => (
            <div className="card" key={index}>
                <p>{forecast.time}</p>
                <img src={forecast.icon} alt="" />
                <p>{forecast.temp}&deg;C</p>
            </div>
            )) : (
            Array(8).fill().map((_, i) => (
            <div className="card" key={i}>
                <p>9 AM</p>
                <img src="https://openweathermap.org/img/wn/04d.png" alt="" />
                <p>____&deg;C</p>
            </div>
            ))
        )}
        </div>
    </div>
    </div>
    </>
  )
}

export default WheatherDataLeft