import type {
  GeocodingResponse,
  GeocodingResult,
  OpenMeteoCurrentWeatherResponse,
} from "../types/weather";

const WEATHER_API_URL = "https://api.open-meteo.com/v1/forecast";
const GEOCODING_API_URL = "https://geocoding-api.open-meteo.com/v1/search";

export async function getCurrentWeather(
  latitude: number,
  longitude: number,
): Promise<OpenMeteoCurrentWeatherResponse> {
  const parameters = new URLSearchParams({
    latitude: latitude.toString(),
    longitude: longitude.toString(),
    timezone: "auto",

    current: [
      "temperature_2m",
      "relative_humidity_2m",
      "apparent_temperature",
      "is_day",
      "precipitation",
      "weather_code",
      "cloud_cover",
      "pressure_msl",
      "wind_speed_10m",
      "wind_direction_10m",
      "visibility",
    ].join(","),

    hourly: ["temperature_2m", "weather_code", "is_day"].join(","),

    daily: [
      "weather_code",
      "temperature_2m_max",
      "temperature_2m_min",
      "sunrise",
      "sunset",
      "uv_index_max",
      "precipitation_sum",
      "apparent_temperature_max",
      "apparent_temperature_min",
      "wind_speed_10m_max",
      "precipitation_probability_max",
    ].join(","),

    past_days: "3",
    forecast_days: "7",
  });

  const response = await fetch(`${WEATHER_API_URL}?${parameters.toString()}`);

  if (!response.ok) {
    throw new Error(
      `Unable to load weather. Request failed with status ${response.status}.`,
    );
  }

  return response.json() as Promise<OpenMeteoCurrentWeatherResponse>;
}

export async function searchLocation(
  searchTerm: string,
): Promise<GeocodingResult> {
  const parameters = new URLSearchParams({
    name: searchTerm,
    count: "1",
    language: "en",
    format: "json",
  });

  const response = await fetch(`${GEOCODING_API_URL}?${parameters.toString()}`);

  if (!response.ok) {
    throw new Error(
      `Unable to search for the location. Status: ${response.status}`,
    );
  }

  const data = (await response.json()) as GeocodingResponse;
  const location = data.results?.[0];

  if (!location) {
    throw new Error(`No location found for "${searchTerm}".`);
  }

  return location;
}
