import { useRouter } from 'next/router'
import cities from 'cities.json';
import React, { useState } from 'react';
import App from '../../styles/App.module.css'

const Post = () => {
	// the value of the search field 
	const [name, setName] = useState('');

	// the search result
	const [foundCities, setFoundCities] = useState();
  
	const setCityHandler = (name, country) =>{
	  window.location = "/location/" + name;
	}
  
	const filter = (e) => {
	  const keyword = e.target.value;
  
	  if (keyword !== '') {
		const results = cities.filter((city) => {
		  return city.name.toLowerCase().startsWith(keyword.toLowerCase());
		  // Use the toLowerCase() method to make it case-insensitive
		});
		const size = 3;
		const items = results.slice(0, size)
		setFoundCities(items);
	  } else {
		setFoundCities();
		// If the text field is empty, show all cities
	  }
  
	  setName(keyword);
	};

  const router = useRouter()
  const { city } = router.query

  const results = cities.filter((cityFilter) => {
    return cityFilter.name.startsWith(city);
    // Use the toLowerCase() method to make it case-insensitive
  });
  const size = 1;
  const items = results.slice(0, size)
  
  if (items.length > 0) {
    getWeather('https://api.openweathermap.org/data/2.5/onecall?lat=' + items[0].lat + '&lon=' + items[0].lng + '&units=metric&appid=7b26c92417fd3678d52eac12dc870222', city = city)
	// getWeather('/testweather.json', city = city)

    return (<div>
		<div id="weatherTop" class="forecast-container">
			
		</div>
		<div class="forecast-container-city">
			<div className={App.container}>
			<input
				type="search"
				value={name}
				onChange={filter}
				className={App.input}
				placeholder="Filter"
			/>
			<div className={App.citylist}>
				{foundCities && foundCities.length > 0 ? (
				foundCities.map((city) => (
					<li key={city.id} className={App.city} onClick={()=> setCityHandler(city.name, city.country)}>
					<span className={App.citycountry}>{city.country}</span>
					<span className={App.cityname}>{city.name}</span>
					<span className={App.citylatlng}>Latitude: {city.lat}<br></br>Longitude: {city.lng}</span>
					</li>
				))
				) : ((name == '') ? (<h1 className={App.messagehome}>Input keyword!</h1>) : (
				<h1 className={App.messagehome}>No results found!</h1>
				))}
			</div>
			</div>
			<link rel="stylesheet" href="/style.css"></link>
			</div>

		<div id="weatherDay" class="forecast-container">
				
		</div>

        <div id="weatherWeek" class="forecast-container">
				
		</div>
        <script src="/js/jquery-1.11.1.min.js"></script>
		<script src="/js/plugins.js"></script>
		<script src="/js/app.js"></script>
		<link href="http://fonts.googleapis.com/css?family=Roboto:300,400,700|" rel="stylesheet" type="text/css"/>
		<link href="/fonts/font-awesome.min.css" rel="stylesheet" type="text/css"/>
		<link rel="stylesheet" href="/style.css"></link>
    </div>)
  } else {
    return (<p style={{textalign: "center"}}>No results found! <a href="/" style={{color: '#1E90FF'}}>Back to Home page</a></p>)
  }
}

