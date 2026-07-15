import type {
  ForecastDay,
  OpenMeteoCurrentWeatherResponse,
} from "../types/weather";

export function mapDailyWeather(
  weather: OpenMeteoCurrentWeatherResponse,
): ForecastDay[] {
  const daily = weather.daily;

  return daily.time.map((date, index) => ({
    index,
    date,
    weatherCode: daily.weather_code[index],
    temperatureMax: daily.temperature_2m_max[index],
    temperatureMin: daily.temperature_2m_min[index],
    apparentTemperatureMax: daily.apparent_temperature_max[index],
    apparentTemperatureMin: daily.apparent_temperature_min[index],
    precipitationProbability: daily.precipitation_probability_max[index],
    windSpeed: daily.wind_speed_10m_max[index],
    sunrise: daily.sunrise[index],
    sunset: daily.sunset[index],
  }));
}
