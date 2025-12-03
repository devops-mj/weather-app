import { useState } from 'react'
import './App.css'

function App() {
  const [city, setCity] = useState('')
  const [weather, setWeather] = useState(null)
  const [forecast, setForecast] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const API_KEY = 'f585481876be36363d2dcee7ed5ec06f'  // Replace with your actual API key

  const searchWeather = async () => {
    if (!city.trim()) {
      setError('Please enter a city name')
      return
    }

    setLoading(true)
    setError('')

    try {
      // Fetch current weather
      const weatherResponse = await fetch(
        `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${API_KEY}&units=imperial`
      )
      const weatherData = await weatherResponse.json()

      if (weatherResponse.ok) {
        setWeather(weatherData)

        // Fetch 5-day forecast
        const forecastResponse = await fetch(
          `https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${API_KEY}&units=imperial`
        )
        const forecastData = await forecastResponse.json()

        // Filter to get one forecast per day (at noon)
        const dailyForecast = forecastData.list.filter((item) =>
          item.dt_txt.includes('12:00:00')
        )
        setForecast(dailyForecast)
      } else {
        setError(weatherData.message || 'City not found')
        setWeather(null)
        setForecast([])
      }
    } catch (err) {
      setError('Failed to fetch weather data')
      setWeather(null)
      setForecast([])
    }

    setLoading(false)
  }

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      searchWeather()
    }
  }

  return (
    <div className="App">
      <div className="weather-container">
        <h1>Weather Forecast</h1>
        
        {/* Search Section */}
        <div className="search-box">
          <input
            type="text"
            placeholder="Enter city name..."
            value={city}
            onChange={(e) => setCity(e.target.value)}
            onKeyPress={handleKeyPress}
          />
          <button onClick={searchWeather} disabled={loading}>
            {loading ? 'Loading...' : 'Search'}
          </button>
        </div>

        {/* Error Message */}
        {error && <p className="error">{error}</p>}

        {/* Current Weather */}
        {weather && (
          <div className="current-weather">
            <h2>{weather.name}, {weather.sys.country}</h2>
            <div className="weather-info">
              <img
                src={`https://openweathermap.org/img/wn/${weather.weather[0].icon}@2x.png`}
                alt={weather.weather[0].description}
              />
              <div>
                <p className="temperature">{Math.round(weather.main.temp)}°F</p>
                <p className="description">{weather.weather[0].description}</p>
              </div>
            </div>
            <div className="weather-details">
              <p>Feels like: {Math.round(weather.main.feels_like)}°F</p>
              <p>Humidity: {weather.main.humidity}%</p>
              <p>Wind: {Math.round(weather.wind.speed)} mph</p>
            </div>
          </div>
        )}

        {/* 5-Day Forecast */}
        {forecast.length > 0 && (
          <div className="forecast-section">
            <h3>5-Day Forecast</h3>
            <div className="forecast-grid">
              {forecast.map((day, index) => (
                <div key={index} className="forecast-card">
                  <p className="forecast-date">
                    {new Date(day.dt * 1000).toLocaleDateString('en-US', {
                      weekday: 'short',
                      month: 'short',
                      day: 'numeric'
                    })}
                  </p>
                  <img
                    src={`https://openweathermap.org/img/wn/${day.weather[0].icon}@2x.png`}
                    alt={day.weather[0].description}
                  />
                  <p className="forecast-temp">{Math.round(day.main.temp)}°F</p>
                  <p className="forecast-desc">{day.weather[0].description}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Initial Message */}
        {!weather && !loading && !error && (
          <div className="weather-display">
            <p>Search for a city to see the weather!</p>
          </div>
        )}
      </div>
    </div>
  )
}

export default App