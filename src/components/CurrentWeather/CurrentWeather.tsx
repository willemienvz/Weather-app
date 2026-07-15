import type {
  ForecastDay,
  OpenMeteoCurrentWeatherResponse,
} from "../../types/weather";
import {
  formatDateOnly,
  formatDateTime,
  formatTime,
} from "../../utils/dateFormatters";
import { getWeatherCondition } from "../../utils/weatherConditions";
import "./CurrentWeather.css";

interface CurrentWeatherProps {
  weather: OpenMeteoCurrentWeatherResponse;
  locationName: string;
  selectedDay: ForecastDay | null;
}

export function CurrentWeather({
  locationName,
  weather,
  selectedDay,
}: CurrentWeatherProps) {
  const weatherCode = selectedDay?.weatherCode ?? weather.current.weather_code;

  const temperature =
    selectedDay?.temperatureMax ?? weather.current.temperature_2m;

  const feelsLike =
    selectedDay?.apparentTemperatureMax ?? weather.current.apparent_temperature;

  const windSpeed = selectedDay?.windSpeed ?? weather.current.wind_speed_10m;

  const condition = getWeatherCondition(weatherCode);

  const displayDate = selectedDay
    ? formatDateOnly(selectedDay.date)
    : formatDateTime(weather.current.time);

  const displayTime = selectedDay ? null : formatTime(weather.current.time);

  return (
    <section className="current-weather">
      <div className="current-weather__overlay" aria-hidden="true" />

      <div className="current-weather__content">
        <div className="current-weather__summary">
          <div className="current-weather__heading">
            <h1>{locationName}</h1>

            <p>
              {displayDate}
              {displayTime && ` · ${displayTime}`}
            </p>
          </div>

          <div className="current-weather__temperature-row">
            <span
              className="current-weather__icon"
              role="img"
              aria-label={condition.description}
            >
              {condition.icon}
            </span>

            <p className="current-weather__temperature">
              {Math.round(temperature)}
              <span>°C</span>
            </p>
          </div>

          <div className="current-weather__condition">
            <h2>{condition.description}</h2>

            <p>
              {selectedDay ? "Feels like up to" : "Feels like"}{" "}
              {Math.round(feelsLike)}°C
              {selectedDay &&
                ` · Low ${Math.round(selectedDay.temperatureMin)}°C`}
            </p>
          </div>
        </div>

        <dl className="current-weather__details">
          {selectedDay && (
            <div className="current-weather__detail">
              <dt>
                <span aria-hidden="true">🌧️</span>
                Rain chance
              </dt>

              <dd>{selectedDay.precipitationProbability}%</dd>
            </div>
          )}

          <div className="current-weather__detail">
            <dt>
              <span aria-hidden="true">💨</span>
              Wind
            </dt>

            <dd>{Math.round(windSpeed)} km/h</dd>
          </div>

          {selectedDay ? (
            <>
              <div className="current-weather__detail">
                <dt>
                  <span aria-hidden="true">🌅</span>
                  Sunrise
                </dt>

                <dd>{formatTime(selectedDay.sunrise)}</dd>
              </div>

              <div className="current-weather__detail">
                <dt>
                  <span aria-hidden="true">🌇</span>
                  Sunset
                </dt>

                <dd>{formatTime(selectedDay.sunset)}</dd>
              </div>
            </>
          ) : (
            <>
              <div className="current-weather__detail">
                <dt>
                  <span aria-hidden="true">💧</span>
                  Humidity
                </dt>

                <dd>{weather.current.relative_humidity_2m}%</dd>
              </div>

              <div className="current-weather__detail">
                <dt>
                  <span aria-hidden="true">👁️</span>
                  Visibility
                </dt>

                <dd>{(weather.current.visibility / 1000).toFixed(1)} km</dd>
              </div>

              <div className="current-weather__detail">
                <dt>
                  <span aria-hidden="true">🧭</span>
                  Pressure
                </dt>

                <dd>{Math.round(weather.current.pressure_msl)} hPa</dd>
              </div>
            </>
          )}
        </dl>
      </div>
    </section>
  );
}
