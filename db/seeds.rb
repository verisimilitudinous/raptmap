# This file should contain all the record creation needed to seed the database with its default values.
# The data can then be loaded with the rails db:seed command (or created alongside the database with db:setup).
#
# Examples:
#
#   movies = Movie.create([{ name: 'Star Wars' }, { name: 'Lord of the Rings' }])
#   Character.create(name: 'Luke', movie: movies.first)

topics = [
  "Basketball",
  "Basket weaving",
  "Knitting",
  "Board games",
  "Tichu",
  "Mah Jong",
  "Football (American)",
  "Baseball",
  "Football (soccer)",
  "Pizza baking",
  "Bird watching",
  "Classic cars",
  "Progressive politics",
  "Web development",
  "Photography"
]

topics.each do |name|
  Topic.create( name: name )
end
