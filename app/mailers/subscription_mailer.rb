class SubscriptionMailer < ApplicationMailer
  helper SubscriptionsHelper

  def registration_email(subscription)
    @subscription = subscription
    puts @subscription.inspect
    @fellow_posters_count = @subscription.find_nearby_posters.size
    @fellow_listeners_count = @subscription.find_nearby_listeners.size
    payload = Hash.new
    payload[:from] = "#{t('subscription_mailer.registration_email.from')} <#{@subscription.uid}@mail.raptmap.com>"
    payload[:subject] = t('subscription_mailer.registration_email.subject', { topic_name: @subscription.topic.name,
                                                                              location_name: @subscription.location.name })
    payload[:text] = (render_to_string(formats: [:text], template: "../views/subscription_mailer/registration_email")).to_str
    payload[:html] = (render_to_string(formats: [:html], template: "../views/subscription_mailer/registration_email")).to_str
    payload[:to] = @subscription.user.email
    puts payload.inspect
    mailgun(payload)
  end

  def unsubscribe_email(user)
    @user = user
    @subscriptions = user.subscriptions
    payload = Hash.new
    payload[:from] = "#{t('subscription_mailer.unsubscribe_email.from')} <unsubscriber@mail.raptmap.com>"
    payload[:subject] = t('subscription_mailer.unsubscribe_email.subject')
    payload[:text] = (render_to_string(formats: [:text], template: "../views/subscription_mailer/unsubscribe_email")).to_str
    payload[:html] = (render_to_string(formats: [:html], template: "../views/subscription_mailer/unsubscribe_email")).to_str
    payload[:to] = @user.email
    puts payload.inspect
    mailgun(payload)
  end

  def post_email(subscription_uid, user_email, message_body)
    @body = message_body
    @user = User.find_by_email(user_email)
    if @user.present?
      puts "post_email"
      @subscription = Subscription.find_by_uid(subscription_uid)
      @subscription.find_nearby_listeners.each do |listener|
        payload = Hash.new
        payload[:from] = "#{t('subscription_mailer.post_email.from', uid: @user.uid )} <#{@user.uid}@mail.raptmap.com>"
        payload[:subject] = t('subscription_mailer.post_email.subject', { topic_name: @subscription.topic.name,
                                                                          location_name: @subscription.location.name })
        payload[:text] = (render_to_string(formats: [:text],
                                           template: "../views/subscription_mailer/post_email",
                                           locals: { listener: listener })).to_str
        payload["h:Reply-To"] = "#{@subscription.uid}@mail.raptmap.com"
        payload[:to] = listener.user.email
        mailgun(payload)
      end
    end
  end

  private

  def mailgun(payload)
    RestClient::Request.execute(
      method: :post,
      url: ENV['MAILGUN_API_URL'],
      user: "api",
      password: ENV['MAILGUN_API_KEY'],
      payload: payload
    )
  end
end
