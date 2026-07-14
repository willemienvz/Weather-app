export interface OpenMeteoCurrentWeatherResponse {
  latitude: number;
  longitude: number;
  generationtime_ms: number;
  utc_offset_seconds: number;
  timezone: string;
  timezone_abbreviation: string;
  elevation: number;

  current_units: CurrentWeatherUnits;
  current: CurrentWeather;

  hourly_units: HourlyWeatherUnits;
  hourly: HourlyWeather;

  daily_units: DailyWeatherUnits;
  daily: DailyWeather;
}

export interface CurrentWeatherUnits {
  time: string;
  interval: string;
  temperature_2m: string;
  relative_humidity_2m: string;
  apparent_temperature: string;
  is_day: string;
  precipitation: string;
  weather_code: string;
  cloud_cover: string;
  pressure_msl: string;
  wind_speed_10m: string;
  wind_direction_10m: string;
  visibility: string;
}

export interface CurrentWeather {
  time: string;
  interval: number;
  temperature_2m: number;
  relative_humidity_2m: number;
  apparent_temperature: number;
  is_day: number;
  precipitation: number;
  weather_code: number;
  cloud_cover: number;
  pressure_msl: number;
  wind_speed_10m: number;
  wind_direction_10m: number;
  visibility: number;
}

export interface DailyWeatherUnits {
  time: string;
  weather_code: string;
  temperature_2m_max: string;
  temperature_2m_min: string;
  sunrise: string;
  sunset: string;
  uv_index_max: string;
  precipitation_sum: string;
}

export interface DailyWeather {
  time: string[];
  weather_code: number[];
  temperature_2m_max: number[];
  temperature_2m_min: number[];
  sunrise: string[];
  sunset: string[];
  uv_index_max: number[];
  precipitation_sum: number[];
  apparent_temperature_max: number[];
  apparent_temperature_min: number[];
  wind_speed_10m_max: number[];
  precipitation_probability_max: number[];
}

export interface HourlyWeatherUnits {
  time: string;
  temperature_2m: string;
  weather_code: string;
  is_day: string;
}

export interface HourlyWeather {
  time: string[];
  temperature_2m: number[];
  weather_code: number[];
  is_day: number[];
}

export interface GeocodingResponse {
  results?: GeocodingResult[];
  generationtime_ms: number;
}

export interface GeocodingResult {
  id: number;
  name: string;
  latitude: number;
  longitude: number;
  elevation?: number;
  feature_code: string;
  country_code: string;
  admin1?: string;
  timezone: string;
  population?: number;
  country?: string;
}

export interface ForecastDay {
  index: number;
  date: string;
  weatherCode: number;
  temperatureMax: number;
  temperatureMin: number;
  apparentTemperatureMax: number;
  apparentTemperatureMin: number;
  precipitationProbability: number;
  windSpeed: number;
  sunrise: string;
  sunset: string;
}
