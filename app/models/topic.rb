class Topic < ApplicationRecord
  include PgSearch
  pg_search_scope :search_by_name,
                  :against => :name,
                  :using => :trigram
  has_many :subscriptions
  validates :name, presence: { message: "Please add a discussion topic to proceed." },
                   length: { maximum: 255, message: "Trim up that topic name. It's too long."},
                   uniqueness: { case_sensitive: false, message: "That topic already exists." }
  before_create :generate_uid

  def generate_uid
    self.uid = generate_code(7)
  end

end
