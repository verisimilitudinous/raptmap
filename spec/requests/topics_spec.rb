require 'rails_helper'

RSpec.describe "Topics", type: :request do
  describe "GET autocomplete" do

    it "returns json" do
      get autocomplete_topics_path(query: "Baseball", counter: 1)
      expect(response).to have_http_status(200)
      expect(response.content_type).to eq("application/json")
    end

  end
end
