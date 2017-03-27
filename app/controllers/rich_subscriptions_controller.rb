class RichSubscriptionsController < ApplicationController

  def new
    supply_values_to_gon(Topic.new, Location.new, User.new, true)
  end

  def show
    @subscription = Subscription.find_by_uid(params[:uid])
    supply_values_to_gon(@subscription.topic, @subscription.location, User.new, false)
    render action: 'new'
  end

  def edit
    @subscription = Subscription.find_by_uid(params[:uid])
    supply_values_to_gon(@subscription.topic, @subscription.location, @subscription.user, true)
    render action: 'new'
  end

  def create
    @subscription = Subscription.new(subscription_params)
    respond_to do |format|
      if @subscription.save
        # SubscriptionMailer.registration_email(@subscription).deliver_later
        payload = @subscription.as_json(include: [:topic, :location, :user])
        payload["status"] = "success"
        format.json { render json: payload, status: 201 }
      else
        payload = Hash.new
        payload["status"] = "errors"
        payload["errors"] = @subscription.errors
        format.json { render json: payload, status: 422 }
      end
    end
  end

  private

  # Supplies relevant values to a JS object called gon,
  # for consumption by client-side JS.
  # Includes supply_texts_to_gon.
  def supply_values_to_gon(topic, location, user, editable)
    gon.topic = {
      name: (topic.name || "")
    }
    # If the location is empty, get default coordinates based on IP.
    if location.missing_coordinates?
      location.by_ip(request.remote_ip, I18n.locale)
    end
    gon.location = {
      latitude: location.latitude,
      longitude: location.longitude
    }
    gon.radius = {
      length: (location.radius_length_in_meters || 5000)
    }
    gon.user = {
      email: (user.email || "")
    }
    gon.editable = editable
    supply_texts_to_gon
  end

  # Dumps all of our internationalized text into a JS object
  # called gon, for consumption by the client-side app.
  def supply_texts_to_gon
    gon.topic_heading = t('subscriptions.search.topic_heading')
    gon.topic_label = t('subscriptions.search.topic_label')
    gon.topic_placeholder = t('subscriptions.search.topic_placeholder')
    gon.topic_empty = t('activerecord.errors.models.topic.attributes.name.blank')
    gon.map_heading = t('subscriptions.search.map_heading')
    gon.map_label = t('subscriptions.search.map_label')
    gon.user_heading = t('subscriptions.search.user_heading')
    gon.user_label = t('subscriptions.search.user_label')
    gon.user_placeholder = t('subscriptions.search.user_placeholder')
    gon.user_empty = t('activerecord.errors.models.user.attributes.email.blank')
    gon.submit_label = t('subscriptions.search.submit_label')
    gon.create = t('rich_subscriptions.create')
    gon.map_controls = t('map_controls')
  end

  def subscription_params
    json_params = ActionController::Parameters.new( JSON.parse(request.body.read) )
    json_params.require(:subscription).permit([
      user_attributes: [
        :email
      ],
      topic_attributes: [
        :name
      ],
      location_attributes: [
        :latitude,
        :longitude,
        :radius_length,
        :radius_units
      ]
    ])
  end

end
