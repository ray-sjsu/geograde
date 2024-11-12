import {
  TRIPADVISOR_API_KEY,
  API_LOCATION_DETAILS_OVERVIEW_URL,
  TRIPADVISOR_API_OPTIONS,
} from "/lib/tripadvisor-api/api-setup";
import {
  DEFAULT_CURRENCY,
  DEFAULT_LANGUAGE,
} from "/lib/tripadvisor-api/constants";

function validateSearchParams(searchParams) {
  // Required, but provided default value
  const key = searchParams.get("key") || TRIPADVISOR_API_KEY;
  // Required (either latLong only, searchQuery only, or both)
  const locationId = searchParams.get("locationId");

  // Optional, but provided default value
  const currency = searchParams.get("currency") || DEFAULT_CURRENCY;
  const language = searchParams.get("language") || DEFAULT_LANGUAGE;

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
      error: `Please ensure that "locationId" is provided and is a number.`,
    };
  }

  // Build completed endpoint with searchParams
  if (key && locationId) {
    let completedEndpoint = "";
    const completeSearchParams = new URLSearchParams();

    // Required (key)
    if (key) completeSearchParams.append("key", key);

    // Required
    if (locationId)
      completedEndpoint = API_LOCATION_DETAILS_OVERVIEW_URL.replace(
        "{locationId}",
        locationId
      );

    // Optional
    if (currency) completeSearchParams.append("currency", currency);
    if (language) completeSearchParams.append("language", language);

    completedEndpoint = `${completedEndpoint}?${completeSearchParams.toString()}`;

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
  const { searchParams } = new URL(req.url);
  const {
    query: givenSearchParams,
    endpoint: completeEndpointURL,
    error,
  } = validateSearchParams(searchParams);

  if (error) {
    return new Response(
      JSON.stringify({
        error: `${error} | Search parameters provided: ${givenSearchParams}`,
      }),
      {
        status: 400,
        headers: { "Content-Type": "application/json" },
      }
    );
  }

  try {
    const response = await fetch(completeEndpointURL, TRIPADVISOR_API_OPTIONS);

    if (!response.ok) {
      return new Response(
        JSON.stringify({
          error: `Failed to fetch data from tripadvisor API. Location doesn't exist? | Search parameters provided: ${givenSearchParams} | Endpoint: ${completeEndpointURL} | Status: ${response.status}`,
        }),
        {
          status: 500,
        }
      );
    }

    const JSON_DATA = await response.json();
    return new Response(JSON.stringify(JSON_DATA), {
      status: 200,
      headers: {
        "Content-Type": "application/json",
      },
    });
  } catch (error) {
    return new Response(
      JSON.stringify({
        error: `An server error occurred while fetching data | Search parameters provided: ${givenSearchParams} | Endpoint: ${completeEndpointURL} | ${error}`,
      }),
      {
        status: 500,
      }
    );
  }
}
