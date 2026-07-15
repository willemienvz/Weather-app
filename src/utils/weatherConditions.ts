export interface WeatherCondition {
  description: string;
  icon: string;
  nightIcon?: string;
}
const weatherConditions: Record<number, WeatherCondition> = {
  0: {
    description: "Clear sky",
    icon: "☀️",
    nightIcon: "🌙",
  },
  1: {
    description: "Mainly clear",
    icon: "🌤️",
    nightIcon: "🌙",
  },
  2: {
    description: "Partly cloudy",
    icon: "⛅",
    nightIcon: "☁️",
  },
  3: {
    description: "Overcast",
    icon: "☁️",
  },
  45: {
    description: "Fog",
    icon: "🌫️",
  },
  48: {
    description: "Depositing rime fog",
    icon: "🌫️",
  },
  51: {
    description: "Light drizzle",
    icon: "🌦️",
  },
  53: {
    description: "Drizzle",
    icon: "🌦️",
  },
  55: {
    description: "Heavy drizzle",
    icon: "🌧️",
  },
  56: {
    description: "Light freezing drizzle",
    icon: "🌧️",
  },
  57: {
    description: "Heavy freezing drizzle",
    icon: "🌧️",
  },
  61: {
    description: "Light rain",
    icon: "🌧️",
  },
  63: {
    description: "Rain",
    icon: "🌧️",
  },
  65: {
    description: "Heavy rain",
    icon: "🌧️",
  },
  66: {
    description: "Light freezing rain",
    icon: "🌧️",
  },
  67: {
    description: "Heavy freezing rain",
    icon: "🌧️",
  },
  71: {
    description: "Light snow",
    icon: "🌨️",
  },
  73: {
    description: "Snow",
    icon: "🌨️",
  },
  75: {
    description: "Heavy snow",
    icon: "❄️",
  },
  77: {
    description: "Snow grains",
    icon: "❄️",
  },
  80: {
    description: "Light rain showers",
    icon: "🌦️",
  },
  81: {
    description: "Rain showers",
    icon: "🌦️",
  },
  82: {
    description: "Heavy rain showers",
    icon: "🌧️",
  },
  85: {
    description: "Light snow showers",
    icon: "🌨️",
  },
  86: {
    description: "Heavy snow showers",
    icon: "❄️",
  },
  95: {
    description: "Thunderstorm",
    icon: "⛈️",
  },
  96: {
    description: "Thunderstorm with light hail",
    icon: "⛈️",
  },
  99: {
    description: "Thunderstorm with heavy hail",
    icon: "⛈️",
  },
};
const defaultCondition: WeatherCondition = {
  description: "Unknown conditions",
  icon: "❔",
  nightIcon: "🌙",
};

export function getWeatherCondition(code: number): WeatherCondition {
  return weatherConditions[code] ?? defaultCondition;
}

export function getWeatherIcon(code: number, isDay = true): string {
  const condition = getWeatherCondition(code);

  if (!isDay && condition.nightIcon) {
    return condition.nightIcon;
  }

  return condition.icon;
}
