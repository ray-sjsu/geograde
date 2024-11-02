// Location search
export const API_LOCATION_SEARCH_GEOCODE_URL =
  "https://api.content.tripadvisor.com/api/v1/location/nearby_search";
export const API_LOCATION_SEARCH_KEYWORD_URL =
  "https://api.content.tripadvisor.com/api/v1/location/search";

// Location details
export const API_LOCATION_DETAILS_OVERVIEW_URL =
  "https://api.content.tripadvisor.com/api/v1/location/{locationId}/details";
export const API_LOCATION_DETAILS_PHOTOS_URL =
  "https://api.content.tripadvisor.com/api/v1/location/{locationId}/photos";

// Custom routes
export const API_CUSTOM_LOCATION_OVERVIEW_URL =
  "/api/locations/detailed/overview";
export const API_CUSTOM_LOCATION_PHOTOS_URL = "/api/locations/detailed/photos";
export const APP_BASE_URL = process.env.NEXT_PUBLIC_BASE_URL;

// Tripadvisor API
export const TRIPADVISOR_API_KEY = process.env.TRIPADVISOR_API_KEY;
export const TRIPADVISOR_API_OPTIONS = {
  method: "GET",
  headers: {
    accept: "application/json",
  },
  cache: "no-store",
};
