import type { SavedLocation } from "../../types/SavedLocation";
import "./SavedLocations.css";

interface SavedLocationsProps {
  locations: SavedLocation[];
  onSelect: (location: SavedLocation) => void;
  onRemove: (id: string) => void;
}

export function SavedLocations({
  locations,
  onSelect,
  onRemove,
}: SavedLocationsProps) {
  if (locations.length === 0) {
    return null;
  }

  return (
    <section className="saved-locations">
      <div className="saved-locations-header">
        <h2>Saved Locations</h2>
      </div>

      <div className="saved-locations-list">
        {locations.map((location) => (
          <article className="saved-location-card" key={location.id}>
            <button
              type="button"
              className="saved-location-content"
              onClick={() => onSelect(location)}
            >
              <img src="/icons/cloudy.svg" alt="" />

              <div>
                <p className="saved-location-name">{location.name}</p>

                <p className="saved-location-temperature">
                  {Math.round(location.temperature)}°C
                </p>
              </div>
            </button>

            <button
              type="button"
              className="remove-location-button"
              onClick={() => onRemove(location.id)}
              aria-label={`Remove ${location.name}`}
            >
              ×
            </button>
          </article>
        ))}
      </div>
    </section>
  );
}
