// Note: AI was used for knowledge purposes only and treated as per knowledge.
import { windDirection, getUVLevel, formatVisibility, formatPressure } from '../utils/helpers';

export default function WeatherDetails({ data, unit }) {
  if (!data || !data.current) return null;

  const current = data.current;
  const daily = data.daily;

  const uvLevel = getUVLevel(current.uv_index);
  const windDir = windDirection(current.wind_direction_10m);

  const details = [
    {
      id: 'humidity',
      label: 'Humidity',
      value: `${current.relative_humidity_2m}%`,
      icon: (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="22" height="22">
          <path d="M12 2c-5.33 4.55-8 8.48-8 11.8 0 4.98 3.8 8.2 8 8.2s8-3.22 8-8.2c0-3.32-2.67-7.25-8-11.8z" />
        </svg>
      ),
      extra: (
        <div className="detail-bar">
          <div className="detail-bar__fill" style={{ width: `${current.relative_humidity_2m}%` }} />
        </div>
      ),
    },
    {
      id: 'wind',
      label: 'Wind',
      value: `${Math.round(current.wind_speed_10m)} km/h`,
      icon: (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="22" height="22">
          <path d="M17.7 7.7A2.5 2.5 0 0 1 17 13H2" />
          <path d="M9.6 4.6A2 2 0 0 1 11 9H2" />
          <path d="M12.6 19.4A2 2 0 1 0 14 15H2" />
        </svg>
      ),
      extra: <span className="detail-sub">{windDir} direction</span>,
    },
    {
      id: 'uv-index',
      label: 'UV Index',
      value: `${Math.round(current.uv_index)}`,
      icon: (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="22" height="22">
          <circle cx="12" cy="12" r="4" />
          <path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M6.34 17.66l-1.41 1.41M19.07 4.93l-1.41 1.41" />
        </svg>
      ),
      extra: (
        <div className="detail-uv">
          <div className="detail-bar detail-bar--uv">
            <div className="detail-bar__fill" style={{ width: `${uvLevel.percent}%`, backgroundColor: uvLevel.color }} />
          </div>
          <span className="detail-sub" style={{ color: uvLevel.color }}>{uvLevel.label}</span>
        </div>
      ),
    },
    {
      id: 'pressure',
      label: 'Pressure',
      value: formatPressure(current.surface_pressure),
      icon: (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="22" height="22">
          <circle cx="12" cy="12" r="10" />
          <path d="M12 6v6l4 2" />
        </svg>
      ),
      extra: null,
    },
    {
      id: 'precipitation',
      label: 'Precipitation',
      value: `${current.precipitation} mm`,
      icon: (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="22" height="22">
          <path d="M4 14.899A7 7 0 1 1 15.71 8h1.79a4.5 4.5 0 0 1 2.5 8.242" />
          <path d="M16 14v6M8 14v6M12 16v6" />
        </svg>
      ),
      extra: daily?.precipitation_probability_max?.[0] != null ? (
        <span className="detail-sub">{daily.precipitation_probability_max[0]}% chance today</span>
      ) : null,
    },
    {
      id: 'wind-max',
      label: 'Max Wind Today',
      value: daily?.wind_speed_10m_max?.[0] != null
        ? `${Math.round(daily.wind_speed_10m_max[0])} km/h`
        : 'N/A',
      icon: (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="22" height="22">
          <path d="M4 14.899A7 7 0 1 1 15.71 8h1.79a4.5 4.5 0 0 1 2.5 8.242" />
          <path d="M12 12v9M8 17l4 4 4-4" />
        </svg>
      ),
      extra: null,
    },
  ];

  return (
    <section className="weather-details" id="weather-details">
      <h2 className="section-title">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="20" height="20">
          <circle cx="12" cy="12" r="10" />
          <line x1="12" y1="16" x2="12" y2="12" />
          <line x1="12" y1="8" x2="12.01" y2="8" />
        </svg>
        Weather Details
      </h2>
      <div className="weather-details__grid">
        {details.map((detail) => (
          <div key={detail.id} className="weather-details__card" id={`detail-${detail.id}`}>
            <div className="weather-details__card-header">
              {detail.icon}
              <span className="weather-details__card-label">{detail.label}</span>
            </div>
            <span className="weather-details__card-value">{detail.value}</span>
            {detail.extra}
          </div>
        ))}
      </div>
    </section>
  );
}
