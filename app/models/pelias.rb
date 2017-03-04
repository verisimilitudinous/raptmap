class Pelias

  def self.autocomplete(value)
    res = RestClient.get ENV['MAPZEN_API_URL'], { params: { api_key: ENV['MAPZEN_API_KEY'], text: value }, accept: :json }
    sleep 0.2
    parsed = JSON.parse(res.body)
    parsed["features"]
  end

end
