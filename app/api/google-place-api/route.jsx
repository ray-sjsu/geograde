import { NextResponse } from "next/server";

const BASE_URL="https://maps.googleapis.com/maps/api/place/textsearch/json?";
const GOOGLE_PLACE_KEY=process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY;

export async function GET(request) {
    const {searchParams} = new URL(request.url);
    const q = searchParams.get('q');

    const res=await fetch(
        
        BASE_URL+"query=" + q +
        "&key=" +GOOGLE_PLACE_KEY,
        {
            headers:{
                "Content-Type": "application/json"
            }
        }
    )
    const response = await res.json();

    return NextResponse.json({response})
}