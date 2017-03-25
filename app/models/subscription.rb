class Subscription < ApplicationRecord
  belongs_to :location, dependent: :destroy
  belongs_to :topic
  belongs_to :user
  accepts_nested_attributes_for :location, :topic, :user
  validates_associated :location, :topic, :user
  before_validation do
    find_and_validate_associated_records
  end
  after_validation do
    self.errors.delete(:location)
    self.errors.delete(:user)
    self.errors.delete(:topic)
  end
  before_create do
    generate_uids
    activate
  end

  def activate
    self.active = true
    self.location.active = true
  end

  def safely_destroy
    self.location.active = false
    self.active = false
    self.user.destroy if self.user.subscriptions.count.zero?
    return true if self.save and self.location.save
  end

  def generate_uids
    self.uid = generate_code(7)
    self.mailing_uid = generate_code(7)
    self.unsubscribe_uid = generate_code(20)
  end

  def find_nearby_posters
    # Temporary. Replace.
    self.location.geocode_as_needed
    find_topic if self.topic.id.nil?
    unless self.topic.id.nil?
      locations = self.location.find_nearby_locations.map do |location|
        location.id if location and location.active
      end
      Subscription.where(location_id: locations, topic_id: self.topic.id)
    else
      []
    end
  end

  def find_nearby_listeners
    # Temporary. Garbage! Replace.
    self.location.geocode_as_needed
    find_topic if self.topic.id.nil?
    unless self.topic.id.nil?
      locations = self.location.find_nearby_coverages.map do |location|
        location.id if location and location.active
      end
      Subscription.where(location_id: locations, topic_id: self.topic.id)
    else
      []
    end
  end

  def nearby_posters
    # Replacement for find_nearby_posters
    # Far more efficient query
    self.location.geocode_as_needed
    find_topic if self.topic.id.nil?
    unless self.topic.id.nil?
      Subscription.where(location_id: self.location.nearbys(location.radius_in_miles,
                                                            select: "id",
                                                            select_distance: false,
                                                            select_bearing: false),
                         topic_id: self.topic.id,
                         active: true)
    else
      []
    end
  end

  def nearby_listeners
    # Replacement for find_nearby_listeners
    # Need to dive deep into ActiveRecord to figure this out
    self.location.geocode_as_needed
    find_topic if self.topic.id.nil?
    unless self.topic.id.nil?
      []
    else
      []
    end
  end

  def find_topic
    if self.topic_id.nil? and self.topic.name.present?
      # The arel_table lets us search case insensitive.
      self.topic = Topic.where(Topic.arel_table[:name].matches(self.topic.name)).first_or_initialize(name: self.topic.name)
    end
  end

  def find_and_validate_associated_records
    if self.user_id.nil? and self.user.email.present?
      # First, check to see if this user already exists.
      user_query = User.where(email: self.user.email)
      if user_query.present?
        # Since the user already exists, associate it with this new subscription.
        self.user = user_query.first
        if self.topic_id.nil? and self.topic.name.present?
          # Next, check to see if this topic already exists.
          topic_query = Topic.where(Topic.arel_table[:name].matches(self.topic.name))
          if topic_query.present?
            # Like with the user, associate the existing topic with this new subscription.
            self.topic = topic_query.first
            # We now know that this user is already subscribed to this topic.
            # It's okay to be subscribed in multiple locations, but we want to make sure this isn't a dupe.
            self.location.geocode_as_needed
            location_query = Location.joins(subscription: [:topic, :user])
                                     .where(subscriptions: {active: true},
                                            topics: {name: self.topic.name},
                                            locations: {latitude: self.location.latitude,
                                                        longitude: self.location.longitude},
                                            users: {email: self.user.email})
            if location_query.present?
              # User already has a subscription to this topic at this location.
              # This is no good so we need to add some errors.
              if self.location.radius_units.present? and self.location.radius_length.present?
                if location_query.first.radius_length_in_meters == self.location.radius_in_meters
                  errors.add(:location_id, :taken_with_exact_radius)
                else
                  errors.add(:location_id, :taken_with_new_radius)
                end
              end
            else
              # Existing topic, new location.
              # Topic was already associated to the subscription previously, so nothing to do here.
              # Let everything pass through.
            end
          else
            # New topic, new location.
            # Nothing to do here, let everything pass through.
          end
        end
      else
        # New user.
        # Associate existing topic and let the location be unique.
        find_topic
      end
    end
  end

end
