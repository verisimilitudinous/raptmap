require 'test_helper'

class CancellationsControllerTest < ActionDispatch::IntegrationTest
  test "should get new" do
    get unsubscribe_url
    assert_response :success
  end

  test "can create cancellation" do
    get unsubscribe_url, params: { locale: :en }
    assert_response :success
    # Use Nokogiri to grab the CSRF token from the response.
    csrf = Nokogiri::HTML(response.body).css("meta[name=csrf-token]").first["content"]
    post unsubscribe_url, params: { user: { email: "jon@gmail.com" }, authenticity_token: csrf }
    assert_response :redirect
    follow_redirect!
    assert_response :success
    assert_select "h2", "Almost Unsubscribed"
  end

  test "can destroy" do
    get unsubscriber_url(unsubscribe_uid: "1234567"), params: { locale: :en }
    assert_response :redirect
    follow_redirect!
    assert_response :success
    assert_select "div.alert", "You are now unsubscribed."
  end
end
