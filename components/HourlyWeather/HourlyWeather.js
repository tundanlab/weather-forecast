import React from 'react'
import Image from 'next/image'
export default function HourlyWeather({data}) {
  return (
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
  )
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