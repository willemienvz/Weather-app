export function formatLocationName(location: {
  name: string;
  admin1?: string;
  country?: string;
}): string {
  return [location.name, location.admin1, location.country]
    .filter(Boolean)
    .join(", ");
}
