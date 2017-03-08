require 'test_helper'

class StaticPagesControllerTest < ActionDispatch::IntegrationTest
  test "should get about page with specified locale" do
    get about_url, params: { locale: :ja }
    assert_template :ja
    assert_response :success
  end
end
