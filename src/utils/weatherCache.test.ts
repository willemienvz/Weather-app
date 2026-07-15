import { getCachedData, setCachedData } from "./weatherCache";

describe("weatherCache", () => {
  beforeEach(() => {
    localStorage.clear();
    vi.useRealTimers();
  });

  it("stores data in localStorage", () => {
    const weather = {
      temperature: 21,
    };

    setCachedData("weather:test", weather);

    const stored = localStorage.getItem("weather:test");

    expect(stored).toBeTruthy();
  });

  it("returns cached data when it has not expired", () => {
    const weather = {
      temperature: 21,
    };

    setCachedData("weather:test", weather);

    const result = getCachedData<typeof weather>("weather:test");

    expect(result).toEqual(weather);
  });

  it("returns null when no cache entry exists", () => {
    const result = getCachedData("does-not-exist");

    expect(result).toBeNull();
  });

  it("returns null when cached data has expired", () => {
    vi.useFakeTimers();

    const weather = {
      temperature: 21,
    };

    setCachedData("weather:test", weather);

    vi.advanceTimersByTime(10 * 60 * 1000 + 1);

    const result = getCachedData<typeof weather>("weather:test");

    expect(result).toBeNull();
  });

  it("removes expired entries from localStorage", () => {
    vi.useFakeTimers();

    const weather = {
      temperature: 21,
    };

    setCachedData("weather:test", weather);

    vi.advanceTimersByTime(10 * 60 * 1000 + 1);

    getCachedData("weather:test");

    expect(localStorage.getItem("weather:test")).toBeNull();
  });

  it("returns null for invalid cache data", () => {
    localStorage.setItem("weather:test", "invalid-json");

    const result = getCachedData("weather:test");

    expect(result).toBeNull();
  });

  it("removes invalid cache data", () => {
    localStorage.setItem("weather:test", "invalid-json");

    getCachedData("weather:test");

    expect(localStorage.getItem("weather:test")).toBeNull();
  });
});
