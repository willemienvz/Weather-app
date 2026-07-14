import type { OpenMeteoCurrentWeatherResponse } from "../../types/weather";
import "./WeatherDetails.css";

interface WeatherDetailsProps {
  weather: OpenMeteoCurrentWeatherResponse;
}

export function WeatherDetails({ weather }: WeatherDetailsProps) {
  const { current, current_units: currentUnits, daily } = weather;

  const sunrise = formatTime(daily.sunrise[0]);
  const sunset = formatTime(daily.sunset[0]);
  const uvIndex = daily.uv_index_max[0];

  return (
    <section className="details">
      <article className="detail-card detail-card--sun">
        <h3>Sunrise & Sunset</h3>

        <div className="sunset-details">
          <div className="detail">
            <img src="/icons/sunrise.svg" alt="" />

            <span>Sunrise</span>

            <p>{sunrise}</p>
          </div>

          <div className="sun-path" aria-hidden="true">
            <img src="/icons/sun.svg" alt="" />
          </div>

          <div className="detail">
            <img className="sunset-icon" src="/icons/sunrise.svg" alt="" />

            <span>Sunset</span>

            <p>{sunset}</p>
          </div>
        </div>
      </article>

      <article className="detail-card">
        <h3>UV Index</h3>

        <div className="weather-detail-value">
          <strong>{uvIndex}</strong>

          <span>{getUvLabel(uvIndex)}</span>
        </div>

        <div
          className="uv-progress"
          role="progressbar"
          aria-label="UV index"
          aria-valuemin={0}
          aria-valuemax={11}
          aria-valuenow={uvIndex}
        >
          <div
            className="uv-progress__fill"
            style={{
              width: `${Math.min((uvIndex / 11) * 100, 100)}%`,
            }}
          />
        </div>
      </article>

      <article className="detail-card">
        <h3>Precipitation</h3>

        <div className="weather-detail-value">
          <strong>{current.precipitation}</strong>

          <span>{currentUnits.precipitation}</span>
        </div>
      </article>

      <article className="detail-card">
        <h3>Humidity</h3>

        <div className="weather-detail-value">
          <strong>{current.relative_humidity_2m}</strong>

          <span>{currentUnits.relative_humidity_2m}</span>
        </div>

        <div
          className="humidity-progress"
          role="progressbar"
          aria-label="Humidity"
          aria-valuemin={0}
          aria-valuemax={100}
          aria-valuenow={current.relative_humidity_2m}
        >
          <div
            className="humidity-progress__fill"
            style={{
              width: `${current.relative_humidity_2m}%`,
            }}
          />
        </div>
      </article>
    </section>
  );
}

function formatTime(dateTime: string | undefined): string {
  if (!dateTime) {
    return "Unavailable";
  }

  const date = new Date(dateTime);

  return new Intl.DateTimeFormat("en-ZA", {
    hour: "2-digit",
    minute: "2-digit",
  }).format(date);
}

function getUvLabel(index: number): string {
  if (index < 3) {
    return "Low";
  }

  if (index < 6) {
    return "Moderate";
  }

  if (index < 8) {
    return "High";
  }

  if (index < 11) {
    return "Very high";
  }

  return "Extreme";
}
