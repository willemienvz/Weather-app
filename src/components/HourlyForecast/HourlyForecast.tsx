import type {
  ForecastDay,
  OpenMeteoCurrentWeatherResponse,
} from "../../types/weather";
import "./HourlyForecast.css";
import {
  getWeatherCondition,
  getWeatherIcon,
} from "../../utils/weatherConditions";

interface HourlyForecastProps {
  weather: OpenMeteoCurrentWeatherResponse;
  selectedDay: ForecastDay | null;
}

interface HourlyForecastItem {
  time: string;
  temperature: number;
  weatherCode: number;
  isDay: boolean;
}

export function HourlyForecast({ weather, selectedDay }: HourlyForecastProps) {
  const hourlyForecast = selectedDay
    ? getHoursForDay(weather, selectedDay.date)
    : getNextHours(weather, 8);

  if (hourlyForecast.length === 0) {
    return null;
  }

  return (
    <section className="hourly-forecast">
      <h2>
        {selectedDay
          ? `${formatDayTitle(selectedDay.date)} Forecast`
          : "Hourly Forecast"}
      </h2>

      <div className="hourly-forecast__list">
        {hourlyForecast.map((hour) => {
          const condition = getWeatherCondition(hour.weatherCode);
          const icon = getWeatherIcon(hour.weatherCode, hour.isDay);

          return (
            <div key={hour.time} className="hourly-forecast__item">
              <time dateTime={hour.time}>{formatHour(hour.time)}</time>

              <span
                className="hourly-forecast__icon"
                role="img"
                aria-label={condition.description}
              >
                {icon}
              </span>

              <strong>
                {Math.round(hour.temperature)}
                {weather.hourly_units.temperature_2m}
              </strong>
            </div>
          );
        })}
      </div>
    </section>
  );
}

function getHoursForDay(
  weather: OpenMeteoCurrentWeatherResponse,
  selectedDate: string,
): HourlyForecastItem[] {
  const { hourly } = weather;

  const hours = hourly.time
    .map((time, index) => ({
      time,
      temperature: hourly.temperature_2m[index],
      weatherCode: hourly.weather_code[index],
      isDay: hourly.is_day[index] === 1,
    }))
    .filter((hour) => hour.time.startsWith(selectedDate));

  const today = new Date().toISOString().split("T")[0];

  if (selectedDate === today) {
    const currentHour = new Date().getHours();

    const startIndex = hours.findIndex(
      (hour) => new Date(hour.time).getHours() >= currentHour,
    );

    return hours.slice(startIndex, startIndex + 8);
  }

  return hours
    .filter((hour) => {
      const hourOfDay = new Date(hour.time).getHours();
      return hourOfDay >= 6;
    })
    .slice(0, 8);
}

function getNextHours(
  weather: OpenMeteoCurrentWeatherResponse,
  numberOfHours: number,
): HourlyForecastItem[] {
  const { current, hourly } = weather;

  if (!hourly?.time?.length) {
    return [];
  }

  const currentTime = new Date(current.time).getTime();

  const startIndex = hourly.time.findIndex(
    (time) => new Date(time).getTime() >= currentTime,
  );

  const safeStartIndex = startIndex === -1 ? 0 : startIndex;

  return hourly.time
    .slice(safeStartIndex, safeStartIndex + numberOfHours)
    .map((time, index) => {
      const sourceIndex = safeStartIndex + index;

      return {
        time,
        temperature: hourly.temperature_2m[sourceIndex],
        weatherCode: hourly.weather_code[sourceIndex],
        isDay: hourly.is_day[sourceIndex] === 1,
      };
    });
}

function formatHour(dateTime: string): string {
  return new Intl.DateTimeFormat("en-ZA", {
    hour: "numeric",
    hour12: true,
  }).format(new Date(dateTime));
}

function formatDayTitle(date: string): string {
  return new Date(`${date}T12:00:00`).toLocaleDateString("en-ZA", {
    weekday: "long",
    month: "short",
    day: "numeric",
  });
}
