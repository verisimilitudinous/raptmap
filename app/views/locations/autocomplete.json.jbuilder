json.array!(@locations) do |location|
  json.name location["properties"]["label"]
  json.latitude location["geometry"]["coordinates"][1]
  json.longitude location["geometry"]["coordinates"][0]
end
