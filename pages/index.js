import Head from 'next/head'
import Image from 'next/image'
import styles from '../styles/Home.module.css'
import cities from 'cities.json';
import React, { useState } from 'react';
import App from '../styles/App.module.css'

export default function Home() {
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
      const size = 10;
      const items = results.slice(0, size)
      setFoundCities(items);
    } else {
      setFoundCities();
      // If the text field is empty, show all cities
    }

    setName(keyword);
  };

  return (
    <div class="forecast-container-home">
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
  );
}
