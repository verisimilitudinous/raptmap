FactoryGirl.define do

  factory :location_1, class: Location do
    radius_length 6
    radius_units "km"
    latitude 37.51377
    longitude -121.944821
    name "Fremont, CA, USA"
  end

  factory :location_2, class: Location do
    radius_length 5
    radius_units "km"
    latitude 37.59577
    longitude -122.01913
    name "Union City, CA, USA"
  end

  factory :location_3, class: Location do
    radius_length 5
    radius_units "km"
    latitude 37.520012
    longitude -122.03178
    name "Newark, CA, USA"
  end

end
