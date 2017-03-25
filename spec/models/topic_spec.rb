require 'rails_helper'

RSpec.describe Topic, type: :model do

  # Define the main topic for most tests.
  let(:topic1) { FactoryGirl.build(:topic, :baseball) }

  it "validates when given valid attributes" do
    expect(topic1).to be_valid
  end

  it "needs a name" do
    topic1.name = "   "
    topic1.valid?
    expect(topic1.errors.added?(:name, :blank)).to eq(true)
  end

  it "ensures names do not exceed maximum length" do
    topic1.name = "a" * 265
    topic1.valid?
    expect(topic1.check_for_error_types(:name).include?(:too_long)).to eq(true)
  end

  # Define a couple more topics for comparisons.
  let(:topic2) { FactoryGirl.create(:topic, :basketball) }
  let(:topic3) { FactoryGirl.build(:topic, :football) }

  it "ensures names are unique" do
    topic3.name = topic2.name
    topic3.valid?
    expect(topic3.check_for_error_types(:name).include?(:taken)).to eq(true)
  end
end
