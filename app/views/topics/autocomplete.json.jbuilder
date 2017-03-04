# json.array!(@topics.pluck(:name))
json.array!(@topics) do |topic|
  json.name topic.name
  json.id topic.id
end