function getWeather(url = '', city = '') {
    fetch(url)
    .then((response) => response.json())
    .then((data) => {
  	// console.log(data);

	  	document.getElementById("weatherTop").innerHTML = "";
		var html = '<h1 style="margin-left:20px;margin-top:20px"><a href="/">Home</a></h1>';
		document.getElementById("weatherTop").insertAdjacentHTML('afterbegin',html);

		document.getElementById("weatherDay").innerHTML = "";
		// Now
		var html = '<div class="forecast" style="width:200px">';
		html += '<div class="forecast-content">';
		html += '<h1>Hourly</h1>';
		html += '</div>';
		html += '</div>';

		html += '<div class="forecast">';
		html += '<div class="forecast-header">';
		html += '<div class="day">' + 'Now' + '</div>';
		html += '</div>';
		html += '<div class="forecast-content">';
		html += '<div class="forecast-icon">';
		html += '<div><img src="http://openweathermap.org/img/wn/' + data.current?.weather[0]?.icon + '@2x.png" alt="" width=48>';
		html += '<div><small>' + data.current?.weather[0]?.main +'</small></div></div>';
		html += '</div>';
		html += '<div class="degree">'+ Math.round(data.current?.temp) +'<sup>o</sup>C</div>';
		html += '</div>';
		html += '</div>';
		// Next hours
		data.hourly?.forEach(function(hour,index){
			if (index > 0 && index < 10 ){
				html += '<div class="forecast">';
				html += '<div class="forecast-header">';
				html += '<div class="day">' + getHour(hour.dt) + ':00</div>';
				html += '</div>';
				html += '<div class="forecast-content">';
				html += '<div class="forecast-icon">';
				html += '<div><img src="http://openweathermap.org/img/wn/' + hour.weather[0].icon + '@2x.png" alt="" width=48>';
				html += '<div><small>' + hour.weather[0].main +'</small></div></div>';
				html += '</div>';
				html += '<div class="degree">'+ Math.round(hour.temp) +'<sup>o</sup>C</div>';
				// html += '<small>' + Math.round(day.temp.min) + '<sup>o</sup>C - ' + Math.round(day.temp.max) +'<sup>o</sup>C</small>';
				html += '</div>';
				html += '</div>';
			}
		})
		document.getElementById("weatherDay").insertAdjacentHTML('afterbegin',html);

		//WeatherWeek
		document.getElementById("weatherWeek").innerHTML = "";
		// document.getElementById("weatherWeek").style = "width:200px";
		// Today
		var html = '<div class="forecast" style="width:200px">';
		html += '<div class="forecast-content">';
		html += '<h1>Daily</h1>';
		html += '</div>';
		html += '</div>';
		html += '<div class="today forecast">';
		html +=	'<div class="forecast-header">';
		html += '<div class="day" style="margin-left:20px;">' + 'Today' + '</div>';
		html += '<div class="date" style="margin-right:20px;">' + getDay(data.current?.dt) + ' ' + getDate(data.current?.dt) + '</div>';
		html += '<div class="forecast-content">';
		html += '<div class="location">' + city + '</div>';
		html += '<div class="degree">';
		html += '<div class="num">' + Math.round(data.current?.temp) + '<sup>o</sup>C</div>';
		html += '<div class="forecast-icon">';
		html += '<div><img src="http://openweathermap.org/img/wn/' + data.current?.weather[0].icon + '@2x.png" alt="" width=80>';
		html += '<div>' + data.current?.weather[0].main + '</div></div>';
		html += '</div>';
		html += '</div>';
		html += '<span><img src="/images/icon-humidity.png" alt="">' + data.current?.humidity + ' %</span>';
		html += '<span><img src="/images/icon-wind.png" alt="">' + (Math.round(data.current?.wind_speed * 3.6 * 10) / 10) + ' km/h</span>';
		html += '<span><img src="/images/icon-visibility.png" alt="">' + Math.round(data.current?.visibility/1000) + ' km</span>';
		html += '</div>';
		html += '</div>';
		html += '</div>';
		html += '</div>';
		html += '</div>';
		// All week
		data.daily?.forEach(function(day,index){
			if (index > 0 && index < 7 ){
				html += '<div class="forecast">';
				html += '<div class="forecast-header">';
				html += '<div class="day">' + getDay(day.dt) + '</div>';
				html += '</div>';
				html += '<div class="forecast-content">';
				html += '<div class="forecast-icon">';
				html += '<div><img src="http://openweathermap.org/img/wn/' + day.weather[0].icon + '@2x.png" alt="" width=48>';
				html += '<div><small>' + day.weather[0].main +'</small></div></div>';
				html += '</div>';
				html += '<div class="degree">'+ Math.round(day.temp.day) +'<sup>o</sup>C</div>';
				html += '<small>' + Math.round(day.temp.min) + '<sup>o</sup>C - ' + Math.round(day.temp.max) +'<sup>o</sup>C</small>';
				html += '</div>';
				html += '</div>';
			}
		})
		document.getElementById("weatherWeek").insertAdjacentHTML('afterbegin',html);
    });
}

function getDay(dt) {
	const unixTime = dt;
	const date = new Date(unixTime*1000);
    const dayInt = date.getDay();
	var days = ['Sunday', 'Monday', 'Tuesday','Wednesday','Thursday','Friday','Saturday'];
	var dayString = days[dayInt];
	return dayString;
}

function getDate(dt) {
	var a = new Date(dt * 1000);
	var months = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
	var year = a.getFullYear();
	var month = months[a.getMonth()];
	var date = a.getDate();
	var hour = a.getHours();
	var min = a.getMinutes();
	var sec = a.getSeconds();
	var time = date + ' ' + month;
	return time;
}

function getHour(dt) {
	var a = new Date(dt * 1000);
	var months = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
	var year = a.getFullYear();
	var month = months[a.getMonth()];
	var date = a.getDate();
	var hour = a.getHours();
	var min = a.getMinutes();
	var sec = a.getSeconds();
	var time = hour;
	return time;
}

export default Post