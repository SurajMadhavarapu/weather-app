import { useEffect, useRef } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { getWeatherInfo } from '../utils/weatherCodes';

export default function InteractiveMap({ weatherData, location }) {
  const mapRef = useRef(null);
  const mapInstanceRef = useRef(null);

  useEffect(() => {
    if (!mapRef.current || !location?.latitude) return;

    const lat = location.latitude;
    const lon = location.longitude;

    // Destroy previous instance
    if (mapInstanceRef.current) {
      mapInstanceRef.current.remove();
      mapInstanceRef.current = null;
    }

    // Create map
    const map = L.map(mapRef.current, {
      center: [lat, lon],
      zoom: 10,
      zoomControl: true,
      scrollWheelZoom: true,
      attributionControl: true,
    });

    // Dark themed tiles (CartoDB Dark Matter)
    L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png', {
      attribution: '&copy; <a href="https://carto.com/">CARTO</a> &copy; <a href="https://www.openstreetmap.org/">OSM</a>',
      subdomains: 'abcd',
      maxZoom: 19,
    }).addTo(map);

    // Weather info for the marker popup
    const current = weatherData?.current;
    const weatherInfo = current ? getWeatherInfo(current.weather_code) : null;

    // Custom weather marker
    const markerIcon = L.divIcon({
      className: 'weather-map-marker',
      html: `
        <div class="weather-map-marker__inner">
          <span class="weather-map-marker__temp">${current ? Math.round(current.temperature_2m) + '°' : '?'}</span>
          <span class="weather-map-marker__label">${location.name || ''}</span>
        </div>
      `,
      iconSize: [80, 50],
      iconAnchor: [40, 50],
    });

    const marker = L.marker([lat, lon], { icon: markerIcon }).addTo(map);

    if (current && weatherInfo) {
      marker.bindPopup(`
        <div style="text-align:center; font-family: Inter, sans-serif; min-width:140px;">
          <strong style="font-size:14px;">${location.name}</strong><br/>
          <span style="font-size:22px; font-weight:700;">${Math.round(current.temperature_2m)}°C</span><br/>
          <span style="font-size:12px; color:#666;">${weatherInfo.description}</span><br/>
          <span style="font-size:11px; color:#888;">
            💧 ${current.relative_humidity_2m}% &nbsp; 💨 ${Math.round(current.wind_speed_10m)} km/h
          </span>
        </div>
      `, { className: 'weather-popup' });
    }

    // Add circle radius for geographic context
    L.circle([lat, lon], {
      radius: 15000,
      color: 'rgba(109, 213, 237, 0.5)',
      fillColor: 'rgba(109, 213, 237, 0.08)',
      fillOpacity: 0.3,
      weight: 1,
    }).addTo(map);

    mapInstanceRef.current = map;

    // Force resize after render
    setTimeout(() => map.invalidateSize(), 200);

    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
  }, [location?.latitude, location?.longitude, weatherData]);

  if (!location?.latitude) return null;

  return (
    <section className="weather-map-section" id="weather-map">
      <h2 className="section-title">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="20" height="20">
          <polygon points="1 6 1 22 8 18 16 22 23 18 23 2 16 6 8 2 1 6" />
          <line x1="8" y1="2" x2="8" y2="18" />
          <line x1="16" y1="6" x2="16" y2="22" />
        </svg>
        Interactive Weather Map
      </h2>
      <div className="weather-map__container">
        <div ref={mapRef} className="weather-map__leaflet" />
      </div>
    </section>
  );
}
