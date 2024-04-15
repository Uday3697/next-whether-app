"use client";

import React, { useEffect, useState } from "react";
import axios from "axios";

const WeatherPage = ({params}:{params: {cityname:string}}) => {
  const  cityname  = params.cityname;
  const [weatherData, setWeatherData] = useState<any>(null);



  useEffect(() => {
    if (cityname) {

      fetchWeatherData(cityname);
    }
  }, [cityname]);

  const fetchWeatherData = async (cityname: any) => {
    try {
      const response = await axios.get(
        `https://api.openweathermap.org/data/2.5/weather?q=${cityname}&appid=90dea3cdf48b3f922326e6707b785af7&units=metric`
      );
      // console.log("--------------------------------------responce", response.data);

      setWeatherData(response.data);
    } catch (error) {
      console.error("Error fetching weather data:", error);
    }
  };

  if (!weatherData) {
    return <div>Loading...</div>;
  }
  return (
    <div className="relative bg-gradient-to-r from-blue-500 to-purple-600 min-h-screen flex items-center justify-center cursor-pointer">
      <div className="max-w-md mx-auto bg-white rounded-lg shadow-lg overflow-hidden">
        <div className="bg-[url('/bgImg.jpg')] bg-cover bg-center h-40"></div>
        <div className="p-4 text-center">
          <h1 className="text-3xl font-bold mb-2 hover:shadow-lg hover:scale-102 transition-all duration-300">Weather in {cityname}</h1>
          <p className="text-lg mb-2 shadow-md">Temperature: {weatherData.main.temp}°C</p>
          <p className="text-lg mb-2 shadow-md">Description: {weatherData.weather[0].description}</p>
          <p className="text-lg mb-2 shadow-md">Humidity: {weatherData.main.humidity}%</p>
          <p className="text-lg mb-2 shadow-md">Wind Speed: {weatherData.wind.speed} m/s</p>
          <p className="text-lg mb-2 shadow-md">Pressure: {weatherData.main.pressure} hPa</p>
        </div>
      </div>
    </div>
  );
};


export default WeatherPage;
