// Geocoding / address-search service.
//
// Structured so a real Geoapify integration can be dropped in later
// without touching any calling code:
//   1. Set VITE_GEOAPIFY_API_KEY in your .env
//   2. Set VITE_ENABLE_REAL_GEOCODING=true
//   3. searchAddress() will then call the Geoapify Autocomplete API
//      instead of returning demo suggestions.
//
// Docs: https://apidocs.geoapify.com/docs/geocoding/address-autocomplete/

const GEOAPIFY_API_KEY = import.meta.env.VITE_GEOAPIFY_API_KEY || "";
const REAL_GEOCODING_ENABLED = import.meta.env.VITE_ENABLE_REAL_GEOCODING === "true" && Boolean(GEOAPIFY_API_KEY);

const DEMO_SUGGESTIONS = [
  { label: "Allen Avenue, Ikeja, Lagos", lat: 6.6018, lon: 3.3515 },
  { label: "Adeniran Ogunsanya St, Surulere, Lagos", lat: 6.4998, lon: 3.3542 },
  { label: "Herbert Macaulay Way, Yaba, Lagos", lat: 6.5095, lon: 3.3711 },
  { label: "Lekki Phase 1, Lagos", lat: 6.4415, lon: 3.4732 },
  { label: "Marine Beach Road, Apapa, Lagos", lat: 6.4498, lon: 3.3592 },
];

export function isRealGeocodingEnabled() {
  return REAL_GEOCODING_ENABLED;
}

export async function searchAddress(query) {
  if (!query) return [];

  if (REAL_GEOCODING_ENABLED) {
    const url = `https://api.geoapify.com/v1/geocode/autocomplete?text=${encodeURIComponent(query)}&apiKey=${GEOAPIFY_API_KEY}`;
    const res = await fetch(url);
    if (!res.ok) throw new Error("Geocoding request failed");
    const data = await res.json();
    return (data.features || []).map((f) => ({
      label: f.properties.formatted,
      lat: f.properties.lat,
      lon: f.properties.lon,
    }));
  }

  // Demo/mock behavior — no external call, no API key required.
  return DEMO_SUGGESTIONS.filter((s) => s.label.toLowerCase().includes(query.toLowerCase()));
}
