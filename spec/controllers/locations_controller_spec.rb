require 'rails_helper'

RSpec.describe LocationsController, type: :controller do
  describe "locations#autocomplete" do

    it "submits queries with correct params to Pelias" do
      counter = 1
      get :autocomplete, params: {query: "Lodi, CA, USA", counter: counter}, xhr: true
      expect(assigns(:counter)).to eq(counter)
      expect(assigns(:locations)).to be_a(Array)
      expect(assigns(:locations)).to have_at_least(1).items
    end

  end
end
