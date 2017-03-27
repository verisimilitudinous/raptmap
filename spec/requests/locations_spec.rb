require 'rails_helper'

RSpec.describe "Locations", type: :request do
  describe "GET autocomplete" do

    it "returns json" do
      get autocomplete_locations_path(query: "Lodi, CA, USA", counter: 1)
      expect(response).to have_http_status(200)
      expect(response.content_type).to eq("application/json")
    end

  end
end
