FactoryGirl.define do

  factory :topic, class: Topic do
    name "Default Topic Name"

    trait :baseball do
      name "Baseball"
    end

    trait :baseketball do
      name "Baseketball"
    end

    trait :basketball do
      name "Basketball"
    end

    trait :football do
      name "Football"
    end
  end

end
