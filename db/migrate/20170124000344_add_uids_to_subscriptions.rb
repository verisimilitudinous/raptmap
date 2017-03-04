class AddUidsToSubscriptions < ActiveRecord::Migration[5.0]
  def change
    add_column :subscriptions, :mailing_uid, :string
    add_column :subscriptions, :unsubscribe_uid, :string
    add_index :subscriptions, :uid
    add_index :subscriptions, :mailing_uid
    add_index :subscriptions, :unsubscribe_uid
    add_index :topics, :uid
    add_index :locations, :uid
  end
end
