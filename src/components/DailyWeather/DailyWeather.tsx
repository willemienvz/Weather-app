import { useState } from "react";
import type {
  ForecastDay,
  OpenMeteoCurrentWeatherResponse,
} from "../../types/weather";
import { parseDateOnly } from "../../utils/dateFormatters";
import { getWeatherCondition } from "../../utils/weatherConditions";
import { mapDailyWeather } from "../../utils/weatherTransformers";
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

  const allDays = mapDailyWeather(weather);

  const historyDays = allDays.slice(0, 3);
  const forecastDays = allDays.slice(3, 10);

  const displayedDays = activeTab === "forecast" ? forecastDays : historyDays;

  return (
    <section className="daily-weather">
      <div className="daily-weather__header">
        <div className="daily-weather__tabs">
          <button
            type="button"
            className={`daily-weather__tab ${
              activeTab === "forecast" ? "daily-weather__tab--active" : ""
            }`}
            aria-pressed={activeTab === "forecast"}
            onClick={() => setActiveTab("forecast")}
          >
            7-Day Forecast
          </button>

          <button
            type="button"
            className={`daily-weather__tab ${
              activeTab === "history" ? "daily-weather__tab--active" : ""
            }`}
            aria-pressed={activeTab === "history"}
            onClick={() => setActiveTab("history")}
          >
            3-Day History
          </button>
        </div>
      </div>

      <div className="daily-weather__list">
        {displayedDays.map((day) => {
          const date = parseDateOnly(day.date);
          const condition = getWeatherCondition(day.weatherCode);
          const isSelected = selectedDay?.date === day.date;

          const high = Math.round(day.temperatureMax);
          const low = Math.round(day.temperatureMin);

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
                aria-label={condition.description}
              >
                {condition.icon}
              </span>

              <span className="daily-weather__description">
                {condition.description}
              </span>

              <div
                className="daily-weather__temperatures"
                aria-label={`High ${high} degrees, low ${low} degrees`}
              >
                <span>{high}°</span>
                <span>/</span>
                <span>{low}°</span>
              </div>
            </button>
          );
        })}
      </div>
    </section>
  );
}
