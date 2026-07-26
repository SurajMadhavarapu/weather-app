// Note: AI was used for knowledge purposes only and treated as per knowledge.
// WMO Weather interpretation codes (WW)
// https://open-meteo.com/en/docs
//weatherCodeMap
const weatherCodeMap = {
  0: { description: 'Clear sky', icon: 'clear', group: 'clear' },
  1: { description: 'Mainly clear', icon: 'mainly-clear', group: 'clear' },
  2: { description: 'Partly cloudy', icon: 'partly-cloudy', group: 'cloudy' },
  3: { description: 'Overcast', icon: 'overcast', group: 'cloudy' },
  45: { description: 'Foggy', icon: 'fog', group: 'fog' }, 
  48: { description: 'Depositing rime fog', icon: 'fog', group: 'fog' },
  51: { description: 'Light drizzle', icon: 'drizzle', group: 'rain' },
  53: { description: 'Moderate drizzle', icon: 'drizzle', group: 'rain' },
  55: { description: 'Dense drizzle', icon: 'drizzle', group: 'rain' },
  56: { description: 'Light freezing drizzle', icon: 'freezing-drizzle', group: 'rain' },
  57: { description: 'Dense freezing drizzle', icon: 'freezing-drizzle', group: 'rain' },
  61: { description: 'Slight rain', icon: 'rain-light', group: 'rain' },
  63: { description: 'Moderate rain', icon: 'rain', group: 'rain' },
  65: { description: 'Heavy rain', icon: 'rain-heavy', group: 'rain' },
  66: { description: 'Light freezing rain', icon: 'freezing-rain', group: 'rain' },
  67: { description: 'Heavy freezing rain', icon: 'freezing-rain', group: 'rain' },
  71: { description: 'Slight snowfall', icon: 'snow-light', group: 'snow' },
  73: { description: 'Moderate snowfall', icon: 'snow', group: 'snow' },
  75: { description: 'Heavy snowfall', icon: 'snow-heavy', group: 'snow' },
  77: { description: 'Snow grains', icon: 'snow-grains', group: 'snow' },
  80: { description: 'Slight rain showers', icon: 'rain-showers', group: 'rain' },
  81: { description: 'Moderate rain showers', icon: 'rain-showers', group: 'rain' },
  82: { description: 'Violent rain showers', icon: 'rain-showers-heavy', group: 'rain' },
  85: { description: 'Slight snow showers', icon: 'snow-showers', group: 'snow' },
  86: { description: 'Heavy snow showers', icon: 'snow-showers-heavy', group: 'snow' },
  95: { description: 'Thunderstorm', icon: 'thunderstorm', group: 'storm' },
  96: { description: 'Thunderstorm with slight hail', icon: 'thunderstorm-hail', group: 'storm' },
  99: { description: 'Thunderstorm with heavy hail', icon: 'thunderstorm-hail', group: 'storm' },
};

export function getWeatherInfo(code) {
  return weatherCodeMap[code] || { description: 'Unknown', icon: 'clear', group: 'clear' };
}

