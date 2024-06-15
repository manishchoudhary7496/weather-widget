
import React, { useState, useEffect } from 'react';

const WeatherWidget = () => {
    const [city, setCity] = useState('');
    const [weatherData, setWeatherData] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [favorites, setFavorites] = useState([]);
    const [refreshInterval, setRefreshInterval] = useState(null);

    const API_KEY = 'Y701f070e2a95a69655733aeda972cc57'; //I created a free account on openweather to get the API keys
    useEffect(() => {
        if (refreshInterval) {
            const interval = setInterval(fetchWeatherData, 300000); // Refresh every 5 minutes
            return () => clearInterval(interval);
        }
    }, [refreshInterval]);

    const fetchWeatherData = async (cityName = city) => {
        setLoading(true);
        setError(null);
        try {
            const response = await fetch(`https://api.openweathermap.org/data/2.5/weather?q=${cityName}&appid=${API_KEY}&units=metric`);
            if (!response.ok) {
                throw new Error('City not found');
            }
            const data = await response.json();
            setWeatherData(data);
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = (event) => {
        event.preventDefault();
        if (city) {
            fetchWeatherData();
        }
    };

    const handleAddFavorite = () => {
        if (city && !favorites.includes(city)) {
            setFavorites([...favorites, city]);
        }
    };

    const handleSelectFavorite = (favorite) => {
        setCity(favorite);
        fetchWeatherData(favorite);
    };

    const handleRefresh = () => {
        fetchWeatherData();
    };

    const toggleAutoRefresh = () => {
        setRefreshInterval(prev => !prev);
    };

    return (
        <div className="weather-widget">
            <form onSubmit={handleSubmit}>
                <input
                    type="text"
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    placeholder="Enter city name"
                />
                <button type="submit">Get Weather</button>
                <button type="button" onClick={handleAddFavorite}>Add to Favorites</button>
                <button type="button" onClick={handleRefresh}>Refresh</button>
                <button type="button" onClick={toggleAutoRefresh}>
                    {refreshInterval ? 'Stop Auto-Refresh' : 'Start Auto-Refresh'}
                </button>
            </form>
            {loading && <p>Loading...</p>}
            {error && <p>Error: {error}</p>}
            {weatherData && (
                <div>
                    <h2>{weatherData.name}</h2>
                    <p>Temperature: {weatherData.main.temp}°C</p>
                    <p>Humidity: {weatherData.main.humidity}%</p>
                    <p>Description: {weatherData.weather[0].description}</p>
                </div>
            )}
            <div className="favorites">
                <h3>Favorites</h3>
                {favorites.map((favorite, index) => (
                    <button key={index} onClick={() => handleSelectFavorite(favorite)}>
                        {favorite}
                    </button>
                ))}
            </div>
        </div>
    );
};

export default WeatherWidget;
