# Preview all emails at http://localhost:3000/rails/mailers/subscription_mailer
class SubscriptionMailerPreview < ActionMailer::Preview
  def registration_email_preview
    SubscriptionMailer.registration_email(Subscription.first)
  end
  def unsubscribe_email_preview
    SubscriptionMailer.unsubscribe_email(User.first)
  end
end
