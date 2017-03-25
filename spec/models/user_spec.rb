require 'rails_helper'

def attrs
  {email: "test1@id.xjensen.com"}
end

RSpec.describe User, type: :model do

  # Define the main user for most tests.
  let(:user1) { FactoryGirl.build(:user_1) }

  it "validates when given valid attributes" do
    expect(user1).to be_valid
  end

  it "needs an email address" do
    user1.email = "   "
    user1.valid?
    expect(user1.check_for_error_types(:email).include?(:blank)).to eq(true)
  end

  it "ensures email addresses do not exceed maximum length" do
    user1.email = "a" * 244 + "@example.com"
    user1.valid?
    expect(user1.check_for_error_types(:email).include?(:too_long)).to eq(true)
  end

  it "saves email addresses as lower-case" do
    mixed_case_email = "Foo@ExAMPle.CoM"
    user1.email = mixed_case_email
    user1.save
    expect(user1.email).to eq(mixed_case_email.downcase)
  end

  it "accepts well-formed email addresses" do
    valid_addresses = %w[user@example.com
                         USER@foo.COM
                         A_US-ER@foo.bar.org
                         first.last@foo.jp
                         alice+bob@baz.cn]
    valid_addresses.each do |valid_address|
      user1.email = valid_address
      expect(user1).to be_valid
    end
  end

  it "rejects bad email addresses" do
    invalid_addresses = %w[@.example.com
                           ()@foo.bar.org]
    invalid_addresses.each do |invalid_address|
      user1.email = invalid_address
      expect(user1).not_to be_valid
    end
  end

  # Define a couple more users for comparisons.
  let(:user2) { FactoryGirl.create(:user_2) }
  let(:user3) { FactoryGirl.build(:user_3) }

  it "ensures email addresses are unique" do
    user3.email = user2.email.upcase
    user3.valid?
    expect(user3.check_for_error_types(:email).include?(:taken)).to eq(true)
  end

end
