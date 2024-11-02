// Location search
export const API_LOCATION_SEARCH_GEOCODE_URL =
  "https://api.content.tripadvisor.com/api/v1/location/nearby_search";
export const API_LOCATION_SEARCH_KEYWORD_URL =
  "https://api.content.tripadvisor.com/api/v1/location/search";

// Location details
export const API_LOCATION_DETAILS_OVERVIEW_URL =
  "https://api.content.tripadvisor.com/api/v1/location/locationId/details";
export const API_LOCATION_DETAILS_PHOTOS_URL =
  "https://api.content.tripadvisor.com/api/v1/location/locationId/photos";
export const API_LOCATION_DETAILS_REVIEWS_URL =
  "https://api.content.tripadvisor.com/api/v1/location/locationId/reviews";

export const TRIPADVISOR_API_KEY = process.env.TRIPADVISOR_API_KEY;

export const TRIPADVISOR_API_OPTIONS = {
  method: "GET",
  headers: {
    accept: "application/json",
  },
  cache: "no-store",
};
