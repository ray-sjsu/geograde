import { NextResponse } from "next/server";

const GOOGLE_PLACE_DETAILS_BASE_URL = "https://maps.googleapis.com/maps/api/place/details/json";
const GOOGLE_PLACE_KEY = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY;

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const placeId = searchParams.get("place_id");
  const fields = searchParams.get("fields");

  if (!placeId || !fields) {
    return new Response(JSON.stringify({ error: "Missing place_id or fields parameter" }), { status: 400 });
  }

  try {
    const response = await fetch(
      `${GOOGLE_PLACE_DETAILS_BASE_URL}?place_id=${placeId}&fields=${fields}&key=${GOOGLE_PLACE_KEY}`,
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    if (!response.ok) {
      return new Response(JSON.stringify({ error: "Failed to fetch Google Place details" }), { status: response.status });
    }

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), { status: 500 });
  }
}
