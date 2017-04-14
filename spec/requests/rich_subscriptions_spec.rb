require 'rails_helper'

RSpec.describe "RichSubscriptions", type: :request do
  describe "POST create" do
    let(:location1) { FactoryGirl.build(:location, :fremont) }
    let(:topic1) { FactoryGirl.build(:topic, :baseball) }
    let(:user1) { FactoryGirl.build(:user, :test1) }

    it "returns 201 upon success" do
      get "/rich_subscriptions/new"
      csrf = Nokogiri::HTML(response.body).css("meta[name=csrf-token]").first["content"]
      headers = { "CONTENT_TYPE" => "application/json" }
      payload = { 
        subscription: {
          topic_attributes: {
            name: "Baseball"
          },
          location_attributes: {
            latitude: 37.51377,
            longitude: -121.944821,
            radius_length: 5000,
            radius_units: "m"
          },
          user_attributes: {
            email: "test1@id.xjensen.com"
          }
        }, 
        authenticity_token: csrf,
        utf8: "✓", 
        format: "json" # This format line for the benefit of RSpec.
      }.to_json
      post "/rich_subscriptions", payload, headers
      expect(response).to have_http_status(201)
      expect(response.content_type).to eq("application/json")
    end

    it "returns 422 upon failure" do
      get "/rich_subscriptions/new"
      csrf = Nokogiri::HTML(response.body).css("meta[name=csrf-token]").first["content"]
      headers = { "CONTENT_TYPE" => "application/json" }
      payload = { 
        subscription: {
          topic_attributes: {
            name: ""
          },
          location_attributes: {
            latitude: 0,
            longitude: 0,
            radius_length: 0,
            radius_units: "m"
          },
          user_attributes: {
            email: ""
          }
        }, 
        authenticity_token: csrf,
        utf8: "✓", 
        format: "json" # This format line for the benefit of RSpec.
      }.to_json
      post "/rich_subscriptions", payload, headers
      expect(response).to have_http_status(422)
      expect(response.content_type).to eq("application/json")
    end
  end
end
