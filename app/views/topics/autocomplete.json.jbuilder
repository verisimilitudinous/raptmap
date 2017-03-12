# json.array!(@topics.pluck(:name))
json.counter @counter
json.contents @topics, :name, :id
