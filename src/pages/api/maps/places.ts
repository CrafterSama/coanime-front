export default async function handler(req, res) {
  if (req.method === 'GET') {
    const placeId = req.query.id;
    const url = `https://maps.googleapis.com/maps/api/place/details/json?key=${process.env.GMAPS_API_KEY}&place_id=${placeId}&fields=formatted_address,name,place_id,types,geometry,adr_address,address_components`;
    const response = await fetch(url);
    const resJson = await response.json();
    const { result = {} } = resJson;

    return res.status(200).json(result);
  }

  // Not other supported method
  res.status(405).end();
}