// Returns an SVG weather icon as a React-renderable string
// isDay: boolean to switch between day/night variants
export function WeatherIcon({ code, isDay = true, size = 48 }) {
  const info = getWeatherInfo(code);
  const iconName = info.icon;

  // Color scheme
  const sunColor = '#FFD700';
  const moonColor = '#C9D1D9';
  const cloudColor = isDay ? '#B0BEC5' : '#78909C';
  const cloudDark = '#78909C';
  const rainColor = '#64B5F6';
  const snowColor = '#E3F2FD';
  const boltColor = '#FFC107';

  const svgProps = {
    width: size,
    height: size,
    viewBox: '0 0 64 64',
    fill: 'none',
    xmlns: 'http://www.w3.org/2000/svg',
    className: `weather-icon weather-icon--${iconName}`,
  };

  // Sun
  if (iconName === 'clear' && isDay) {
    return (
      <svg {...svgProps}>
        <circle cx="32" cy="32" r="12" fill={sunColor} className="sun-body" />
        {[0, 45, 90, 135, 180, 225, 270, 315].map((angle, i) => {
          const rad = (angle * Math.PI) / 180;
          const x1 = 32 + 16 * Math.cos(rad);
          const y1 = 32 + 16 * Math.sin(rad);
          const x2 = 32 + 22 * Math.cos(rad);
          const y2 = 32 + 22 * Math.sin(rad);
          return <line key={i} x1={x1} y1={y1} x2={x2} y2={y2} stroke={sunColor} strokeWidth="2.5" strokeLinecap="round" className="sun-ray" />;
        })}
      </svg>
    );
  }

  // Moon (clear night)
  if (iconName === 'clear' && !isDay) {
    return (
      <svg {...svgProps}>
        <path d="M36 16a16 16 0 1 0 0 32 16 16 0 0 1 0-32z" fill={moonColor} className="moon-body" />
        <circle cx="30" cy="24" r="1.5" fill="#A0AEC0" opacity="0.5" />
        <circle cx="38" cy="36" r="1" fill="#A0AEC0" opacity="0.4" />
        <circle cx="34" cy="30" r="0.8" fill="#A0AEC0" opacity="0.3" />
      </svg>
    );
  }

  // Partly cloudy
  if (iconName === 'mainly-clear' || iconName === 'partly-cloudy') {
    return (
      <svg {...svgProps}>
        {isDay ? (
          <>
            <circle cx="24" cy="22" r="9" fill={sunColor} className="sun-body" />
            {[0, 60, 120, 180, 240, 300].map((angle, i) => {
              const rad = (angle * Math.PI) / 180;
              const x1 = 24 + 12 * Math.cos(rad);
              const y1 = 22 + 12 * Math.sin(rad);
              const x2 = 24 + 16 * Math.cos(rad);
              const y2 = 22 + 16 * Math.sin(rad);
              return <line key={i} x1={x1} y1={y1} x2={x2} y2={y2} stroke={sunColor} strokeWidth="2" strokeLinecap="round" className="sun-ray" />;
            })}
          </>
        ) : (
          <path d="M28 14a10 10 0 1 0 0 20 10 10 0 0 1 0-20z" fill={moonColor} className="moon-body" />
        )}
        <path d="M22 44a8 8 0 0 1 0-16h2a10 10 0 0 1 19.8 2A6 6 0 0 1 44 44H22z" fill={cloudColor} className="cloud" />
      </svg>
    );
  }

  // Overcast
  if (iconName === 'overcast') {
    return (
      <svg {...svgProps}>
        <path d="M16 46a7 7 0 0 1 0-14h1a9 9 0 0 1 17.7 2A5.5 5.5 0 0 1 38 46H16z" fill={cloudDark} className="cloud" />
        <path d="M24 40a6 6 0 0 1 0-12h1a8 8 0 0 1 15.7 1.5A4.5 4.5 0 0 1 44 40H24z" fill={cloudColor} className="cloud" opacity="0.8" />
      </svg>
    );
  }

  // Fog
  if (iconName === 'fog') {
    return (
      <svg {...svgProps}>
        <path d="M18 38a6 6 0 0 1 0-12h1a8 8 0 0 1 15.7 1.5A4.5 4.5 0 0 1 38 38H18z" fill={cloudColor} className="cloud" />
        {[42, 47, 52].map((y, i) => (
          <line key={i} x1="12" y1={y} x2="52" y2={y} stroke={cloudColor} strokeWidth="2" strokeLinecap="round" opacity={0.6 - i * 0.15} className="fog-line" />
        ))}
      </svg>
    );
  }

  // Rain variants
  if (iconName.includes('rain') || iconName.includes('drizzle')) {
    const heavy = iconName.includes('heavy') || iconName.includes('dense');
    const drops = heavy ? [[24,46],[32,48],[40,44],[28,52],[36,50]] : [[26,46],[34,48],[42,44]];
    return (
      <svg {...svgProps}>
        <path d="M16 36a7 7 0 0 1 0-14h1a9 9 0 0 1 17.7 2A5.5 5.5 0 0 1 38 36H16z" fill={cloudDark} className="cloud" />
        {drops.map(([x, y], i) => (
          <line key={i} x1={x} y1={y} x2={x - 2} y2={y + 6} stroke={rainColor} strokeWidth="2" strokeLinecap="round" className="raindrop" style={{ animationDelay: `${i * 0.2}s` }} />
        ))}
      </svg>
    );
  }

  // Snow variants
  if (iconName.includes('snow')) {
    const flakes = [[24,44],[32,48],[40,42],[28,52],[36,54]];
    return (
      <svg {...svgProps}>
        <path d="M16 36a7 7 0 0 1 0-14h1a9 9 0 0 1 17.7 2A5.5 5.5 0 0 1 38 36H16z" fill={cloudColor} className="cloud" />
        {flakes.map(([x, y], i) => (
          <circle key={i} cx={x} cy={y} r="2" fill={snowColor} className="snowflake" style={{ animationDelay: `${i * 0.3}s` }} />
        ))}
      </svg>
    );
  }

  // Thunderstorm
  if (iconName.includes('thunderstorm')) {
    return (
      <svg {...svgProps}>
        <path d="M14 34a7 7 0 0 1 0-14h1a9 9 0 0 1 17.7 2A5.5 5.5 0 0 1 36 34H14z" fill={cloudDark} className="cloud" />
        <polygon points="30,36 26,46 32,46 28,56 38,44 32,44 36,36" fill={boltColor} className="bolt" />
        {[[22,46],[40,44]].map(([x, y], i) => (
          <line key={i} x1={x} y1={y} x2={x - 2} y2={y + 6} stroke={rainColor} strokeWidth="2" strokeLinecap="round" className="raindrop" />
        ))}
      </svg>
    );
  }

  // Fallback: generic cloud
  return (
    <svg {...svgProps}>
      <path d="M18 42a7 7 0 0 1 0-14h1a9 9 0 0 1 17.7 2A5.5 5.5 0 0 1 40 42H18z" fill={cloudColor} className="cloud" />
    </svg>
  );
}

