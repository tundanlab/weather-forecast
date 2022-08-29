import Head from 'next/head'
import Image from 'next/image'
import styles from '../styles/Home.module.css'
import cities from 'cities.json';
import React, { useState } from 'react';
import App from '../styles/App.module.css'
import SearchBox from '../components/SearchBox/SearchBox';

export default function Home() {
  return (
    <div class="forecast-container-home">
      <SearchBox showNumber={10}/>
    </div>
  );
}
