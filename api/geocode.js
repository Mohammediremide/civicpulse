import { sendError } from './_lib/auth.js'

const GEOAPIFY_KEY = process.env.GEOAPIFY_API_KEY

export default async function handler(req, res) {
  if (req.method !== 'GET') return sendError(res, 405, 'Method not allowed')
  if (!GEOAPIFY_KEY) return sendError(res, 500, 'Geoapify is not configured on the server.')

  const { q } = req.query
  if (!q || q.trim().length < 3) return res.status(200).json({ results: [] })

  try {
    const url = new URL('https://api.geoapify.com/v1/geocode/autocomplete')
    url.searchParams.set('text', q)
    url.searchParams.set('filter', 'countrycode:ng')
    url.searchParams.set('limit', '6')
    url.searchParams.set('apiKey', GEOAPIFY_KEY)

    const geoRes = await fetch(url)
    if (!geoRes.ok) return sendError(res, 502, 'Geoapify lookup failed.')
    const data = await geoRes.json()

    const results = (data.features || []).map((f) => ({
      formatted: f.properties.formatted,
      address: f.properties.address_line1 || f.properties.street || f.properties.formatted,
      city: f.properties.city || f.properties.county || '',
      state: f.properties.state || '',
      country: f.properties.country || 'Nigeria',
      lat: f.properties.lat,
      lng: f.properties.lon,
    }))

    return res.status(200).json({ results })
  } catch (err) {
    console.error('geocode error', err)
    return sendError(res, 500, 'Unable to look up that address.')
  }
}
