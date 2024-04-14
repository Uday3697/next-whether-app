"use client";

import React, { useEffect, useState } from "react";
import axios from "axios";
import { useRouter, useSearchParams } from "next/navigation";

const WeatherPage = () => {
  const router = useRouter();
  const { latitude, longitude } = useSearchParams();
  const [weatherData, setWeatherData] = useState<any>(null);

  useEffect(() => {
    if (typeof latitude === "string" && typeof longitude === "string") {
      const lat = parseFloat(latitude);
      const lon = parseFloat(longitude);
      fetchWeatherData(lat, lon);
    }
  }, [latitude, longitude]);

  const fetchWeatherData = async (lat: number, lon: number) => {
    try {
      const response = await axios.get(
        `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=90dea3cdf48b3f922326e6707b785af7&units=metric`
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
      <h1>
        Weather at Latitude {latitude} and Longitude {longitude}
      </h1>
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
