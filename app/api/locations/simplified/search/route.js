import {
  TRIPADVISOR_API_KEY,
  API_CUSTOM_LOCATION_SEARCH_URL,
  API_CUSTOM_LOCATION_PHOTOS_URL,
  APP_BASE_URL,
} from "/lib/tripadvisor-api/api-setup";
import {
  DEFAULT_LANGUAGE,
  DEFAULT_RADIUS_UNIT,
  DEFAULT_PHOTO_LIMIT,
  DEFAULT_PHOTO_OFFSET,
  DEFAULT_SEARCH_LIMIT,
} from "/lib/tripadvisor-api/constants.js";
import { isUriEncoded } from "/lib/tripadvisor-api/utility";

function validateSearchParams(searchParams) {
  // Required, but provided default value
  const key = searchParams.get("key") || TRIPADVISOR_API_KEY;
  // Required (either latLong only, searchQuery only, or both)
  const latLong = isUriEncoded(searchParams.get("searchQuery"))
    ? decodeURIComponent(searchParams.get("latLong"))
    : searchParams.get("latLong");
  const searchQuery = isUriEncoded(searchParams.get("searchQuery"))
    ? decodeURIComponent(searchParams.get("searchQuery"))
    : searchParams.get("searchQuery");

  // Optional
  const category = searchParams.get("category");
  const phone = isUriEncoded(searchParams.get("phone"))
    ? decodeURIComponent(searchParams.get("phone"))
    : searchParams.get("phone");
  const address = isUriEncoded(searchParams.get("address"))
    ? decodeURIComponent(searchParams.get("address"))
    : searchParams.get("address");
  const radius = searchParams.get("radius");
  // Optional, but provided default value
  const radiusUnit = searchParams.get("radiusUnit") || DEFAULT_RADIUS_UNIT;
  const language = searchParams.get("language") || DEFAULT_LANGUAGE;

  // Optional (photos)
  const limit = searchParams.get("limit") || DEFAULT_PHOTO_LIMIT;
  const offset = searchParams.get("offset") || DEFAULT_PHOTO_OFFSET;

  // Optional (set limit on number of results)
  const searchLimit = searchParams.get("searchLimit") || DEFAULT_SEARCH_LIMIT;

  // Check for missing API key
  if (key.length < 10) {
    return {
      query: searchParams.toString(),
      endpoint: null,
      error: "Missing .env variable: TRIPADVISOR_API_KEY",
    };
  }
  if (!latLong && !searchQuery) {
    return {
      query: searchParams.toString(),
      endpoint: null,
      error: `Please ensure that either "latLong" or "searchQuery" is set, or both.`,
    };
  }
  if (searchLimit <= 0 || isNaN(parseInt(searchLimit, 10))) {
    return {
      query: searchParams.toString(),
      endpoint: null,
      error: `Please ensure that either "searchLimit" is greater than 0 and is a number.`,
    };
  }

  // Build completed endpoint with searchParams
  if (key && (latLong || searchQuery)) {
    let completedEndpoint = "";
    const completeSearchParams = new URLSearchParams();

    // Required (key)
    if (key) completeSearchParams.append("key", key);

    // Required (either latLong only, searchQuery only, or both)
    if (searchQuery) completeSearchParams.append("searchQuery", searchQuery);
    if (latLong) completeSearchParams.append("latLong", latLong);

    // Optional
    if (category) completeSearchParams.append("category", category);
    if (phone | (phone !== "null"))
      completeSearchParams.append("phone", encodeURIComponent(phone));
    if (address | (address !== "null"))
      completeSearchParams.append("address", encodeURIComponent(address));
    if (radius) completeSearchParams.append("radius", radius);
    if (radiusUnit) completeSearchParams.append("radiusUnit", radiusUnit);
    if (language) completeSearchParams.append("language", language);

    // Optional (photos)
    if (limit) completeSearchParams.append("limit", limit);
    if (offset) completeSearchParams.append("offset", offset);

    // Optional (set limit on number of results)
    if (searchLimit) completeSearchParams.append("searchLimit", searchLimit);

    completedEndpoint = `${API_CUSTOM_LOCATION_SEARCH_URL}?${completeSearchParams.toString()}`;

    return {
      query: completeSearchParams.toString(),
      endpoint: completedEndpoint,
      searchLimit: searchLimit,
    };
  }

  return {
    query: searchParams.toString(),
    endpoint: null,
    error: "Unknown error.",
  };
}

export async function GET(req) {
  if (!APP_BASE_URL) {
    return new Response(
      JSON.stringify({
        error: `Missing .env variable NEXT_PUBLIC_BASE_URL`,
      }),
      {
        status: 400,
        headers: { "Content-Type": "application/json" },
      }
    );
  }

  const { searchParams } = new URL(req.url);
  const {
    query: completeSearchParams,
    endpoint: partialSearchEndpointURL,
    error,
    searchLimit,
  } = validateSearchParams(searchParams);

  if (error) {
    return new Response(
      JSON.stringify({
        error: `${error} | Search parameters provided: ${completeSearchParams}`,
      }),
      {
        status: 400,
        headers: { "Content-Type": "application/json" },
      }
    );
  }
  // Custom API routes
  const locationSearchEndpointURL = `${APP_BASE_URL}${partialSearchEndpointURL}`;
  const locationPhotosEndpointURL = `${APP_BASE_URL}${API_CUSTOM_LOCATION_PHOTOS_URL}?${completeSearchParams.toString()}`;

  // 1. Given a list of locationId /api/locations/search
  // 2. For each locationId does exist, retrieve photos too. /api/locations/detailed/photos
  // 3. Process both JSON into one payload.
  try {
    // 1. Given a list of locationId /api/locations/search
    const overviewResponse = await fetch(locationSearchEndpointURL);
    if (!overviewResponse.ok || overviewResponse.status !== 200) {
      return new Response(
        JSON.stringify({
          error: `Failed to fetch data from custom search route. | Search parameters provided: ${completeSearchParams} | Endpoint: ${locationSearchEndpointURL}`,
        }),
        {
          status: overviewResponse.status,
        }
      );
    }
    let SEARCH_JSON_DATA = await overviewResponse.json();
    SEARCH_JSON_DATA.data = SEARCH_JSON_DATA.data.slice(0, searchLimit);

    // 2. For each locationId does exist, retrieve photos too. /api/locations/detailed/photos
    // 3. Process both JSON into one payload.
    const LocationResultWithPhotos = await Promise.all(
      SEARCH_JSON_DATA.data.map(async (locationResult) => {
        const photosResponse = await fetch(
          `${locationPhotosEndpointURL}&locationId=${locationResult.location_id}`
        );
        if (!photosResponse.ok || photosResponse.status !== 200) {
          return {
            ...locationResult,
            photos: null,
          };
        }
        const PHOTOS_JSON_DATA = await photosResponse.json();
        return {
          ...locationResult,
          photos: PHOTOS_JSON_DATA.data || null,
        };
      })
    );

    const PAYLOAD = {
      data: LocationResultWithPhotos,
    };

    return new Response(JSON.stringify(PAYLOAD), {
      status: 200,
      headers: {
        "Content-Type": "application/json",
      },
    });
  } catch (error) {
    return new Response(
      JSON.stringify({
        error: `An server error occurred while fetching data | Search parameters provided: ${completeSearchParams} | Endpoint: ${partialSearchEndpointURL} | ${error}`,
      }),
      {
        status: 500,
      }
    );
  }
}
