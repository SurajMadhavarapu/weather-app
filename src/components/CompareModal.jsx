// Note: AI was used for knowledge purposes only and treated as per knowledge.
import { useState } from 'react';
import { tempDisplay } from '../utils/helpers';
import { getWeatherInfo, WeatherIcon } from '../utils/weatherCodes';

export default function CompareModal({ homeData, homeLocation, targetData, targetLocation, unit, onClose }) {
  if (!homeData || !targetData) return null;

  const homeCurrent = homeData.current;
  const targetCurrent = targetData.current;

  const tempDiffC = Math.round(targetCurrent.temperature_2m - homeCurrent.temperature_2m);
  const tempDiffStr = tempDiffC === 0 ? 'Same temperature' : tempDiffC > 0 ? `+${tempDiffC}°C Warmer` : `${tempDiffC}°C Cooler`;

  const timeDiffSec = (targetData.utc_offset_seconds || 0) - (homeData.utc_offset_seconds || 0);
  const timeDiffHours = Math.round((timeDiffSec / 3600) * 10) / 10;
  const timeDiffStr = timeDiffHours === 0 ? 'Same time zone' : timeDiffHours > 0 ? `${timeDiffHours} hrs ahead` : `${Math.abs(timeDiffHours)} hrs behind`;

  const homeWeather = getWeatherInfo(homeCurrent.weather_code);
  const targetWeather = getWeatherInfo(targetCurrent.weather_code);

  return (
    <div className="compare-overlay" onClick={onClose} id="compare-modal">
      <div className="compare-modal" onClick={(e) => e.stopPropagation()}>
        <div className="compare-modal__header">
          <h3 className="compare-modal__title">✈️ Travel Weather Comparison</h3>
          <button className="compare-modal__close" onClick={onClose}>✕</button>
        </div>

        <div className="compare-modal__summary-badge">
          <span>{targetLocation?.name || 'Destination'} is <strong>{tempDiffStr}</strong> &amp; <strong>{timeDiffStr}</strong> than {homeLocation?.name || 'Home'}</span>
        </div>

        <div className="compare-modal__grid">
          {/* Home Location */}
          <div className="compare-card compare-card--home">
            <span className="compare-card__tag">🏠 Your Location</span>
            <h4 className="compare-card__name">{homeLocation?.name || 'Home'}</h4>
            <div className="compare-card__weather">
              <WeatherIcon code={homeCurrent.weather_code} isDay={homeCurrent.is_day === 1} size={48} />
              <span className="compare-card__temp">{tempDisplay(homeCurrent.temperature_2m, unit)}</span>
            </div>
            <p className="compare-card__desc">{homeWeather.description}</p>
            <div className="compare-card__meta">
              <span>Humidity: {homeCurrent.relative_humidity_2m}%</span>
              <span>Wind: {Math.round(homeCurrent.wind_speed_10m)} km/h</span>
              <span>UV: {Math.round(homeCurrent.uv_index)}</span>
            </div>
          </div>

          {/* Destination Location */}
          <div className="compare-card compare-card--target">
            <span className="compare-card__tag">📍 Destination</span>
            <h4 className="compare-card__name">{targetLocation?.name || 'Destination'}</h4>
            <div className="compare-card__weather">
              <WeatherIcon code={targetCurrent.weather_code} isDay={targetCurrent.is_day === 1} size={48} />
              <span className="compare-card__temp">{tempDisplay(targetCurrent.temperature_2m, unit)}</span>
            </div>
            <p className="compare-card__desc">{targetWeather.description}</p>
            <div className="compare-card__meta">
              <span>Humidity: {targetCurrent.relative_humidity_2m}%</span>
              <span>Wind: {Math.round(targetCurrent.wind_speed_10m)} km/h</span>
              <span>UV: {Math.round(targetCurrent.uv_index)}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
