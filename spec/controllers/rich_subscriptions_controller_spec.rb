require 'rails_helper'

RSpec.describe RichSubscriptionsController, type: :controller do
  describe "rich_subscriptions#show" do
    let(:subscription1) { FactoryGirl.create(:subscription) }

    it "finds the subscription by UID" do
      get :show, params: {uid: subscription1.uid}
      expect(assigns(:subscription)).to be_a(Subscription)
    end
  end
  
end