// Note: AI was used for knowledge purposes only and treated as per knowledge.
import { getOutfitSuggestions, getActivityScores } from '../utils/travelInsights';

export default function TravelInsightsCard({ data, unit }) {
  if (!data || !data.current) return null;

  const current = data.current;
  const tempC = current.temperature_2m;
  const code = current.weather_code;
  const isDay = current.is_day === 1;
  const uv = current.uv_index;
  const wind = current.wind_speed_10m;
  const precipProb = data.daily?.precipitation_probability_max?.[0] || 0;

  const { items, warnings } = getOutfitSuggestions(tempC, code, isDay, uv, wind, precipProb);
  const activities = getActivityScores(tempC, code, uv, wind, precipProb, isDay);

  return (
    <section className="travel-insights" id="travel-insights">
      <h2 className="section-title">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="20" height="20">
          <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z" />
          <polyline points="3.27 6.96 12 12.01 20.73 6.96" />
          <line x1="12" y1="22.08" x2="12" y2="12" />
        </svg>
        Smart Travel & Outfit Intelligence
      </h2>

      <div className="travel-insights__grid">
        {/* Packing & Outfit Suggestions */}
        <div className="travel-insights__card">
          <h3 className="travel-insights__subtitle">
            <span>🧳</span> Packing & Apparel Recommendations
          </h3>
          <div className="outfit-list">
            {items.map((item, idx) => (
              <div key={idx} className="outfit-item">
                <span className="outfit-item__icon">{item.icon}</span>
                <div className="outfit-item__text">
                  <span className="outfit-item__label">{item.label}</span>
                  <span className="outfit-item__detail">{item.detail}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Outdoor Activity Suitability Scores */}
        <div className="travel-insights__card">
          <h3 className="travel-insights__subtitle">
            <span>📊</span> Outdoor Activity Suitability Index
          </h3>
          <div className="activity-list">
            {activities.map((act) => {
              const getScoreColor = (score) => {
                if (score >= 75) return '#4CAF50';
                if (score >= 50) return '#FFC107';
                return '#F44336';
              };
              const color = getScoreColor(act.score);

              return (
                <div key={act.key} className="activity-item">
                  <div className="activity-item__header">
                    <span className="activity-item__name">
                      {act.icon} {act.label}
                    </span>
                    <span className="activity-item__score" style={{ color }}>
                      {act.score}%
                    </span>
                  </div>
                  <div className="activity-item__bar">
                    <div
                      className="activity-item__fill"
                      style={{ width: `${act.score}%`, backgroundColor: color }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
