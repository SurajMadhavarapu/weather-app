/**
 * Weather API service using Open-Meteo (free, no API key required)
 */

const GEOCODING_URL = 'https://geocoding-api.open-meteo.com/v1/search';
const FORECAST_URL = 'https://api.open-meteo.com/v1/forecast';

/**
 * Search for locations by name (city, landmark, zip code, etc.)
 * Returns array of location results with lat/lon
 */
export async function searchLocations(query) {
  if (!query || query.trim().length < 2) return [];

  const params = new URLSearchParams({
    name: query.trim(),
    count: '8',
    language: 'en',
    format: 'json',
  });

  const response = await fetch(`${GEOCODING_URL}?${params}`);

  if (!response.ok) {
    throw new Error(`Geocoding API error: ${response.status} ${response.statusText}`);
  }

  const data = await response.json();

  if (!data.results || data.results.length === 0) {
    return [];
  }

  return data.results.map((r) => ({
    id: r.id,
    name: r.name,
    country: r.country || '',
    countryCode: r.country_code || '',
    admin1: r.admin1 || '', // state/province
    latitude: r.latitude,
    longitude: r.longitude,
    timezone: r.timezone,
    population: r.population || 0,
    displayName: buildDisplayName(r),
  }));
}

/**
 * Build a readable display name from a geocoding result
 */
function buildDisplayName(result) {
  const parts = [result.name];
  if (result.admin1 && result.admin1 !== result.name) {
    parts.push(result.admin1);
  }
  if (result.country) {
    parts.push(result.country);
  }
  return parts.join(', ');
}

/**
 * Fetch current weather + hourly (next 24h) + daily (5-day) forecast
 */
export async function fetchWeather(latitude, longitude) {
  const params = new URLSearchParams({
    latitude: String(latitude),
    longitude: String(longitude),
    current: [
      'temperature_2m',
      'relative_humidity_2m',
      'apparent_temperature',
      'is_day',
      'precipitation',
      'weather_code',
      'wind_speed_10m',
      'wind_direction_10m',
      'surface_pressure',
      'uv_index',
    ].join(','),
    hourly: [
      'temperature_2m',
      'weather_code',
      'precipitation_probability',
      'wind_speed_10m',
      'is_day',
    ].join(','),
    daily: [
      'weather_code',
      'temperature_2m_max',
      'temperature_2m_min',
      'apparent_temperature_max',
      'apparent_temperature_min',
      'precipitation_sum',
      'precipitation_probability_max',
      'wind_speed_10m_max',
      'sunrise',
      'sunset',
      'uv_index_max',
    ].join(','),
    timezone: 'auto',
    forecast_days: '6', // today + 5 more days
  });

  const response = await fetch(`${FORECAST_URL}?${params}`);

  if (!response.ok) {
    throw new Error(`Weather API error: ${response.status} ${response.statusText}`);
  }

  const data = await response.json();
  return data;
}

/**
 * Fetch Air Quality (US AQI, PM2.5, PM10, Dust) for a location
 */
export async function fetchAirQuality(latitude, longitude) {
  try {
    const params = new URLSearchParams({
      latitude: String(latitude),
      longitude: String(longitude),
      current: ['us_aqi', 'pm2_5', 'pm10', 'dust'].join(','),
    });

    const response = await fetch(`https://air-quality-api.open-meteo.com/v1/air-quality?${params}`);
    if (!response.ok) return null;
    const data = await response.json();
    return data.current || null;
  } catch (err) {
    console.warn('Air quality fetch error:', err);
    return null;
  }
}

/**
 * Get the user's current position using browser Geolocation API
 * Returns { latitude, longitude }
 */
export function getCurrentPosition() {
  return new Promise((resolve, reject) => {
    if (!navigator.geolocation) {
      reject(new Error('Geolocation is not supported by your browser'));
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        resolve({
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
        });
      },
      (error) => {
        switch (error.code) {
          case error.PERMISSION_DENIED:
            reject(new Error('Location access denied. Please enable location permissions in your browser settings, or search for a city manually.'));
            break;
          case error.POSITION_UNAVAILABLE:
            reject(new Error('Location information is unavailable. Please try searching for a city instead.'));
            break;
          case error.TIMEOUT:
            reject(new Error('Location request timed out. Please try again or search manually.'));
            break;
          default:
            reject(new Error('An unknown error occurred while getting your location.'));
        }
      },
      {
        enableHighAccuracy: false,
        timeout: 10000,
        maximumAge: 300000, // 5 min cache
      }
    );
  });
}

/**
 * Reverse geocode: given lat/lon, find the closest city name
 */
export async function reverseGeocode(latitude, longitude) {
  // Open-Meteo doesn't have a reverse geocoding endpoint,
  // so we use a workaround: search with coordinates in the name
  // Actually, we'll use the Nominatim API (free, no key)
  try {
    const response = await fetch(
      `https://nominatim.openstreetmap.org/reverse?lat=${latitude}&lon=${longitude}&format=json&zoom=10`,
      {
        headers: {
          'Accept-Language': 'en',
        },
      }
    );

    if (!response.ok) throw new Error('Reverse geocoding failed');

    const data = await response.json();
    const address = data.address || {};

    const cityName = address.city || address.town || address.village || address.county || address.state || 'Unknown Location';
    const country = address.country || '';
    const state = address.state || '';

    return {
      name: cityName,
      admin1: state,
      country: country,
      displayName: [cityName, state, country].filter(Boolean).join(', '),
    };
  } catch {
    return {
      name: 'Current Location',
      admin1: '',
      country: '',
      displayName: `${latitude.toFixed(2)}°, ${longitude.toFixed(2)}°`,
    };
  }
}
