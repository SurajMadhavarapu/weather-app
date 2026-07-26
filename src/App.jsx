// Note: AI was used for knowledge purposes only and treated as per knowledge.
import { useState, useCallback } from 'react';
import SearchBar from './components/SearchBar';
import CurrentWeather from './components/CurrentWeather';
import HourlyForecast from './components/HourlyForecast';
import FiveDayForecast from './components/FiveDayForecast';
import WeatherDetails from './components/WeatherDetails';
import TravelInsightsCard from './components/TravelInsightsCard';
import AirQualityCard from './components/AirQualityCard';
import HazardBanner from './components/HazardBanner';
import CompareModal from './components/CompareModal';
import AIChatAssistant from './components/AIChatAssistant';
import InteractiveMap from './components/InteractiveMap';
import ErrorMessage from './components/ErrorMessage';
import LoadingSpinner from './components/LoadingSpinner';
import Footer from './components/Footer';
import { fetchWeather, fetchAirQuality, getCurrentPosition, reverseGeocode } from './services/weatherApi';
import { getWeatherGradient } from './utils/weatherCodes';

function App() {
  const [weatherData, setWeatherData] = useState(null);
  const [airQualityData, setAirQualityData] = useState(null);
  const [location, setLocation] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [unit, setUnit] = useState('C'); // 'C' or 'F'
  const [lastCoords, setLastCoords] = useState(null);

  // Home location state for travel comparison
  const [homeLocation, setHomeLocation] = useState(null);
  const [homeData, setHomeData] = useState(null);
  const [showCompareModal, setShowCompareModal] = useState(false);

  const loadWeather = useCallback(async (lat, lon, locationInfo, isHome = false) => {
    setLoading(true);
    setError('');
    try {
      const [weather, aq] = await Promise.all([
        fetchWeather(lat, lon),
        fetchAirQuality(lat, lon),
      ]);

      setWeatherData(weather);
      setAirQualityData(aq);
      setLocation(locationInfo);
      setLastCoords({ lat, lon, locationInfo });

      if (isHome || !homeData) {
        setHomeData(weather);
        setHomeLocation(locationInfo);
      }
    } catch (err) {
      console.error('Failed to fetch weather:', err);
      setError(
        err.message.includes('fetch')
          ? 'Network error. Please check your internet connection and try again.'
          : `Failed to load weather data: ${err.message}`
      );
      setWeatherData(null);
      setAirQualityData(null);
    } finally {
      setLoading(false);
    }
  }, [homeData]);

  const handleLocationSelect = useCallback((loc) => {
    loadWeather(loc.latitude, loc.longitude, {
      name: loc.name,
      admin1: loc.admin1,
      country: loc.country,
      displayName: loc.displayName,
      latitude: loc.latitude,
      longitude: loc.longitude,
    }, false);
  }, [loadWeather]);

  const handleUseMyLocation = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const coords = await getCurrentPosition();
      const locationInfo = await reverseGeocode(coords.latitude, coords.longitude);
      locationInfo.latitude = coords.latitude;
      locationInfo.longitude = coords.longitude;
      await loadWeather(coords.latitude, coords.longitude, locationInfo, true);
    } catch (err) {
      console.error('Geolocation error:', err);
      setError(err.message);
      setLoading(false);
    }
  }, [loadWeather]);

  const handleRetry = useCallback(() => {
    if (lastCoords) {
      loadWeather(lastCoords.lat, lastCoords.lon, lastCoords.locationInfo);
    } else {
      setError('');
    }
  }, [lastCoords, loadWeather]);

  const toggleUnit = useCallback(() => {
    setUnit((prev) => (prev === 'C' ? 'F' : 'C'));
  }, []);

  // Dynamic background
  const bgGradient = weatherData?.current
    ? getWeatherGradient(weatherData.current.weather_code, weatherData.current.is_day === 1)
    : 'linear-gradient(135deg, #0f0c29 0%, #302b63 50%, #24243e 100%)';

  const canCompare = homeData && weatherData && homeLocation?.name !== location?.name;

  return (
    <div className="app" style={{ background: bgGradient }} id="app-root">
      <div className="app__container">
        <header className="app__header">
          <h1 className="app__logo" id="app-logo">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="28" height="28">
              <path d="M17.5 19H9a7 7 0 1 1 6.71-9h1.79a4.5 4.5 0 1 1 0 9z" />
            </svg>
            SkyCast AI
          </h1>

          {canCompare && (
            <button
              className="app__compare-btn"
              onClick={() => setShowCompareModal(true)}
              id="compare-trigger-btn"
            >
              <span>✈️ Compare with {homeLocation.name}</span>
            </button>
          )}
        </header>

        <SearchBar
          onLocationSelect={handleLocationSelect}
          onUseMyLocation={handleUseMyLocation}
          isLoading={loading}
        />

        {loading && <LoadingSpinner message="Gathering meteorological & air quality data..." />}

        {error && !loading && (
          <ErrorMessage message={error} onRetry={handleRetry} />
        )}

        {weatherData && !loading && !error && (
          <main className="app__main">
            <HazardBanner data={weatherData} />

            <CurrentWeather
              data={weatherData}
              location={location}
              unit={unit}
              onToggleUnit={toggleUnit}
            />

            <TravelInsightsCard data={weatherData} unit={unit} />

            <HourlyForecast data={weatherData} unit={unit} />

            <FiveDayForecast data={weatherData} unit={unit} />

            <AirQualityCard airQuality={airQualityData} />

            <WeatherDetails data={weatherData} unit={unit} />

            <InteractiveMap weatherData={weatherData} location={location} />
          </main>
        )}

        {!weatherData && !loading && !error && (
          <div className="app__welcome" id="welcome-message">
            <div className="app__welcome-icon">
              <svg viewBox="0 0 64 64" width="96" height="96" fill="none" stroke="rgba(255,255,255,0.4)" strokeWidth="1.5">
                <circle cx="26" cy="20" r="10" fill="rgba(255,215,0,0.2)" stroke="rgba(255,215,0,0.4)" />
                {[0, 45, 90, 135, 180, 225, 270, 315].map((angle, i) => {
                  const rad = (angle * Math.PI) / 180;
                  return (
                    <line
                      key={i}
                      x1={26 + 14 * Math.cos(rad)}
                      y1={20 + 14 * Math.sin(rad)}
                      x2={26 + 18 * Math.cos(rad)}
                      y2={20 + 18 * Math.sin(rad)}
                      stroke="rgba(255,215,0,0.3)"
                      strokeWidth="2"
                      strokeLinecap="round"
                    />
                  );
                })}
                <path d="M22 48a8 8 0 0 1 0-16h2a10 10 0 0 1 19.8 2A6 6 0 0 1 44 48H22z" fill="rgba(255,255,255,0.1)" />
              </svg>
            </div>
            <h2 className="app__welcome-title">SkyCast Smart Weather Platform</h2>
            <p className="app__welcome-text">
              Search for any city, landmark, or zip code to unlock real-time forecasts, AI travel outfit intelligence, air quality metrics, and severe weather alerts.
            </p>
          </div>
        )}

        {showCompareModal && (
          <CompareModal
            homeData={homeData}
            homeLocation={homeLocation}
            targetData={weatherData}
            targetLocation={location}
            unit={unit}
            onClose={() => setShowCompareModal(false)}
          />
        )}

        <Footer />
      </div>

      {/* AI Chat Floating Assistant */}
      <AIChatAssistant
        weatherData={weatherData}
        location={location}
        airQuality={airQualityData}
      />
    </div>
  );
}

export default App;
