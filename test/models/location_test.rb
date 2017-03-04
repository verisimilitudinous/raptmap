require 'test_helper'

class LocationTest < ActiveSupport::TestCase
  # test "the truth" do
  #   assert true
  # end

  def setup
    @attrs = {
      radius_length: 6,
      radius_units: "km",
      latitude: 37.553962,
      longitude: -122.001515,
      name: "Abbey Terrace, Fremont, CA, USA"
    }
    @location = Location.new(@attrs)
  end

  test "should be valid" do
    assert @location.valid?
  end
  
  test "should be geocoded" do
    attrs = @attrs.except(:latitude, :longitude)
    location = Location.new(attrs)
    location.save
    assert location.latitude.present? and location.longitude.present?
  end
  
  test "should be reverse geocoded" do
    attrs = @attrs.except(:name)
    location = Location.new(attrs)
    location.save
    assert location.name.present?
  end
  
  test "should have uid" do
    @location.save
    assert @location.uid.present?
  end

end
