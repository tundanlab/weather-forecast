import { useRouter } from 'next/router'
import cities from 'cities.json';
import React, { useState } from 'react';
import App from '../../styles/App.module.css'
import Image from 'next/image'
import WeeklyWeather from '../../components/WeeklyWeather/WeeklyWeather';
import HourlyWeather from '../../components/HourlyWeather/HourlyWeather';
import SearchBox from '../../components/SearchBox/SearchBox';

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
    return (<div>
		<div id="weatherTop" class="forecast-container">
			<h1 class="home-city"><a href="/">Home</a></h1>
		</div>
		<div class="forecast-container-city">
			<SearchBox showNumber={3}/>
		</div>
		<HourlyWeather data={data}/>

        <WeeklyWeather data={data} city={city}/>
        <script src="/js/jquery-1.11.1.min.js"></script>
		<script src="/js/plugins.js"></script>
		<script src="/js/app.js"></script>
		<link href="http://fonts.googleapis.com/css?family=Roboto:300,400,700|" rel="stylesheet" type="text/css"/>
		<link href="/fonts/font-awesome.min.css" rel="stylesheet" type="text/css"/>
		<link rel="stylesheet" href="/style.css"></link>
    </div>)
}

export default Post