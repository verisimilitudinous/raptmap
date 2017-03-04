class User < ApplicationRecord
  has_many :subscriptions
  VALID_EMAIL_REGEX = /\A[\w+\-.]+@[a-z\d\-.]+\.[a-z]+\z/i
  validates :email, presence: true,
                    length: { maximum: 255 },
                    format: { with: VALID_EMAIL_REGEX },
                    uniqueness: { case_sensitive: false }
  before_save :downcase_email
  before_save :generate_uid
  after_validation do
    remove_redundant_errors
  end

  def downcase_email
    self.email = self.email.downcase
  end

  def generate_uid
    self.uid = generate_code(7)
  end

  def remove_redundant_errors
    errors.details[:email].each do |item|
      if item[:error] == :blank
        errors.details[:email].each_with_index do |item, index|
          if item[:error] == :invalid
            errors.messages[:email].delete_at(index)
            errors.details[:email].delete_at(index)
          end
        end
      end
    end
  end

end
