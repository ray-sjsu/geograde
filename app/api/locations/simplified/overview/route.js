// For the specific location/study spot page. Combine overview data with actual images.
// Two step process: (two api calls maximum, one minimum)
// 1. Given a locationId, find if this locationId exists. /api/locations/detailed/overview
// 2. If locationId does exist, retrieve photos too. /api/locations/detailed/photos
// 3. Process both JSON into one payload.

import {
  API_CUSTOM_LOCATION_OVERVIEW_URL,
  API_CUSTOM_LOCATION_PHOTOS_URL,
  APP_BASE_URL,
  TRIPADVISOR_API_KEY,
} from "@/lib/tripadvisor-api/api-setup";
import {
  DEFAULT_CURRENCY,
  DEFAULT_LANGUAGE,
  DEFAULT_PHOTO_LIMIT,
  DEFAULT_PHOTO_OFFSET,
} from "@/lib/tripadvisor-api/constants";

function validateLocationSearchParams(searchParams) {
  // Required, but provided default value
  const key = searchParams.get("key") || TRIPADVISOR_API_KEY;
  // Required (either latLong only, searchQuery only, or both)
  const locationId = searchParams.get("locationId");

  // Optional, but provided default value
  const language = searchParams.get("language") || DEFAULT_LANGUAGE;
  const currency = searchParams.get("currency") || DEFAULT_CURRENCY;
  const limit = searchParams.get("limit") || DEFAULT_PHOTO_LIMIT;
  const offset = searchParams.get("offset") || DEFAULT_PHOTO_OFFSET;

  // Check for missing API key
  if (key.length < 10) {
    return {
      query: searchParams.toString(),
      endpoint: null,
      error: "Missing .env variable: TRIPADVISOR_API_KEY",
    };
  }
  if (!locationId || isNaN(parseInt(locationId, 10))) {
    return {
      query: searchParams.toString(),
      endpoint: null,
      error: `Please ensure that either "locationId" is set and is a number.`,
    };
  }

  // Build completed endpoint with searchParams
  if (key && locationId) {
    let completedEndpoint = "";
    const completeSearchParams = new URLSearchParams();

    // Required (key)
    if (key) completeSearchParams.append("key", key);

    // Required
    if (locationId) completeSearchParams.append("locationId", locationId);

    // Optional
    if (currency) completeSearchParams.append("currency", currency);
    if (language) completeSearchParams.append("language", language);
    if (limit) completeSearchParams.append("limit", limit);
    if (offset) completeSearchParams.append("offset", offset);

    completedEndpoint = `${API_CUSTOM_LOCATION_OVERVIEW_URL}?${completeSearchParams.toString()}`;

    return {
      query: completeSearchParams.toString(),
      endpoint: completedEndpoint,
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
    endpoint: partialOverviewEndpointURL,
    error,
  } = validateLocationSearchParams(searchParams);

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
  // Second API route
  const locationOverviewEndpointURL = `${APP_BASE_URL}${partialOverviewEndpointURL}`;
  const locationPhotosEndpointURL = `${APP_BASE_URL}${API_CUSTOM_LOCATION_PHOTOS_URL}?${completeSearchParams.toString()}`;

  // return new Response(
  //   JSON.stringify({
  //     data: `location: ${locationOverviewEndpointURL} | photos: ${locationPhotosEndpointURL}`,
  //   }),
  //   {
  //     status: 400,
  //     headers: { "Content-Type": "application/json" },
  //   }
  // );

  // 1. Given a locationId, find if this locationId exists. /api/locations/detailed/overview
  // 2. If locationId does exist, retrieve photos too. /api/locations/detailed/photos
  // 3. Process both JSON into one payload.
  try {
    const overviewResponse = await fetch(locationOverviewEndpointURL);
    if (!overviewResponse.ok || overviewResponse.status !== 200) {
      return new Response(
        JSON.stringify({
          error: `Failed to fetch data from custom overview route. | Search parameters provided: ${completeSearchParams} | Endpoint: ${locationOverviewEndpointURL}`,
        }),
        {
          status: overviewResponse.status,
        }
      );
    }
    const OVERVIEW_JSON_DATA = await overviewResponse.json();

    // 2. If locationId does exist, retrieve photos too. /api/locations/detailed/photos
    const photosResponse = await fetch(locationPhotosEndpointURL);
    const PHOTOS_JSON_DATA = await photosResponse.json();
    if (!overviewResponse.ok || overviewResponse.status !== 200) {
      return new Response(
        JSON.stringify({
          error: `Failed to fetch data from custom photos route. | Search parameters provided: ${completeSearchParams} | Endpoint: ${locationPhotosEndpointURL}`,
        }),
        {
          status: overviewResponse.status,
        }
      );
    }

    // 3. Process both JSON into one payload.
    const PAYLOAD = {
      overview: OVERVIEW_JSON_DATA,
      photos: PHOTOS_JSON_DATA,
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
        error: `An server error occurred while fetching data | Search parameters provided: ${completeSearchParams} | Endpoint: ${partialOverviewEndpointURL} | ${error}`,
      }),
      {
        status: 500,
      }
    );
  }
}
