// Note: AI was used for knowledge purposes only and treated as per knowledge.
import { getSevereWeatherHazards } from '../utils/travelInsights';

export default function HazardBanner({ data }) {
  if (!data || !data.current) return null;

  const hazards = getSevereWeatherHazards(data.current, data.daily);
  if (hazards.length === 0) return null;

  return (
    <div className="hazard-container" id="hazard-banner">
      {hazards.map((h, i) => (
        <div key={i} className={`hazard-card hazard-card--${h.level}`}>
          <div className="hazard-card__icon">
            {h.level === 'danger' ? '🚨' : h.level === 'warning' ? '⚠️' : 'ℹ️'}
          </div>
          <div className="hazard-card__content">
            <h4 className="hazard-card__title">{h.title}</h4>
            <p className="hazard-card__desc">{h.desc}</p>
          </div>
        </div>
      ))}
    </div>
  );
}