// Background gradient based on weather condition and day/night
export function getWeatherGradient(code, isDay) {
  const info = getWeatherInfo(code);
  const group = info.group;

  if (!isDay) {
    switch (group) {
      case 'clear': return 'linear-gradient(135deg, #0f0c29 0%, #302b63 50%, #24243e 100%)';
      case 'cloudy': return 'linear-gradient(135deg, #141e30 0%, #243b55 100%)';
      case 'rain': return 'linear-gradient(135deg, #0d1117 0%, #1a2332 50%, #0d1b2a 100%)';
      case 'snow': return 'linear-gradient(135deg, #1a1a2e 0%, #16213e 50%, #0f3460 100%)';
      case 'storm': return 'linear-gradient(135deg, #0a0a0a 0%, #1a1a2e 50%, #16213e 100%)';
      case 'fog': return 'linear-gradient(135deg, #1a1a2e 0%, #2d3436 100%)';
      default: return 'linear-gradient(135deg, #0f0c29 0%, #302b63 50%, #24243e 100%)';
    }
  }

  switch (group) {
    case 'clear': return 'linear-gradient(135deg, #2193b0 0%, #6dd5ed 50%, #89CFF0 100%)';
    case 'cloudy': return 'linear-gradient(135deg, #606c88 0%, #3f4c6b 50%, #606c88 100%)';
    case 'rain': return 'linear-gradient(135deg, #4b6584 0%, #596275 50%, #2c3e50 100%)';
    case 'snow': return 'linear-gradient(135deg, #83a4d4 0%, #b6fbff 100%)';
    case 'storm': return 'linear-gradient(135deg, #2c3e50 0%, #4a5568 50%, #2d3748 100%)';
    case 'fog': return 'linear-gradient(135deg, #757F9A 0%, #D7DDE8 100%)';
    default: return 'linear-gradient(135deg, #2193b0 0%, #6dd5ed 100%)';
  }
}
