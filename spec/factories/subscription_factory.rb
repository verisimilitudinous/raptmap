FactoryGirl.define do

  factory :subscription, class: Subscription do
    transient do
      xtopic :baseball
      xlocation :fremont
      xradius 5
      xunits "km"
      xuser :test1
    end

    topic do
      build(:topic, xtopic)
    end
    location do
      build(:location, xlocation, radius: xradius, units: xunits)
    end
    user do
      build(:user, xuser)
    end
  end

end
