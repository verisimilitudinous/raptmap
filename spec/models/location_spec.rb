require 'rails_helper'

RSpec.describe Location, type: :model do
  
  # Define the main location for most tests.
  let(:location1) { FactoryGirl.build(:location_1) }
  
  it "validates when given valid attributes" do
    expect(location1).to be_valid
  end
  
  it "reverse-geocodes the coordinates based upon location name" do
    location1.latitude = nil
    location1.longitude = nil
    location1.valid?
    expect(location1.latitude).to be_a(Float)
    expect(location1.longitude).to be_a(Float)
  end
  
  it "geocodes the location name based upon coordinates" do
    location1.name = nil
    location1.valid?
    expect(location1.name).to be_a(String)
  end
  
  it "generates the UID upon save" do
    location1.save
    expect(location1.uid).to be_truthy
  end
  
  it "geolocates the coordinates based upon IP" do
    location1.by_ip("1.2.3.4", :en)
    expect(location1.latitude).to be_a(Float)
    expect(location1.longitude).to be_a(Float)
  end
  
  it "supplies default coordinates based upon locale" do
    location1.by_ip("0.0.0.0", :en)
    expect(location1.latitude).to be_a(Float)
    expect(location1.longitude).to be_a(Float)
  end
  
  it "needs a name or coordinates" do
    location1.latitude = nil
    location1.longitude = nil
    location1.name = nil
    location1.valid?
    expect(location1.errors.added?(:name, :blank)).to eq(true)
  end
  
  it "ensures a valid name" do 
    location1.latitude = nil
    location1.longitude = nil
    location1.name = "%"
    location1.valid?
    expect(location1.errors.added?(:name, :placeless)).to eq(true)
  end 
  
  it "needs a radius" do 
    location1.radius_length = ""
    location1.valid?
    expect(location1.errors.added?(:radius_length, :blank)).to eq(true)
    expect(location1.errors[:radius_length]).to have(1).items
  end 
  
  it "ensures a numerical radius" do 
    location1.radius_length = "sup"
    location1.valid?
    expect(location1.errors.added?(:radius_length, :not_a_number)).to eq(true)
    expect(location1.errors[:radius_length]).to have(1).items
  end 
  
end
