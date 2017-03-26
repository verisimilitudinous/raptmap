require 'rails_helper'

RSpec.describe TopicsController, type: :controller do
  describe "GET autocomplete" do

    it "returns json" do
      get :autocomplete, params: {query: "Baseball", counter: 1}, xhr: true
      expect(response.header['Content-Type'].include?('json')).to eq(true)
    end

  end
end
