// Note: AI was used for knowledge purposes only and treated as per knowledge.
/**
 * Helper utilities for the weather app
 */

/**
 * Format a date string to a short day name (e.g., "Mon", "Tue")
 */
export function getDayName(dateStr) {
  const date = new Date(dateStr + 'T00:00:00');
  return date.toLocaleDateString('en-US', { weekday: 'short' });
}

/**
 * Format a date string to full readable date (e.g., "Monday, July 24")
 */
export function getFullDate(dateStr) {
  const date = new Date(dateStr + 'T00:00:00');
  return date.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' });
}

/**
 * Format an ISO time string to 12h format (e.g., "2 PM", "11 AM")
 */
export function formatHour(isoStr) {
  const date = new Date(isoStr);
  let hours = date.getHours();
  const ampm = hours >= 12 ? 'PM' : 'AM';
  hours = hours % 12 || 12;
  return `${hours} ${ampm}`;
}

/**
 * Format time from ISO string (e.g., "6:30 AM")
 */
export function formatTime(isoStr) {
  const date = new Date(isoStr);
  let hours = date.getHours();
  const minutes = date.getMinutes();
  const ampm = hours >= 12 ? 'PM' : 'AM';
  hours = hours % 12 || 12;
  return `${hours}:${String(minutes).padStart(2, '0')} ${ampm}`;
}

/**
 * Convert Celsius to Fahrenheit
 */
export function celsiusToFahrenheit(c) {
  return (c * 9) / 5 + 32;
}

/**
 * Convert temperature based on unit preference
 */
export function convertTemp(celsius, unit) {
  if (unit === 'F') return Math.round(celsiusToFahrenheit(celsius));
  return Math.round(celsius);
}

/**
 * Get display string for temperature
 */
export function tempDisplay(celsius, unit) {
  return `${convertTemp(celsius, unit)}°${unit}`;
}

/**
 * Convert wind degree to compass direction
 */
export function windDirection(degrees) {
  const directions = ['N', 'NNE', 'NE', 'ENE', 'E', 'ESE', 'SE', 'SSE', 'S', 'SSW', 'SW', 'WSW', 'W', 'WNW', 'NW', 'NNW'];
  const index = Math.round(degrees / 22.5) % 16;
  return directions[index];
}

/**
 * Get UV index label and color
 */
export function getUVLevel(uv) {
  if (uv <= 2) return { label: 'Low', color: '#4CAF50', percent: (uv / 11) * 100 };
  if (uv <= 5) return { label: 'Moderate', color: '#FFC107', percent: (uv / 11) * 100 };
  if (uv <= 7) return { label: 'High', color: '#FF9800', percent: (uv / 11) * 100 };
  if (uv <= 10) return { label: 'Very High', color: '#F44336', percent: (uv / 11) * 100 };
  return { label: 'Extreme', color: '#9C27B0', percent: 100 };
}

/**
 * Convert visibility from meters to km or miles
 */
export function formatVisibility(meters) {
  const km = meters / 1000;
  if (km >= 10) return `${Math.round(km)} km`;
  return `${km.toFixed(1)} km`;
}

/**
 * Convert pressure from hPa
 */
export function formatPressure(hpa) {
  return `${Math.round(hpa)} hPa`;
}

/**
 * Debounce function
 */
export function debounce(fn, delay) {
  let timer;
  return (...args) => {
    clearTimeout(timer);
    timer = setTimeout(() => fn(...args), delay);
  };
}

/**
 * Get current date/time formatted nicely
 */
export function getCurrentDateTime() {
  return new Date().toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}

/**
 * Check if the current hour is "now" for hourly forecast highlighting
 */
export function isCurrentHour(isoStr) {
  const now = new Date();
  const target = new Date(isoStr);
  return now.getHours() === target.getHours() && now.getDate() === target.getDate();
}
