export interface ReverseGeocodingResponse {
  address?: {
    city?: string;
    town?: string;
    village?: string;
    suburb?: string;
    municipality?: string;
    state?: string;
    country?: string;
  };
}
