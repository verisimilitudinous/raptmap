require 'rails_helper'

RSpec.describe LocationsController, type: :controller do
  describe "GET autocomplete" do

    it "returns json" do
      get :autocomplete, params: {query: "Lodi, CA, USA", counter: 1}, xhr: true
      expect(response.header['Content-Type'].include?('json')).to eq(true)
    end

  end
end
