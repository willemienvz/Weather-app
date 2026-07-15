import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import type { SavedLocation } from "../../types/SavedLocation";
import { SavedLocations } from "./SavedLocations";

const mockLocations: SavedLocation[] = [
  {
    id: "1",
    name: "Centurion",
    temperature: 21.4,
    latitude: -25.86,
    longitude: 28.19,
  },
  {
    id: "2",
    name: "Cape Town",
    temperature: 18.2,
    latitude: -33.92,
    longitude: 18.42,
  },
];

describe("SavedLocations", () => {
  it("renders nothing when there are no saved locations", () => {
    const { container } = render(
      <SavedLocations locations={[]} onSelect={vi.fn()} onRemove={vi.fn()} />,
    );

    expect(container).toBeEmptyDOMElement();
  });

  it("renders the saved locations heading", () => {
    render(
      <SavedLocations
        locations={mockLocations}
        onSelect={vi.fn()}
        onRemove={vi.fn()}
      />,
    );

    expect(
      screen.getByRole("heading", {
        level: 2,
        name: "Saved Locations",
      }),
    ).toBeInTheDocument();
  });

  it("renders all saved locations", () => {
    render(
      <SavedLocations
        locations={mockLocations}
        onSelect={vi.fn()}
        onRemove={vi.fn()}
      />,
    );

    expect(screen.getByText("Centurion")).toBeInTheDocument();

    expect(screen.getByText("Cape Town")).toBeInTheDocument();
  });

  it("displays rounded temperatures", () => {
    render(
      <SavedLocations
        locations={mockLocations}
        onSelect={vi.fn()}
        onRemove={vi.fn()}
      />,
    );

    expect(screen.getByText("21°C")).toBeInTheDocument();

    expect(screen.getByText("18°C")).toBeInTheDocument();
  });

  it("calls onSelect when a location is clicked", async () => {
    const user = userEvent.setup();
    const onSelect = vi.fn();

    render(
      <SavedLocations
        locations={mockLocations}
        onSelect={onSelect}
        onRemove={vi.fn()}
      />,
    );

    await user.click(
      screen.getByRole("button", {
        name: /^centurion\b/i,
      }),
    );

    expect(onSelect).toHaveBeenCalledTimes(1);

    expect(onSelect).toHaveBeenCalledWith(mockLocations[0]);
  });

  it("calls onRemove when remove button is clicked", async () => {
    const user = userEvent.setup();
    const onRemove = vi.fn();

    render(
      <SavedLocations
        locations={mockLocations}
        onSelect={vi.fn()}
        onRemove={onRemove}
      />,
    );

    await user.click(
      screen.getByRole("button", {
        name: "Remove Centurion",
      }),
    );

    expect(onRemove).toHaveBeenCalledTimes(1);

    expect(onRemove).toHaveBeenCalledWith("1");
  });

  it("renders a remove button for each location", () => {
    render(
      <SavedLocations
        locations={mockLocations}
        onSelect={vi.fn()}
        onRemove={vi.fn()}
      />,
    );

    expect(
      screen.getByRole("button", {
        name: "Remove Centurion",
      }),
    ).toBeInTheDocument();

    expect(
      screen.getByRole("button", {
        name: "Remove Cape Town",
      }),
    ).toBeInTheDocument();
  });

  it("renders the weather icon for each location", () => {
    const { container } = render(
      <SavedLocations
        locations={mockLocations}
        onSelect={vi.fn()}
        onRemove={vi.fn()}
      />,
    );

    const icons = container.querySelectorAll('img[src="/icons/cloudy.svg"]');

    expect(icons).toHaveLength(2);
  });
});
