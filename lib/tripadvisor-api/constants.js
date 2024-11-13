// Location search
// https://tripadvisor-content-api.readme.io/reference/searchforlocations
export const DEFAULT_SEARCH_QUERY = "Coffee Shop";
export const DEFAULT_LAT_LONG = "37.335282,-121.881252";
export const DEFAULT_RADIUS = 10;
export const DEFAULT_RADIUS_UNIT = "mi";
export const DEFAULT_SEARCH_LIMIT = 10; // Maximum of 10 results.

// Filters result set based on property type. Valid options are "hotels", "attractions", "restaurants", and "geos"
export const DEFAULT_CATEGORY = ""; // No category for now

// Location details
// https://tripadvisor-content-api.readme.io/reference/getlocationdetails
export const DEFAULT_CURRENCY = "USD";
export const DEFAULT_LANGUAGE = "en";

// Location photos
// https://tripadvisor-content-api.readme.io/reference/getlocationphotos
export const DEFAULT_PHOTO_OFFSET = 0;
export const DEFAULT_PHOTO_LIMIT = 5; // There is a limit of 5 per API terms
