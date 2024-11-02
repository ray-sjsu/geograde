import {
  TRIPADVISOR_API_KEY,
  API_LOCATION_SEARCH_GEOCODE_URL,
  API_LOCATION_SEARCH_KEYWORD_URL,
  TRIPADVISOR_API_OPTIONS,
} from "@/lib/tripadvisor-api/api-setup";

function validateSearchParams(searchParams) {
  // Required, but provided default value
  const key = searchParams.get("key") || TRIPADVISOR_API_KEY;
  // Required (either latLong only, searchQuery only, or both)
  const latLong = searchParams.get("latLong");
  const searchQuery = searchParams.get("searchQuery");

  // Optional
  const category = searchParams.get("category");
  const phone = searchParams.get("phone");
  const address = searchParams.get("address");
  const radius = searchParams.get("radius");
  // Optional, but provided default value
  const radiusUnit = searchParams.get("radiusUnit") || "mi";
  const language = searchParams.get("language") || "en";

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

  // Build completed endpoint with searchParams
  if (key && (latLong || searchQuery)) {
    let completedEndpoint = "";
    const completeSearchParams = new URLSearchParams();

    // Required (key)
    if (key) completeSearchParams.append("key", key);

    // Required (either latLong only, searchQuery only, or both)
    if (searchQuery)
      completeSearchParams.append(
        "searchQuery",
        encodeURIComponent(searchQuery)
      );
    if (latLong)
      completeSearchParams.append("latLong", encodeURIComponent(latLong));

    // Optional
    if (category) completeSearchParams.append("category", category);
    if (phone) completeSearchParams.append("phone", phone);
    if (address) completeSearchParams.append("address", address);
    if (radius) completeSearchParams.append("radius", radius);
    if (radiusUnit) completeSearchParams.append("radiusUnit", radiusUnit);
    if (language) completeSearchParams.append("language", language);

    if ((searchQuery && latLong) || (searchQuery && !latLong)) {
      completedEndpoint = `${API_LOCATION_SEARCH_KEYWORD_URL}?${completeSearchParams.toString()}`;
    } else if (latLong) {
      completedEndpoint = `${API_LOCATION_SEARCH_GEOCODE_URL}?${completeSearchParams.toString()}`;
    }

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
          error: `Failed to fetch data from tripadvisor API. Invalid key or wrong user input? | Search parameters provided: ${givenSearchParams} | Endpoint: ${completeEndpointURL}`,
        }),
        {
          status: response.status,
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