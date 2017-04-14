require 'rails_helper'

RSpec.describe TopicsController, type: :controller do
  describe "topics#autocomplete" do
    let(:topic1) { FactoryGirl.build(:topic, :baseball) }

    it "submits queries with correct params to DB" do
      topic1.save
      counter = 1
      get :autocomplete, params: {query: "Baseball", counter: counter}, xhr: true
      expect(assigns(:counter)).to eq(counter)
      expect(assigns(:topics)).to be_a(ActiveRecord::Relation)
      expect(assigns(:topics)).to have_at_least(1).items
    end

  end
end
