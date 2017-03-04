class AddRadiusToLocation < ActiveRecord::Migration[5.0]
  def change
    add_column :locations, :radius_length, :float
    add_column :locations, :radius_units, :string
    add_column :locations, :radius_length_in_meters, :float
  end
end
