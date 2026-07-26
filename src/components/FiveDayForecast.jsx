// Note: AI was used for knowledge purposes only and treated as per knowledge.
import { WeatherIcon, getWeatherInfo } from '../utils/weatherCodes';
import { getDayName, convertTemp } from '../utils/helpers';

export default function FiveDayForecast({ data, unit }) {
  if (!data || !data.daily) return null;

  const { daily } = data;
  // Skip index 0 (today) and show next 5 days
  const days = [];
  for (let i = 1; i <= 5 && i < daily.time.length; i++) {
    days.push({
      date: daily.time[i],
      weatherCode: daily.weather_code[i],
      high: daily.temperature_2m_max[i],
      low: daily.temperature_2m_min[i],
      precipProb: daily.precipitation_probability_max[i],
      precipSum: daily.precipitation_sum[i],
      windMax: daily.wind_speed_10m_max[i],
      uvMax: daily.uv_index_max[i],
    });
  }

  if (days.length === 0) return null;

  // Find the overall min and max for the temperature bar
  const allTemps = days.flatMap((d) => [d.low, d.high]);
  const overallMin = Math.min(...allTemps);
  const overallMax = Math.max(...allTemps);
  const range = overallMax - overallMin || 1;

  return (
    <section className="five-day-forecast" id="five-day-forecast">
      <h2 className="section-title">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="20" height="20">
          <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
          <line x1="16" y1="2" x2="16" y2="6" />
          <line x1="8" y1="2" x2="8" y2="6" />
          <line x1="3" y1="10" x2="21" y2="10" />
        </svg>
        5-Day Forecast
      </h2>
      <div className="five-day-forecast__list">
        {days.map((day) => {
          const info = getWeatherInfo(day.weatherCode);
          const lowPct = ((day.low - overallMin) / range) * 100;
          const highPct = ((day.high - overallMin) / range) * 100;

          return (
            <div key={day.date} className="five-day-forecast__row">
              <span className="five-day-forecast__day">{getDayName(day.date)}</span>

              <div className="five-day-forecast__icon-wrap">
                <WeatherIcon code={day.weatherCode} isDay={true} size={28} />
              </div>

              {day.precipProb > 0 && (
                <span className="five-day-forecast__precip">
                  <svg viewBox="0 0 24 24" fill="currentColor" width="12" height="12">
                    <path d="M12 2c-5.33 4.55-8 8.48-8 11.8 0 4.98 3.8 8.2 8 8.2s8-3.22 8-8.2c0-3.32-2.67-7.25-8-11.8z" />
                  </svg>
                  {day.precipProb}%
                </span>
              )}
              {day.precipProb === 0 && (
                <span className="five-day-forecast__precip five-day-forecast__precip--empty"></span>
              )}

              <span className="five-day-forecast__temp-low">
                {convertTemp(day.low, unit)}°
              </span>

              <div className="five-day-forecast__temp-bar">
                <div
                  className="five-day-forecast__temp-range"
                  style={{
                    left: `${lowPct}%`,
                    width: `${highPct - lowPct}%`,
                  }}
                />
              </div>

              <span className="five-day-forecast__temp-high">
                {convertTemp(day.high, unit)}°
              </span>
            </div>
          );
        })}
      </div>
    </section>
  );
}
