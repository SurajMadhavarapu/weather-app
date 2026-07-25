/**
 * Ollama AI Chat Service
 * Connects to local Ollama instance for AI-powered weather travel assistant.
 * Uses Vite proxy (/ollama) in dev to avoid CORS; direct URL in production.
 */

const OLLAMA_URL = import.meta.env.DEV ? '/ollama' : 'http://localhost:11434';

/**
 * Check if Ollama is running and accessible
 */
export async function checkOllamaStatus() {
  try {
    const res = await fetch(`${OLLAMA_URL}/api/tags`, { signal: AbortSignal.timeout(3000) });
    if (!res.ok) return { available: false };
    const data = await res.json();
    const models = data.models || [];
    return {
      available: true,
      models: models.map((m) => m.name),
      defaultModel: models.length > 0 ? models[0].name : null,
    };
  } catch {
    return { available: false };
  }
}

/**
 * Build a rich system prompt with live weather context
 */
function buildSystemPrompt(weatherData, location, airQuality) {
  const current = weatherData?.current;
  const daily = weatherData?.daily;
  if (!current) return 'You are SkyCast AI, a helpful weather travel assistant.';

  const todayDaily = daily ? {
    high: daily.temperature_2m_max?.[0],
    low: daily.temperature_2m_min?.[0],
    precipProb: daily.precipitation_probability_max?.[0],
    uvMax: daily.uv_index_max?.[0],
    windMax: daily.wind_speed_10m_max?.[0],
  } : {};

  // Build 5-day forecast summary
  let forecastSummary = '';
  if (daily?.time) {
    forecastSummary = daily.time.slice(0, 6).map((date, i) => {
      return `${date}: High ${daily.temperature_2m_max[i]}°C / Low ${daily.temperature_2m_min[i]}°C, Rain ${daily.precipitation_probability_max[i]}%, UV ${daily.uv_index_max[i]}`;
    }).join('\n');
  }

  const aqiInfo = airQuality?.us_aqi != null
    ? `Air Quality: US AQI ${Math.round(airQuality.us_aqi)}, PM2.5: ${airQuality.pm2_5} μg/m³, PM10: ${airQuality.pm10} μg/m³`
    : 'Air quality data not available.';

  return `You are SkyCast AI, a friendly and concise weather travel assistant. You have live weather data for ${location?.name || 'the searched location'}, ${location?.country || ''}.

CURRENT CONDITIONS (right now):
- Temperature: ${current.temperature_2m}°C (feels like ${current.apparent_temperature}°C)
- Weather: WMO code ${current.weather_code}, ${current.is_day ? 'Daytime' : 'Nighttime'}
- Humidity: ${current.relative_humidity_2m}%
- Wind: ${current.wind_speed_10m} km/h from ${current.wind_direction_10m}°
- UV Index: ${current.uv_index}
- Pressure: ${current.surface_pressure} hPa
- Precipitation: ${current.precipitation} mm
- Today's High: ${todayDaily.high}°C, Low: ${todayDaily.low}°C
- Today's Rain Probability: ${todayDaily.precipProb}%
- Today's Max UV: ${todayDaily.uvMax}
- Today's Max Wind: ${todayDaily.windMax} km/h

5-DAY FORECAST:
${forecastSummary}

${aqiInfo}

RULES:
- Answer travel, outfit, activity, and weather questions using the LIVE data above.
- Be concise (2-4 sentences max). Use emojis sparingly for friendliness.
- If asked about a DIFFERENT city than ${location?.name}, say you currently have data for ${location?.name} and suggest the user search for that city first.
- Always ground answers in the actual data. Never make up weather numbers.
- For outfit advice, consider temp, wind, UV, and rain probability together.
- For activity advice, factor in all conditions holistically.`;
}

/**
 * Send a chat message to Ollama and stream the response
 */
export async function sendChatMessage(messages, weatherData, location, airQuality, model = 'mistral:latest', onChunk) {
  const systemPrompt = buildSystemPrompt(weatherData, location, airQuality);

  const ollamaMessages = [
    { role: 'system', content: systemPrompt },
    ...messages.map((m) => ({ role: m.role, content: m.content })),
  ];

  const res = await fetch(`${OLLAMA_URL}/api/chat`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      model,
      messages: ollamaMessages,
      stream: true,
      options: {
        temperature: 0.7,
        num_predict: 300,
      },
    }),
  });

  if (!res.ok) {
    throw new Error(`Ollama error: ${res.status} ${res.statusText}`);
  }

  const reader = res.body.getReader();
  const decoder = new TextDecoder();
  let fullResponse = '';

  while (true) {
    const { done, value } = await reader.read();
    if (done) break;

    const chunk = decoder.decode(value, { stream: true });
    const lines = chunk.split('\n').filter(Boolean);

    for (const line of lines) {
      try {
        const parsed = JSON.parse(line);
        if (parsed.message?.content) {
          fullResponse += parsed.message.content;
          if (onChunk) onChunk(fullResponse);
        }
      } catch {
        // skip malformed JSON lines
      }
    }
  }

  return fullResponse;
}
