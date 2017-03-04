class AddUids < ActiveRecord::Migration[5.0]
  def change
    add_column :subscriptions, :uid, :string
    add_column :users, :uid, :string
    add_column :topics, :uid, :string
    add_column :locations, :uid, :string
  end
end
