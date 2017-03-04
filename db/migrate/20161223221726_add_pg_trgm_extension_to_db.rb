class AddPgTrgmExtensionToDb < ActiveRecord::Migration[5.0]
  def change
    execute "create extension pg_trgm;"
    add_index :topics, :name
    add_index :locations, :latitude
    add_index :locations, :longitude
  end
end
