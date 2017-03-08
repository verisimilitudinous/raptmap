require 'test_helper'

class SubscriptionTest < ActiveSupport::TestCase
  # test "the truth" do
  #   assert true
  # end
  def setup
    @attrs = {
      user_attributes: {
        email: "test4@id.xjensen.com"
      },
      topic_attributes: {
        name: "Tichu"
      },
      location_attributes: {
        radius_length: 6,
        radius_units: "km",
        latitude: 37.553962,
        longitude: -122.001515,
        name: "Abbey Terrace, Fremont, CA, USA"
      }
    }
    @subscription = Subscription.new(@attrs)
  end

  test "should be valid" do
    assert @subscription.valid?
  end

  test "location latitude and longitude should be unique against user and topic" do
    @subscription.save
    attrs = @attrs.clone
    attrs[:location_attributes][:radius_length] = 7
    next_sub = Subscription.new(attrs)
    assert_not next_sub.valid?
  end

  test "user may have multiple topic subscriptions at same location" do
    @subscription.save
    attrs = @attrs.clone
    attrs[:topic_attributes][:name] = "Poker"
    next_sub = Subscription.new(attrs)
    assert next_sub.valid?
  end

  test "user may add a new subscription at same location and topic even after an unsubscribe" do
    @subscription.save
    attrs = @attrs.clone
    @subscription.safely_destroy
    next_sub = Subscription.new(attrs)
    assert next_sub.valid?
  end

  test "locations should be unique per user" do
    @subscription.save
    attrs = @attrs.clone
    attrs[:user_attributes][:email] = "test5@id.xjensen.com"
    next_sub = Subscription.new(attrs)
    next_sub.save
    assert_not_equal @subscription.location.id, next_sub.location.id
  end

  test "should associate existing topics" do
    @subscription.save
    attrs = @attrs.clone
    attrs[:user_attributes][:email] = "test5@id.xjensen.com"
    attrs[:location_attributes][:name] = "Lodi, CA, USA"
    attrs[:location_attributes][:latitude] = nil
    attrs[:location_attributes][:longitude] = nil
    next_sub = Subscription.new(attrs)
    next_sub.save
    assert_equal next_sub.topic.id, @subscription.topic.id
  end

  test "should associate existing users" do
    @subscription.save
    attrs = @attrs.clone
    attrs[:topic_attributes][:name] = "Poker"
    attrs[:location_attributes][:name] = "Lodi, CA, USA"
    attrs[:location_attributes][:latitude] = nil
    attrs[:location_attributes][:longitude] = nil
    next_sub = Subscription.new(attrs)
    next_sub.save
    assert_equal next_sub.user.id, @subscription.user.id
  end

  test "should verify uid" do
    @subscription.save
    assert @subscription.uid.present?
  end

end
