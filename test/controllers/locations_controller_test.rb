require 'test_helper'

class LocationsControllerTest < ActionDispatch::IntegrationTest
  test "should get autocomplete" do
    get autocomplete_locations_url, params: {query: "Lodi, CA, USA"}, xhr: true
    assert_response :success
  end
end
