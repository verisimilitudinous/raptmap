# This file is auto-generated from the current state of the database. Instead
# of editing this file, please use the migrations feature of Active Record to
# incrementally modify your database, and then regenerate this schema definition.
#
# Note that this schema.rb definition is the authoritative source for your
# database schema. If you need to create the application database on another
# system, you should be using db:schema:load, not running all the migrations
# from scratch. The latter is a flawed and unsustainable approach (the more migrations
# you'll amass, the slower it'll run and the greater likelihood for issues).
#
# It's strongly recommended that you check this file into your version control system.

ActiveRecord::Schema.define(version: 20170124001059) do

  # These are extensions that must be enabled in order to support this database
  enable_extension "plpgsql"
  enable_extension "pg_trgm"

  create_table "locations", force: :cascade do |t|
    t.float    "latitude"
    t.float    "longitude"
    t.string   "name"
    t.datetime "created_at",                             null: false
    t.datetime "updated_at",                             null: false
    t.float    "radius_length"
    t.string   "radius_units"
    t.float    "radius_length_in_meters"
    t.string   "uid"
    t.boolean  "active",                  default: true
    t.index ["latitude"], name: "index_locations_on_latitude", using: :btree
    t.index ["longitude"], name: "index_locations_on_longitude", using: :btree
    t.index ["uid"], name: "index_locations_on_uid", using: :btree
  end

  create_table "subscriptions", force: :cascade do |t|
    t.integer  "user_id"
    t.integer  "topic_id"
    t.integer  "location_id"
    t.datetime "created_at",                     null: false
    t.datetime "updated_at",                     null: false
    t.string   "uid"
    t.string   "mailing_uid"
    t.string   "unsubscribe_uid"
    t.boolean  "active",          default: true
    t.index ["mailing_uid"], name: "index_subscriptions_on_mailing_uid", using: :btree
    t.index ["uid"], name: "index_subscriptions_on_uid", using: :btree
    t.index ["unsubscribe_uid"], name: "index_subscriptions_on_unsubscribe_uid", using: :btree
  end

  create_table "topics", force: :cascade do |t|
    t.string   "name"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.string   "uid"
    t.index ["name"], name: "index_topics_on_name", using: :btree
    t.index ["uid"], name: "index_topics_on_uid", using: :btree
  end

  create_table "users", force: :cascade do |t|
    t.string   "email"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.string   "uid"
  end

end
