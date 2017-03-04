Geocoder.configure(
  mapzen: {
    lookup: :mapzen,
    api_key: ENV['MAPZEN_API_KEY'],
    distances: :spherical
  }
)
