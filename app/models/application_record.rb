class ApplicationRecord < ActiveRecord::Base
  self.abstract_class = true

  def generate_code(number)
    charset = Array('a'..'z') + Array(0..9)
    Array.new(number) { charset.sample }.join
  end
end
