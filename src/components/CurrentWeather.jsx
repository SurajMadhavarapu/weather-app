// Note: AI was used for knowledge purposes only and treated as per knowledge.
import { useState, useEffect } from 'react';
import { getWeatherInfo, WeatherIcon } from '../utils/weatherCodes';
import { tempDisplay, formatTime } from '../utils/helpers';

/**
 * Computes the current local time string for the searched location
 * using the UTC offset returned by Open-Meteo.
 */
function useLocationTime(utcOffsetSeconds) {
  const [timeStr, setTimeStr] = useState('');

  useEffect(() => {
    if (utcOffsetSeconds == null) return;

    function update() {
      const nowUTC = Date.now();
      const localMs = nowUTC + utcOffsetSeconds * 1000;
      const localDate = new Date(localMs);

      // Format using UTC methods so we get the location's wall-clock time
      const weekday = localDate.toLocaleDateString('en-US', { weekday: 'long', timeZone: 'UTC' });
      const month = localDate.toLocaleDateString('en-US', { month: 'long', timeZone: 'UTC' });
      const day = localDate.getUTCDate();
      let hours = localDate.getUTCHours();
      const minutes = String(localDate.getUTCMinutes()).padStart(2, '0');
      const ampm = hours >= 12 ? 'PM' : 'AM';
      hours = hours % 12 || 12;

      setTimeStr(`${weekday}, ${month} ${day} · ${hours}:${minutes} ${ampm}`);
    }

    update();
    const interval = setInterval(update, 30000); // update every 30s
    return () => clearInterval(interval);
  }, [utcOffsetSeconds]);

  return timeStr;
}

export default function CurrentWeather({ data, location, unit, onToggleUnit }) {
  if (!data || !data.current) return null;

  const current = data.current;
  const daily = data.daily;
  const weatherInfo = getWeatherInfo(current.weather_code);
  const isDay = current.is_day === 1;

  // Today's high/low from daily data
  const todayHigh = daily?.temperature_2m_max?.[0];
  const todayLow = daily?.temperature_2m_min?.[0];
  const sunrise = daily?.sunrise?.[0];
  const sunset = daily?.sunset?.[0];

  // Live local time of the searched location
  const localTime = useLocationTime(data.utc_offset_seconds);

  return (
    <section className="current-weather" id="current-weather">
      <div className="current-weather__main">
        <div className="current-weather__icon-wrap">
          <WeatherIcon code={current.weather_code} isDay={isDay} size={100} />
        </div>
        <div className="current-weather__info">
          <h1 className="current-weather__location">{location?.name || 'Unknown Location'}</h1>
          {location?.admin1 && (
            <p className="current-weather__sub-location">
              {[location.admin1, location.country].filter(Boolean).join(', ')}
            </p>
          )}
          <p className="current-weather__datetime">
            {localTime}
            {data.timezone && (
              <span className="current-weather__timezone"> ({data.timezone_abbreviation || data.timezone})</span>
            )}
          </p>
        </div>
      </div>

      <div className="current-weather__temp-section">
        <div className="current-weather__temp-main">
          <span className="current-weather__temp">
            {tempDisplay(current.temperature_2m, unit)}
          </span>
          <div className="current-weather__unit-switcher" id="unit-toggle-btn">
            <button
              className={`current-weather__unit-btn ${unit === 'C' ? 'current-weather__unit-btn--active' : ''}`}
              onClick={() => unit !== 'C' && onToggleUnit()}
              aria-label="Switch to Celsius"
            >
              °C
            </button>
            <span className="current-weather__unit-divider">|</span>
            <button
              className={`current-weather__unit-btn ${unit === 'F' ? 'current-weather__unit-btn--active' : ''}`}
              onClick={() => unit !== 'F' && onToggleUnit()}
              aria-label="Switch to Fahrenheit"
            >
              °F
            </button>
          </div>
        </div>
        <p className="current-weather__description">{weatherInfo.description}</p>
        <div className="current-weather__meta">
          <span className="current-weather__feels-like">
            Feels like {tempDisplay(current.apparent_temperature, unit)}
          </span>
          {todayHigh != null && todayLow != null && (
            <span className="current-weather__high-low">
              H: {tempDisplay(todayHigh, unit)} &nbsp; L: {tempDisplay(todayLow, unit)}
            </span>
          )}
        </div>
      </div>

      {sunrise && sunset && (
        <div className="current-weather__sun">
          <div className="current-weather__sun-item">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="18" height="18">
              <path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83" />
              <circle cx="12" cy="12" r="5" />
            </svg>
            <span>{formatTime(sunrise)}</span>
          </div>
          <div className="current-weather__sun-item">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="18" height="18">
              <path d="M12 10V2M4.93 10.93l2.83-2.83M2 18h4M18 18h4M19.07 10.93l-2.83-2.83" />
              <path d="M17 18a5 5 0 1 0-10 0" />
              <line x1="2" y1="22" x2="22" y2="22" />
            </svg>
            <span>{formatTime(sunset)}</span>
          </div>
        </div>
      )}
    </section>
  );
}
