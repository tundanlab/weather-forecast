import { useRouter } from 'next/router'
import cities from 'cities.json';
import React, { useState } from 'react';
import App from '../../styles/App.module.css'
import Image from 'next/image'

export async function getServerSideProps(context) {
	const city = context.params.city;

	const results = cities.filter((cityFilter) => {
		return cityFilter.name.startsWith(city);
		// Use the toLowerCase() method to make it case-insensitive
	});
	const size = 1;
	const items = results.slice(0, size)

    if(items.length == 0){
        return {
            notFound: true,
        };
    };
	// 7b26c92417fd3678d52eac12dc870222
    const url = `https://api.openweathermap.org/data/2.5/onecall?lat=${items[0].lat}&lon=${items[0].lng}&units=metric&appid=${process.env.API_KEY}`;
    // const url = 'http://localhost:3000/testweather.json';
	const res = await fetch(url);
    const data = await res.json();

    if(!data){
        return {
            notFound: true,
        };
    };
    const slug = context.params.city;

    return{
        props: {
            data,
			city: city,
        },
    }
}

const Post = ({
	data,
	city
}) => {
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
	
    return (<div>
		<div id="weatherTop" class="forecast-container">
			<h1 class="home-city"><a href="/">Home</a></h1>
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
			<div class="forecast" style={{width: 200 + 'px'}}>
				<div class="forecast-content">
					<h1>Hourly</h1>
				</div>
			</div>

			<div class="forecast">
				<div class="forecast-header">
					<div class="day">Now</div>
				</div>
				<div class="forecast-content">
					<div class="forecast-icon">
						<div>
							<Image src= { "http://openweathermap.org/img/wn/" + data.current?.weather[0]?.icon + "@2x.png"} alt="" width="48" height="48"/>
						</div>
					</div>
					<small>
						{data.current?.weather[0]?.main}
					</small>
					<div class="degree">{ Math.round(data.current?.temp) }<sup>o</sup>C</div>
				</div>
			</div>
			{data.hourly.length > 0 && 
            data.hourly.slice(1, 10).map((hour, index) => (
				<div class="forecast">
				<div class="forecast-header">
				<div class="day"> {getHour(hour.dt) + ":00"}</div>
				</div>
				<div class="forecast-content">
				<div class="forecast-icon">
				<div><Image src={"http://openweathermap.org/img/wn/" + hour.weather[0].icon + "@2x.png"} alt="" width="48" height="48"/>
				<div><small>{ hour.weather[0].main }</small></div></div>
				</div>
				<div class="degree">{ Math.round(hour.temp) }<sup>o</sup>C</div>
				</div>
				</div>
          	))}
		</div>

        <div id="weatherWeek" class="forecast-container">
			<div class="forecast" style={{width: 200 + 'px'}}>
				<div class="forecast-content">
					<h1>Daily</h1>
				</div>
				</div>
			<div class="today forecast">
				<div class="forecast-header">
					<div class="day" style={{marginLeft:'20px'}}>Today</div>
					<div class="date" style={{marginRight:'20px'}}>{ getDay(data.current?.dt) + ' ' + getDate(data.current?.dt) }</div>
				<div class="forecast-content">
					<div>
						<div class="location">{ city }</div>
						<div>
							<div class="degree">
								<div class="num">{ Math.round(data.current?.temp) }<sup>o</sup>C</div>
								<div class="forecast-icon">
									<div><Image src= { "http://openweathermap.org/img/wn/" + data.current?.weather[0]?.icon + "@2x.png"} alt="" width="48" height="48"/>
									<div> {data.current?.weather[0].main }</div>
									</div>
								</div>
							</div>
						</div>
					</div>
						<span><Image src="/images/icon-humidity.png" alt="" width="12" height="12"/> { data.current?.humidity + " %"}</span>
						<span><Image src="/images/icon-wind.png" alt="" width="12" height="12"/>{ (Math.round(data.current?.wind_speed * 3.6 * 10) / 10)} km/h</span>
						<span><Image src="/images/icon-visibility.png" alt="" width="12" height="12"/> {Math.round(data.current?.visibility/1000) } km</span>
				</div>

				</div>
			</div>

			{data.daily.length > 0 && 
            data.daily.slice(1, 6).map((day, index) => (
				<div class="forecast">
				<div class="forecast-header">
				<div class="day"> {getDay(day.dt)}</div>
				</div>
				<div class="forecast-content">
				<div class="forecast-icon">
				<div><Image src={"http://openweathermap.org/img/wn/" + day.weather[0].icon + "@2x.png"} alt="" width="48" height="48"/>
				<div><small>{ day.weather[0].main }</small></div></div>
				</div>
				<div class="degree">{ Math.round(day.temp.day) }<sup>o</sup>C</div>
				<small> {Math.round(day.temp.min)}  <sup>o</sup>C - {Math.round(day.temp.max)} <sup>o</sup>C</small>
				</div>
				</div>
          	))}
		</div>
        <script src="/js/jquery-1.11.1.min.js"></script>
		<script src="/js/plugins.js"></script>
		<script src="/js/app.js"></script>
		<link href="http://fonts.googleapis.com/css?family=Roboto:300,400,700|" rel="stylesheet" type="text/css"/>
		<link href="/fonts/font-awesome.min.css" rel="stylesheet" type="text/css"/>
		<link rel="stylesheet" href="/style.css"></link>
    </div>)
//   } else {
//     return (<p style={{textalign: "center"}}>No results found! <a href="/" style={{color: '#1E90FF'}}>Back to Home page</a></p>)
//   }
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