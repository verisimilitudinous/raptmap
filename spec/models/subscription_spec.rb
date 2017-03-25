require 'rails_helper'

RSpec.describe Subscription, type: :model do

  # Define the main subscription for most tests.
  let(:subscription1) { FactoryGirl.build(:subscription) }

  it "validates when given valid attributes" do
    expect(subscription1).to be_valid
  end

  # Define another subscription for comparison.
  # Use same defaults but change up the radius.
  let(:subscription2) { FactoryGirl.build(:subscription, xradius: 7) }
  # And another one with the same radius.
  let(:subscription3) { FactoryGirl.build(:subscription) }

  it "ensures location coordinates are unique per user/topic combination" do
    subscription1.save
    subscription2.valid?
    expect(subscription2.check_for_error_types(:location_id).include?(:taken_with_new_radius)).to eq(true)
    subscription3.valid?
    expect(subscription3.check_for_error_types(:location_id).include?(:taken_with_exact_radius)).to eq(true)
  end

  # Define yet another subscription for comparison.
  # Use same defaults but change up the topic this time.
  let(:subscription4) { FactoryGirl.build(:subscription, xtopic: :football) }

  it "allows a user to subscribe to multiple topics at the same location" do
    subscription1.save
    expect(subscription4).to be_valid
  end

  it "allows users to re-subscribe after un-subscribing in the past" do
    subscription1.save
    subscription1.safely_destroy
    expect(subscription2).to be_valid
  end

  # Define still another subscription for comparison.
  # Use same defaults but change up the user this time.
  let(:subscription5) { FactoryGirl.build(:subscription, xuser: :test2) }

  it "creates a unique location for each subscription" do
    subscription1.save
    subscription5.save
    expect(subscription1.location.id).not_to eq(subscription5.location.id)
  end

  it "associates pre-existing topics across subscriptions" do
    subscription1.save
    subscription5.save
    expect(subscription1.topic.id).to eq(subscription5.topic.id)
  end

  it "associates pre-existing users across subscriptions" do
    subscription1.save
    subscription4.save
    expect(subscription1.user.id).to eq(subscription4.user.id)
  end

  it "generates the UID upon save" do
    subscription1.save
    expect(subscription1.uid).to be_truthy
  end

  # Set up three more subs in close proximity to test location-based queries.
  let(:subscription6) { FactoryGirl.build(:subscription, xlocation: :fremont, xradius: 9) }
  let(:subscription7) { FactoryGirl.build(:subscription, xlocation: :union_city) }
  let(:subscription8) { FactoryGirl.build(:subscription, xlocation: :newark) }

  it "finds nearby subscriptions" do
    subscription6.save
    subscription7.save
    subscription8.save
    nearby_subs = subscription6.nearby_posters
    # Newark is closer to our Fremont location than Union City.
    # The 9 km radius should be big enough to pick up Newark,
    # but Union City is too far.
    # Therefore, we only expect one result, Newark, in nearby_subs.
    expect(nearby_subs).to have(1).items
    # Here we'll check to ensure the subscription we got does
    # indeed belong to the Newark subscription.
    expect(nearby_subs.first.id).to eq(subscription8.id)
  end

end
