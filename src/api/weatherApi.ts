import type {
  GeocodingResponse,
  GeocodingResult,
  OpenMeteoCurrentWeatherResponse,
} from "../types/weather";
import type { ReverseGeocodingResponse } from "../types/ReverseGeocoding";
import { getCachedData, setCachedData } from "../utils/weatherCache";

const WEATHER_API_URL = "https://api.open-meteo.com/v1/forecast";
const GEOCODING_API_URL = "https://geocoding-api.open-meteo.com/v1/search";

export async function getCurrentWeather(
  latitude: number,
  longitude: number,
): Promise<OpenMeteoCurrentWeatherResponse> {
  const cacheKey = buildWeatherCacheKey(latitude, longitude);

  const cachedWeather =
    getCachedData<OpenMeteoCurrentWeatherResponse>(cacheKey);

  if (cachedWeather) {
    return cachedWeather;
  }

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

  const weather = (await response.json()) as OpenMeteoCurrentWeatherResponse;

  setCachedData(cacheKey, weather);

  return weather;
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

export async function getLocationName(
  latitude: number,
  longitude: number,
): Promise<string> {
  const params = new URLSearchParams({
    lat: latitude.toString(),
    lon: longitude.toString(),
    format: "jsonv2",
    addressdetails: "1",
  });

  const response = await fetch(
    `https://nominatim.openstreetmap.org/reverse?${params.toString()}`,
  );

  if (!response.ok) {
    throw new Error("Unable to determine your location name.");
  }

  const data = (await response.json()) as ReverseGeocodingResponse;

  const city =
    data.address?.city ??
    data.address?.town ??
    data.address?.village ??
    data.address?.suburb ??
    data.address?.municipality;

  const parts = [city, data.address?.state, data.address?.country].filter(
    Boolean,
  );

  return parts.length > 0 ? parts.join(", ") : "Current Location";
}

function buildWeatherCacheKey(latitude: number, longitude: number): string {
  return `weather:${latitude.toFixed(3)}:${longitude.toFixed(3)}`;
  //rounding was added here to avoid unnessary calls when cordinates are close to each other
}
