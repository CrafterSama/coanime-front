export async function getPlaceByID(placeId: string): Promise<any> {
  const url = `/api/maps/places?id=${placeId}`;

  try {
    const res = await fetch(url);
    const result = await res.json();
    return result;
  } catch (error) {
    console.error({ error: error.message });
  }
  return 0;
}
