class Mailman
  def initialize(email)
    @email = email
  end

  def process
    SubscriptionMailer.post_email(@email.to.first[:token], @email.from[:email], @email.body).deliver_later
  end
end
