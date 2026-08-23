// Central place to toggle from the stylized demo "pulse map" to a real
// tile-based map (Geoapify) once you're ready. See src/services/geocodeService.js
// for the matching address-search integration point.
export const REAL_MAP_ENABLED = import.meta.env.VITE_ENABLE_REAL_GEOCODING === "true" && Boolean(import.meta.env.VITE_GEOAPIFY_API_KEY);
export const GEOAPIFY_MAP_STYLE = import.meta.env.VITE_GEOAPIFY_MAP_STYLE || "osm-bright";
