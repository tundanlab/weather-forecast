import React from 'react'
import Image from 'next/image'
export default function WeeklyWeather({data, city}) {
  return (
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
  )
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