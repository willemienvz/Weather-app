import "./Header.css";

interface HeaderProps {
  onSearch: (location: string) => void;
  onUseLocation: () => void;
}

export function Header({ onSearch, onUseLocation }: HeaderProps) {
  const handleSearch = (formData: FormData) => {
    const location = formData.get("location");

    if (typeof location !== "string") {
      return;
    }

    const trimmedLocation = location.trim();

    if (!trimmedLocation) {
      return;
    }

    onSearch(trimmedLocation);
  };

  return (
    <header className="header">
      <div className="header-logo">
        <img src="/icons/cloudy.svg" alt="logo" />
        <p className="logo-text">WeatherApp</p>
      </div>

      <form className="search" action={handleSearch}>
        <input
          id="location-search"
          name="location"
          type="search"
          placeholder="Search for a city..."
          autoComplete="off"
          required
          className="input-primary"
        />

        <button type="submit" className="primary-button-icon">
          <img src="/icons/search.svg" alt="search" />
        </button>
      </form>

      <button type="button" className="location-button" onClick={onUseLocation}>
        <img src="/icons/location.svg" alt="location" />
        <span>Use my location</span>
      </button>
    </header>
  );
}
