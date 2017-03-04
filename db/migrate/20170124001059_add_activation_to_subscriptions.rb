class AddActivationToSubscriptions < ActiveRecord::Migration[5.0]
  def change
    add_column :subscriptions, :active, :boolean, default: true
    add_column :locations, :active, :boolean, default: true
  end
end
