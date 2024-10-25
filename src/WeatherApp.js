import "./WeatherApp.css";
import React, { useState, useEffect } from "react";

function WeatherApp() {
  const [city, setCity] = useState("");
  const [weatherData, setWeatherData] = useState(null);
  const [error, setError] = useState(null);
  const [lat, setLat] = useState(null);
  const [lon, setLon] = useState(null);

  const apiKey = "e21d2422a4cc47d1da222b30fb6012d2";

  // Function to fetch weather data based on coordinates
  const fetchWeatherByCoords = async (latitude, longitude) => {
    const url = `https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&appid=${apiKey}&units=imperial`;

    try {
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error("Unable to fetch weather data");
      }
      const data = await response.json();
      setWeatherData(data);
    } catch (err) {
      setError(err.message);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    if (city) {
      const url = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=imperial`;
      try {
        const response = await fetch(url);
        if (!response.ok) {
          throw new Error("City not found");
        }
        const data = await response.json();
        setWeatherData(data);
      } catch (err) {
        setError(err.message);
      }
    }
  };

  // Function to get the user's location
  const getUserLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setLat(position.coords.latitude);
          setLon(position.coords.longitude);
        },
        (error) => {
          setError("Unable to retrieve your location");
        }
      );
    } else {
      setError("Geolocation is not supported by this browser.");
    }
  };

  useEffect(() => {
    // Fetch weather data based on coordinates when lat and lon are available
    if (lat && lon) {
      fetchWeatherByCoords(lat, lon);
    }
  }, [lat, lon]);

  // Call getUserLocation when the component mounts
  useEffect(() => {
    getUserLocation();
  }, []);

  return (
    <div className="app-container">
      <div className="weather-card">
        <form className="weather-form" onSubmit={handleSubmit}>
          <input
            type="text"
            value={city}
            onChange={(e) => setCity(e.target.value)}
            placeholder="Enter city"
            className="city-input"
            required
          />
          <button type="submit" className="submit-btn">
            Get Weather
          </button>
        </form>

        {error && <p className="error-message">{error}</p>}

        {weatherData && (
          <div className="weather-info">
            <h2>{weatherData.name}</h2>
            <p className="temperature">{weatherData.main.temp}°F</p>
            <p className="weather-desc">{weatherData.weather[0].description}</p>
            <div className="additional-info">
              <p>Wind: {weatherData.wind.speed} mph</p>
              <p>Humidity: {weatherData.main.humidity}%</p>
            </div>
          </div>
        )}
      </div>

      <div className="particle-background">
        {[...Array(100)].map((_, i) => (
          <div key={i} className="particle"></div>
        ))}
      </div>
    </div>
  );
}

export default WeatherApp;
