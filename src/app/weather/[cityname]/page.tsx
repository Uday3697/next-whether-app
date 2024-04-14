"use client";
// WeatherPage.tsx
import React, { useEffect, useState } from "react";
import axios from "axios";

const WeatherPage = ({ cityName }: { cityName: string }) => {
  const [weatherData, setWeatherData] = useState<any>(null);

  useEffect(() => {
    fetchWeatherData(cityName);
  }, [cityName]);

  const fetchWeatherData = async (cityName: string) => {
    try {
      const response = await axios.get(
        `https://api.openweathermap.org/data/2.5/weather?q=${cityName}&appid=90dea3cdf48b3f922326e6707b785af7&units=metric`
      );
      setWeatherData(response.data);
    } catch (error) {
      console.error("Error fetching weather data:", error);
    }
  };

  if (!weatherData) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <h1>Weather in {cityName}</h1>
      <p>Temperature: {weatherData.main.temp}°C</p>
      <p>Description: {weatherData.weather[0].description}</p>
      <p>Humidity: {weatherData.main.humidity}%</p>
      <p>Wind Speed: {weatherData.wind.speed} m/s</p>
      <p>Pressure: {weatherData.main.pressure} hPa</p>
      {/* Add more weather information */}
    </div>
  );
};

export default WeatherPage;
