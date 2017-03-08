require 'test_helper'

class TopicsControllerTest < ActionDispatch::IntegrationTest
  test "should get autocomplete" do
    get autocomplete_topics_url, params: {query: "Baseball"}, xhr: true
    assert_response :success
  end
end
