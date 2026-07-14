import type {
  ForecastDay,
  OpenMeteoCurrentWeatherResponse,
} from "../../types/weather";
import "./CurrentWeather.css";

interface CurrentWeatherProps {
  weather: OpenMeteoCurrentWeatherResponse;
  locationName: string;
  selectedDay: ForecastDay | null;
}

function getWeatherDescription(code: number): string {
  switch (code) {
    case 0:
      return "Clear sky";

    case 1:
      return "Mainly clear";

    case 2:
      return "Partly cloudy";

    case 3:
      return "Overcast";

    case 45:
    case 48:
      return "Fog";

    case 61:
    case 63:
    case 65:
      return "Rain";

    case 80:
    case 81:
    case 82:
      return "Rain showers";

    case 95:
      return "Thunderstorm";

    default:
      return "Unknown";
  }
}

function getWeatherIcon(code: number): string {
  switch (code) {
    case 0:
      return "☀️";

    case 1:
    case 2:
      return "⛅";

    case 3:
      return "☁️";

    case 45:
    case 48:
      return "🌫️";

    case 61:
    case 63:
    case 65:
      return "🌧️";

    case 80:
    case 81:
    case 82:
      return "🌦️";

    case 95:
      return "⛈️";

    default:
      return "☀️";
  }
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

  const displayDate = selectedDay
    ? new Date(`${selectedDay.date}T12:00:00`)
    : new Date(weather.current.time);

  return (
    <section className="current-weather">
      <div className="current-weather__overlay" />

      <div className="current-weather__content">
        <div className="current-weather__summary">
          <div className="current-weather__heading">
            <h1>{locationName}</h1>

            <p>
              {displayDate.toLocaleDateString("en-US", {
                weekday: "long",
                month: "long",
                day: "numeric",
              })}

              {!selectedDay &&
                ` · ${displayDate.toLocaleTimeString("en-US", {
                  hour: "numeric",
                  minute: "2-digit",
                })}`}
            </p>
          </div>

          <div className="current-weather__temperature-row">
            <span
              className="current-weather__icon"
              role="img"
              aria-label={getWeatherDescription(weatherCode)}
            >
              {getWeatherIcon(weatherCode)}
            </span>

            <p className="current-weather__temperature">
              {Math.round(temperature)}
              <span>°C</span>
            </p>
          </div>

          <div className="current-weather__condition">
            <h2>{getWeatherDescription(weatherCode)}</h2>

            <p>
              Feels like {Math.round(feelsLike)}°C
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

          {selectedDay && (
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
          )}

          {!selectedDay && (
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
function formatTime(value: string): string {
  return new Date(value).toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
  });
}
