import { TRIPADVISOR_API_KEY, TRIPADVISOR_API_OPTIONS } from "/lib/tripadvisor-api/api-setup";

export default async function handler(req, res) {
  const { location_id } = req.query;

  try {
    const response = await fetch(`https://api.tripadvisor.com/api/locations/${location_id}`, {
      headers: {
        Authorization: `Bearer ${TRIPADVISOR_API_KEY}`,
        ...TRIPADVISOR_API_OPTIONS,
      },
    });
    const data = await response.json();
    res.status(200).json(data);
  } catch (error) {
    console.error("Error fetching location data:", error);
    res.status(500).json({ error: "Failed to fetch location data" });
  }
}
