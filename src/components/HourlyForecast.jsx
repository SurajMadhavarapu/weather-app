// Note: AI was used for knowledge purposes only and treated as per knowledge.
import { WeatherIcon } from '../utils/weatherCodes';
import { formatHour, convertTemp, isCurrentHour } from '../utils/helpers';

export default function HourlyForecast({ data, unit }) {
  if (!data || !data.hourly) return null;

  const { hourly } = data;
  const now = new Date();
  const currentHourIndex = hourly.time.findIndex((t) => new Date(t) >= now);
  const startIndex = Math.max(0, currentHourIndex);
  const hours = [];

  for (let i = startIndex; i < Math.min(startIndex + 24, hourly.time.length); i++) {
    hours.push({
      time: hourly.time[i],
      temp: hourly.temperature_2m[i],
      weatherCode: hourly.weather_code[i],
      precipProb: hourly.precipitation_probability[i],
      windSpeed: hourly.wind_speed_10m[i],
      isDay: hourly.is_day[i],
    });
  }

  if (hours.length === 0) return null;

  return (
    <section className="hourly-forecast" id="hourly-forecast">
      <h2 className="section-title">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="20" height="20">
          <circle cx="12" cy="12" r="10" />
          <polyline points="12 6 12 12 16 14" />
        </svg>
        Hourly Forecast
      </h2>
      <div className="hourly-forecast__scroll">
        {hours.map((hour, idx) => {
          const isCurrent = isCurrentHour(hour.time);
          return (
            <div
              key={hour.time}
              className={`hourly-forecast__card ${isCurrent ? 'hourly-forecast__card--current' : ''}`}
            >
              <span className="hourly-forecast__time">
                {isCurrent ? 'Now' : formatHour(hour.time)}
              </span>
              <WeatherIcon code={hour.weatherCode} isDay={hour.isDay === 1} size={32} />
              <span className="hourly-forecast__temp">
                {convertTemp(hour.temp, unit)}°
              </span>
              {hour.precipProb > 0 && (
                <span className="hourly-forecast__precip">
                  <svg viewBox="0 0 24 24" fill="currentColor" width="12" height="12">
                    <path d="M12 2c-5.33 4.55-8 8.48-8 11.8 0 4.98 3.8 8.2 8 8.2s8-3.22 8-8.2c0-3.32-2.67-7.25-8-11.8z" />
                  </svg>
                  {hour.precipProb}%
                </span>
              )}
            </div>
          );
        })}
      </div>
    </section>
  );
}
