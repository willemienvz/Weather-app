import { useState } from "react";
import type {
  ForecastDay,
  OpenMeteoCurrentWeatherResponse,
} from "../../types/weather";
import "./DailyWeather.css";

type WeatherTab = "forecast" | "history";

interface DailyWeatherProps {
  weather: OpenMeteoCurrentWeatherResponse;
  selectedDay: ForecastDay | null;
  onSelectDay: (day: ForecastDay) => void;
}

export function DailyWeather({
  weather,
  selectedDay,
  onSelectDay,
}: DailyWeatherProps) {
  const [activeTab, setActiveTab] = useState<WeatherTab>("forecast");

  const daily = weather.daily;

  const allDays: ForecastDay[] = daily.time.map((date, index) => ({
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

  const historyDays = allDays.slice(0, 3);
  const forecastDays = allDays.slice(3);

  const displayedDays = activeTab === "forecast" ? forecastDays : historyDays;

  return (
    <section className="daily-weather">
      <div className="daily-weather__header">
        <div
          className="daily-weather__tabs"
          role="tablist"
          aria-label="Daily weather"
        >
          <button
            type="button"
            role="tab"
            aria-selected={activeTab === "forecast"}
            className={`daily-weather__tab ${
              activeTab === "forecast" ? "daily-weather__tab--active" : ""
            }`}
            onClick={() => setActiveTab("forecast")}
          >
            7-Day Forecast
          </button>

          <button
            type="button"
            role="tab"
            aria-selected={activeTab === "history"}
            className={`daily-weather__tab ${
              activeTab === "history" ? "daily-weather__tab--active" : ""
            }`}
            onClick={() => setActiveTab("history")}
          >
            3-Day History
          </button>
        </div>
      </div>

      <div className="daily-weather__list">
        {displayedDays.map((day) => {
          const date = new Date(`${day.date}T12:00:00`);
          const isSelected = selectedDay?.date === day.date;

          return (
            <button
              type="button"
              key={day.date}
              className={`daily-weather__item ${
                isSelected ? "daily-weather__item--selected" : ""
              }`}
              onClick={() => onSelectDay(day)}
              aria-pressed={isSelected}
            >
              <div className="daily-weather__date">
                <strong>
                  {date.toLocaleDateString("en-US", {
                    weekday: "long",
                  })}
                </strong>

                <time dateTime={day.date}>
                  {date.toLocaleDateString("en-US", {
                    month: "short",
                    day: "numeric",
                  })}
                </time>
              </div>

              <span
                className="daily-weather__icon"
                role="img"
                aria-label={getWeatherDescription(day.weatherCode)}
              >
                {getWeatherIcon(day.weatherCode)}
              </span>

              <span className="daily-weather__description">
                {getWeatherDescription(day.weatherCode)}
              </span>

              <div className="daily-weather__temperatures">
                <strong>{Math.round(day.temperatureMin)}°</strong>
                <span>/</span>
                <strong>{Math.round(day.temperatureMax)}°</strong>
              </div>
            </button>
          );
        })}
      </div>
    </section>
  );
}

function getWeatherDescription(code: number): string {
  if (code === 0) return "Clear sky";
  if (code === 1) return "Mainly clear";
  if (code === 2) return "Partly cloudy";
  if (code === 3) return "Overcast";
  if ([45, 48].includes(code)) return "Fog";
  if ([51, 53, 55, 56, 57].includes(code)) return "Drizzle";
  if ([61, 63, 65, 66, 67].includes(code)) return "Rain";
  if ([71, 73, 75, 77].includes(code)) return "Snow";
  if ([80, 81, 82].includes(code)) return "Rain showers";
  if ([85, 86].includes(code)) return "Snow showers";
  if ([95, 96, 99].includes(code)) return "Thunderstorm";

  return "Unknown";
}

function getWeatherIcon(code: number): string {
  if (code === 0) return "☀️";
  if ([1, 2].includes(code)) return "🌤️";
  if (code === 3) return "☁️";
  if ([45, 48].includes(code)) return "🌫️";
  if ([51, 53, 55, 56, 57].includes(code)) return "🌦️";
  if ([61, 63, 65, 66, 67].includes(code)) return "🌧️";
  if ([71, 73, 75, 77, 85, 86].includes(code)) return "🌨️";
  if ([80, 81, 82].includes(code)) return "🌦️";
  if ([95, 96, 99].includes(code)) return "⛈️";

  return "🌤️";
}
