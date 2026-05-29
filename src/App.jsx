import React, { useState, useEffect, useCallback, useRef } from 'react';
import { HashRouter, Route, Routes } from 'react-router-dom';
import axios from 'axios';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { FiSearch } from 'react-icons/fi';
import { WiDaySunny, WiNightClear, WiCloudy, WiRain, WiSnow } from 'react-icons/wi';
import { format } from 'date-fns';
import { clsx } from 'clsx';

const BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:8000";

const App = () => {
  const [city, setCity] = useState('London');
  const [units, setUnits] = useState('metric');
  const [weather, setWeather] = useState(null);
  const [forecast, setForecast] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchWeather = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await axios.get(`${BASE_URL}/api/v1/weather/current?city=${city}&units=${units}`);
      setWeather(response.data);
    } catch (error) {
      setError(error);
    } finally {
      setLoading(false);
    }
  }, [city, units]);

  const fetchForecast = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await axios.get(`${BASE_URL}/api/v1/weather/forecast?city=${city}&units=${units}`);
      setForecast(response.data);
    } catch (error) {
      setError(error);
    } finally {
      setLoading(false);
    }
  }, [city, units]);

  useEffect(() => {
    fetchWeather();
    fetchForecast();
  }, [fetchWeather, fetchForecast]);

  const handleSearch = (e) => {
    e.preventDefault();
    setCity(searchTerm);
    setSearchTerm('');
  };

  const handleUnitsToggle = () => {
    setUnits(units === 'metric' ? 'imperial' : 'metric');
  };

  const getWeatherIcon = (condition) => {
    switch (condition) {
      case 'sunny':
        return <WiDaySunny />;
      case 'cloudy':
        return <WiCloudy />;
      case 'rainy':
        return <WiRain />;
      case 'snowy':
        return <WiSnow />;
      default:
        return <WiNightClear />;
    }
  };

  const getDay = (date) => {
    return format(new Date(date), 'EEE');
  };

  return (
    <div className="app-wrapper">
      <Routes>
        <Route
          path="/"
          element={
            <div className="max-w-5xl mx-auto p-4">
              <header className="flex justify-between items-center mb-4">
                <h1 className="text-3xl font-bold">Weather App</h1>
                <form onSubmit={handleSearch} className="flex items-center">
                  <input
                    type="text"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    placeholder="Search city"
                    className="px-4 py-2 border border-gray-300 rounded-lg"
                  />
                  <button
                    type="submit"
                    className="ml-2 px-4 py-2 bg-blue-500 text-white rounded-lg"
                  >
                    <FiSearch />
                  </button>
                  <button
                    type="button"
                    onClick={handleUnitsToggle}
                    className="ml-2 px-4 py-2 bg-blue-500 text-white rounded-lg"
                  >
                    {units === 'metric' ? '°C' : '°F'}
                  </button>
                </form>
              </header>
              {loading ? (
                <p>Loading...</p>
              ) : error ? (
                <p>Error: {error.message}</p>
              ) : (
                <div>
                  {weather && (
                    <div
                      className={clsx(
                        'bg-gradient-to-r from-blue-500 to-blue-300',
                        'p-4 rounded-lg mb-4'
                      )}
                    >
                      <h2 className="text-2xl font-bold">{weather.city}</h2>
                      <div className="flex items-center mb-2">
                        {getWeatherIcon(weather.condition)}
                        <span className="text-4xl font-bold ml-2">
                          {weather.temperature}
                          {units === 'metric' ? '°C' : '°F'}
                        </span>
                      </div>
                      <p>
                        Feels like: {weather.feels_like}
                        {units === 'metric' ? '°C' : '°F'}
                      </p>
                    </div>
                  )}
                  {forecast && (
                    <div className="flex flex-wrap justify-center mb-4">
                      {forecast.map((day, index) => (
                        <div
                          key={index}
                          className="bg-gray-200 p-4 rounded-lg m-2"
                        >
                          <h3 className="text-lg font-bold">{getDay(day.date)}</h3>
                          <p>
                            High: {day.high}
                            {units === 'metric' ? '°C' : '°F'}
                          </p>
                          <p>
                            Low: {day.low}
                            {units === 'metric' ? '°C' : '°F'}
                          </p>
                        </div>
                      ))}
                    </div>
                  )}
                  {weather && (
                    <div className="flex flex-wrap justify-center mb-4">
                      <div className="bg-gray-200 p-4 rounded-lg m-2">
                        <h3 className="text-lg font-bold">Humidity</h3>
                        <p>{weather.humidity}%</p>
                      </div>
                      <div className="bg-gray-200 p-4 rounded-lg m-2">
                        <h3 className="text-lg font-bold">Wind Speed</h3>
                        <p>{weather.wind_speed} km/h</p>
                      </div>
                      <div className="bg-gray-200 p-4 rounded-lg m-2">
                        <h3 className="text-lg font-bold">Visibility</h3>
                        <p>{weather.visibility} km</p>
                      </div>
                    </div>
                  )}
                  {weather && (
                    <div className="flex flex-wrap justify-center mb-4">
                      <div className="bg-gray-200 p-4 rounded-lg m-2">
                        <h3 className="text-lg font-bold">Sunrise</h3>
                        <p>{format(new Date(weather.sunrise), 'HH:mm')}</p>
                      </div>
                      <div className="bg-gray-200 p-4 rounded-lg m-2">
                        <h3 className="text-lg font-bold">Sunset</h3>
                        <p>{format(new Date(weather.sunset), 'HH:mm')}</p>
                      </div>
                      <div className="bg-gray-200 p-4 rounded-lg m-2">
                        <h3 className="text-lg font-bold">UV Index</h3>
                        <p>{weather.uv_index}</p>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          }
        />
      </Routes>
      <ToastContainer />
    </div>
  );
};

export default App;