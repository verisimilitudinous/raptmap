FactoryGirl.define do

  # Transient attributes can be defined at build/create time.
  # It's optional though. For example:
  # build(:location, :fremont, radius: 6, units: "mi")
  # build(:location, :fremont)

  factory :location, class: Location do
    transient do
      radius 5
      units "km"
    end

    latitude 0
    longitude 0
    name "Default Location"
    radius_length { radius }
    radius_units { units }

    trait :fremont do
      latitude 37.51377
      longitude -121.944821
      name "Fremont, CA, USA"
    end

    trait :union_city do
      latitude 37.59577
      longitude -122.01913
      name "Union City, CA, USA"
    end

    trait :newark do
      latitude 37.520012
      longitude -122.03178
      name "Newark, CA, USA"
    end
  end

end
