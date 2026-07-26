// Note: AI was used for knowledge purposes only and treated as per knowledge.
export default function AirQualityCard({ airQuality }) {
  if (!airQuality || airQuality.us_aqi == null) return null;

  const aqi = Math.round(airQuality.us_aqi);

  const getAQIInfo = (val) => {
    if (val <= 50) return { label: 'Good', color: '#4CAF50', desc: 'Air quality is satisfactory with little to no risk.' };
    if (val <= 100) return { label: 'Moderate', color: '#FFC107', desc: 'Acceptable air quality. Unusually sensitive individuals should limit outdoor exertion.' };
    if (val <= 150) return { label: 'Unhealthy for Sensitive Groups', color: '#FF9800', desc: 'Members of sensitive groups may experience health effects.' };
    if (val <= 200) return { label: 'Unhealthy', color: '#F44336', desc: 'Everyone may begin to experience health effects. Limit outdoor activities.' };
    if (val <= 300) return { label: 'Very Unhealthy', color: '#9C27B0', desc: 'Health alert: risk of health effects for everyone.' };
    return { label: 'Hazardous', color: '#7e0023', desc: 'Health warning of emergency conditions.' };
  };

  const info = getAQIInfo(aqi);
  const percent = Math.min(100, (aqi / 300) * 100);

  return (
    <section className="air-quality-section" id="air-quality">
      <h2 className="section-title">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="20" height="20">
          <path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2" />
          <path d="M16 12a4 4 0 1 1-8 0" />
        </svg>
        Air Quality & Environmental Health
      </h2>

      <div className="aqi-card">
        <div className="aqi-card__main">
          <div className="aqi-card__score-wrap">
            <span className="aqi-card__score" style={{ color: info.color }}>
              {aqi}
            </span>
            <span className="aqi-card__badge" style={{ backgroundColor: info.color }}>
              {info.label}
            </span>
          </div>

          <div className="aqi-card__meter">
            <div className="aqi-card__bar">
              <div
                className="aqi-card__fill"
                style={{ width: `${percent}%`, backgroundColor: info.color }}
              />
            </div>
            <p className="aqi-card__desc">{info.desc}</p>
          </div>
        </div>

        <div className="aqi-card__pollutants">
          {airQuality.pm2_5 != null && (
            <div className="pollutant-item">
              <span className="pollutant-label">PM2.5</span>
              <span className="pollutant-value">{Math.round(airQuality.pm2_5)} μg/m³</span>
            </div>
          )}
          {airQuality.pm10 != null && (
            <div className="pollutant-item">
              <span className="pollutant-label">PM10</span>
              <span className="pollutant-value">{Math.round(airQuality.pm10)} μg/m³</span>
            </div>
          )}
          {airQuality.dust != null && (
            <div className="pollutant-item">
              <span className="pollutant-label">Dust</span>
              <span className="pollutant-value">{Math.round(airQuality.dust)} μg/m³</span>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
