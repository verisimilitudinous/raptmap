FactoryGirl.define do

  factory :user, class: User do
    email "default@id.xjensen.com"

    trait :test1 do
      email "test1@id.xjensen.com"
    end

    trait :test2 do
      email "test2@id.xjensen.com"
    end

    trait :test3 do
      email "test3@id.xjensen.com"
    end
  end

end
