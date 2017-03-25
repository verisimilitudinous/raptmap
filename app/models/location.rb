class Location < ApplicationRecord
  has_one :subscription
  validates :latitude, presence: true,
                       numericality: true
  validates :longitude, presence: true,
                        numericality: true
  validates :radius_length, presence: true,
                            numericality: true
  validates :radius_units, presence: true
  geocoded_by :name
  reverse_geocoded_by :latitude, :longitude, :address => :name
  before_validation do
    geocode_as_needed
    calculate_radius_in_meters
  end
  after_validation do
    self.errors.delete(:latitude)
    self.errors.delete(:longitude)
    location_must_be_valid
  end
  before_create :generate_uid

  def generate_uid
    self.uid = generate_code(7)
  end

  def missing_coordinates?
    self.latitude.blank? or self.longitude.blank?
  end

  def geocode_as_needed
    if missing_coordinates?
      if self.name.present?
        geocode
      end
    else
      unless self.name.present?
        reverse_geocode
      end
    end
  end

  def calculate_radius_in_meters
    if self.radius_units.present? and self.radius_length.present?
      self.radius_length_in_meters = radius_in_meters
    end
  end

  def radius_in_meters
    case self.radius_units
    when "km"
      self.radius_length_in_meters = self.radius_length * 1000
    when "m"
      self.radius_length_in_meters = self.radius_length
    when "mi"
      self.radius_length_in_meters = self.radius_length * 1609.34
    when "ft"
      self.radius_length_in_meters = self.radius_length * 0.3048
    end
  end

  def radius_in_miles
    case self.radius_units
    when "km"
      self.radius_length * 0.621371
    when "m"
      self.radius_length * 0.000621371
    when "mi"
      self.radius_length
    when "ft"
      self.radius_length * 0.000189394
    end
  end

  def find_nearby_locations # posters
    nearbys(self.radius_in_miles)
  end

  def find_nearby_coverages # listeners
    nearbys(50).map do |location|
      if location.distance_to([self.latitude, self.longitude]) < location.radius_in_miles
        location
      end
    end
  end

  def user_params_entered?
    self.location.name.present? and self.location.radius_length.present? and self.location.radius_units.present?
  end

  def location_must_be_valid
    if self.latitude.blank? or self.longitude.blank?
      if self.name.blank?
        errors.add(:name, :blank)
      else
        errors.add(:name, :placeless)
      end
    end
    radius_errors = check_for_error_types(:radius_length)
    if radius_errors.any?
      if radius_errors.include?(:blank)
        errors.delete(:radius_length)
        errors.add(:radius_length, :blank)
      elsif radius_errors.include?(:not_a_number)
        errors.delete(:radius_length)
        errors.add(:radius_length, :not_a_number)
      end
    end
  end

  def by_ip(ip, locale)
    if missing_coordinates?
      res = Location.by_ip(ip, locale)
      if res
        self.latitude = res[:latitude]
        self.longitude = res[:longitude]
      end
    end
  end

  def self.by_ip(ip, locale)
    res = RestClient.get "http://geolocation:8080/json/#{ip}", { accept: :json }
    parsed = JSON.parse(res.body)
    unless parsed["latitude"].zero? and parsed["longitude"].zero?
      return { latitude: parsed["latitude"], longitude: parsed["longitude"]}
    else
      # If geolocation fails, return defaults.
      if locale == :en
        # CA state capitol for English.
        return { latitude: 38.576696, longitude: -121.493256 }
      elsif locale == :ja
        # Ueno Park for Japanese.
        return { latitude: 35.716409, longitude: 139.774783 }
      end
    end
  end

end
