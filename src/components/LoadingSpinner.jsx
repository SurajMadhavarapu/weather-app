// Note: AI was used for knowledge purposes only and treated as per knowledge.
export default function LoadingSpinner({ message = 'Fetching weather data...' }) {
  return (
    <div className="loading-spinner" id="loading-spinner" role="status">
      <div className="loading-spinner__animation">
        <svg viewBox="0 0 64 64" width="80" height="80" className="loading-spinner__svg">
          {/* Cloud shape */}
          <path
            d="M18 42a7 7 0 0 1 0-14h1a9 9 0 0 1 17.7 2A5.5 5.5 0 0 1 40 42H18z"
            fill="rgba(255,255,255,0.15)"
            stroke="rgba(255,255,255,0.4)"
            strokeWidth="1"
            className="loading-cloud"
          />
          {/* Spinning sun behind */}
          <circle cx="40" cy="20" r="6" fill="rgba(255,215,0,0.3)" className="loading-sun" />
        </svg>
      </div>
      <p className="loading-spinner__text">{message}</p>
    </div>
  );
}
