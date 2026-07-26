// Note: AI was used for knowledge purposes only and treated as per knowledge.
/**
 * Smart Travel & Weather Intelligence Engine
 * Computes outfit recommendations, outdoor activity suitability scores,
 * driving hazards, and travel packing advisories based on meteorological data.
 */

/**
 * Generate smart packing & outfit suggestions
 */
export function getOutfitSuggestions(tempC, weatherCode, isDay, uvIndex, windSpeedKmH, precipProb) {
  const items = [];
  const warnings = [];

  // Temperature based clothing
  if (tempC <= 0) {
    items.push({ icon: '🧥', label: 'Heavy Winter Coat', detail: 'Sub-zero temperatures' });
    items.push({ icon: '🧤', label: 'Thermal Gloves & Beanie', detail: 'Protection against frostbite' });
    items.push({ icon: '🧣', label: 'Warm Scarf & Layers', detail: 'Essential for wind isolation' });
  } else if (tempC <= 10) {
    items.push({ icon: '🧥', label: 'Warm Jacket / Sweater', detail: 'Chilly weather' });
    items.push({ icon: '👖', label: 'Long Pants / Jeans', detail: 'Keep legs covered' });
  } else if (tempC <= 18) {
    items.push({ icon: '🥼', label: 'Light Jacket or Hoodie', detail: 'Mild & cool breeze' });
    items.push({ icon: '👕', label: 'Layered Shirts', detail: 'Easy to remove if warm' });
  } else if (tempC <= 26) {
    items.push({ icon: '👕', label: 'T-Shirt & Comfortable Pants', detail: 'Pleasant temperatures' });
  } else {
    items.push({ icon: '🎽', label: 'Light Linen / Cotton Wear', detail: 'Warm to hot conditions' });
    items.push({ icon: '🩳', label: 'Shorts & Breathable Apparel', detail: 'Stay cool & hydrated' });
  }

  // Rain / Snow accessories
  if (precipProb > 30 || [51, 53, 55, 61, 63, 65, 80, 81, 82, 95, 96, 99].includes(weatherCode)) {
    items.push({ icon: '☂️', label: 'Sturdy Umbrella', detail: `${precipProb}% rain likelihood` });
    items.push({ icon: '🥾', label: 'Waterproof Footwear', detail: 'Wet street protection' });
  }

  // UV Protection
  if (uvIndex >= 6 && isDay) {
    items.push({ icon: '🕶️', label: 'UV-Blocking Sunglasses', detail: `High UV Index (${Math.round(uvIndex)})` });
    items.push({ icon: '🧴', label: 'Sunscreen (SPF 30+)', detail: 'Prevent skin damage' });
    items.push({ icon: '🧢', label: 'Wide-Brim Sun Cap', detail: 'Direct sun shielding' });
  } else if (uvIndex >= 3 && isDay) {
    items.push({ icon: '🕶️', label: 'Sunglasses & Mild Sunscreen', detail: `Moderate UV (${Math.round(uvIndex)})` });
  }

  // Wind protection
  if (windSpeedKmH >= 30) {
    warnings.push({ title: 'Gusty Winds', desc: `Winds up to ${Math.round(windSpeedKmH)} km/h. Secure loose belongings.` });
  }

  return { items, warnings };
}

/**
 * Compute Outdoor Activity Suitability Scores (0 - 100%)
 */
export function getActivityScores(tempC, weatherCode, uvIndex, windSpeedKmH, precipProb, isDay) {
  // 1. Running / Jogging
  let running = 100;
  if (tempC < 5 || tempC > 30) running -= 30;
  else if (tempC < 10 || tempC > 25) running -= 10;
  if (precipProb > 40) running -= 40;
  if (windSpeedKmH > 25) running -= 20;
  if (uvIndex > 7 && isDay) running -= 15;
  running = Math.max(10, Math.min(100, running));

  // 2. Outdoor Sightseeing & Walking
  let sightseeing = 100;
  if (precipProb > 50) sightseeing -= 50;
  else if (precipProb > 20) sightseeing -= 20;
  if (tempC < 0 || tempC > 34) sightseeing -= 35;
  if (windSpeedKmH > 35) sightseeing -= 25;
  sightseeing = Math.max(15, Math.min(100, sightseeing));

  // 3. Beach & Picnic
  let beach = 100;
  if (!isDay) beach = 20;
  if (tempC < 22) beach -= (22 - tempC) * 5;
  if (precipProb > 20) beach -= 40;
  if (windSpeedKmH > 20) beach -= 25;
  if (uvIndex < 3 && isDay) beach -= 15;
  beach = Math.max(0, Math.min(100, Math.round(beach)));

  // 4. Photography & Outdoor Events
  let photography = 100;
  if ([45, 48].includes(weatherCode)) photography = 75; // Fog can be artistic!
  if (precipProb > 60) photography -= 50;
  if (windSpeedKmH > 30) photography -= 20;
  photography = Math.max(20, Math.min(100, photography));

  return [
    { key: 'sightseeing', label: 'Sightseeing & Walking', score: Math.round(sightseeing), icon: '🗺️' },
    { key: 'running', label: 'Running & Exercise', score: Math.round(running), icon: '🏃' },
    { key: 'beach', label: 'Beach & Picnic', score: Math.round(beach), icon: '🏖️' },
    { key: 'photography', label: 'Outdoor Photography', score: Math.round(photography), icon: '📸' },
  ];
}

/**
 * Detect Severe Weather Hazards
 */
export function getSevereWeatherHazards(current, daily) {
  const hazards = [];
  const temp = current.temperature_2m;
  const wind = current.wind_speed_10m;
  const uv = current.uv_index;
  const precip = current.precipitation;
  const code = current.weather_code;

  if ([95, 96, 99].includes(code)) {
    hazards.push({
      level: 'danger',
      title: 'Thunderstorm & Lightning Hazard',
      desc: 'Active thunderstorm reported. Seek indoor shelter immediately.',
    });
  }

  if (wind >= 45) {
    hazards.push({
      level: 'warning',
      title: 'High Wind Warning',
      desc: `Wind gusts reaching ${Math.round(wind)} km/h. Caution advised for high-profile vehicles & outdoor structures.`,
    });
  }

  if (uv >= 8) {
    hazards.push({
      level: 'warning',
      title: 'Very High UV Exposure Risk',
      desc: `UV Index is at ${Math.round(uv)}. Skin burn can occur in under 15 minutes without protection.`,
    });
  }

  if (precip >= 10) {
    hazards.push({
      level: 'info',
      title: 'Heavy Rainfall & Driving Advisory',
      desc: 'High hydroplaning risk on roadways. Reduce speed and maintain safe braking distance.',
    });
  }

  if (temp <= -5) {
    hazards.push({
      level: 'danger',
      title: 'Freezing Hazard',
      desc: `Severe cold at ${Math.round(temp)}°C. Black ice risk on bridges and walkways.`,
    });
  }

  return hazards;
}
