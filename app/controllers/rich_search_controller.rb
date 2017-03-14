class RichSearchController < ApplicationController

  def new
    @topic_uid = params[:topic_uid]
    @location_uid = params[:location_uid]
    @topic = if @topic_uid.present? then
      Topic.where(uid: params[:topic_uid]).first_or_initialize
    else
      Topic.new
    end
    @location = if @location_uid.present? then
      Location.where(uid: params[:location_uid]).first_or_initialize
    else
      Location.new
    end
    gon.topic = { name: (@topic.name || "") }
    if @location.missing_coordinates?
      @location.by_ip(request.remote_ip, I18n.locale)
    end
    gon.location = { latitude: @location.latitude,
                     longitude: @location.longitude }
    gon.radius = { length: @location.radius_length_in_meters }
    supply_values_to_gon(@topic, @location, User.new, true)
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

  private

  # Supplies relevant values to a JS object called gon,
  # for consumption by client-side JS.
  # Includes supply_texts_to_gon.
  def supply_values_to_gon(topic, location, user, editable)
    gon.topic = { name: (topic.name || "") }
    # If the location is empty, get default coordinates based on IP.
    if location.missing_coordinates?
      location.by_ip(request.remote_ip, I18n.locale)
    end
    gon.location = { latitude: location.latitude,
                     longitude: location.longitude }
    gon.radius = { length: (location.radius_length_in_meters || 5000) }
    gon.user = { email: (user.email || "") }
    gon.editable = editable
    supply_texts_to_gon
  end

  # Dumps all of our internationalized text into a JS object
  # called gon, for consumption by the client-side app.
  def supply_texts_to_gon
    gon.topic_heading = t('subscriptions.search.topic_heading')
    gon.topic_label = t('subscriptions.search.topic_label')
    gon.topic_placeholder = t('subscriptions.search.topic_placeholder')
    gon.map_heading = t('subscriptions.search.map_heading')
    gon.map_label = t('subscriptions.search.map_label')
    gon.user_heading = t('subscriptions.search.user_heading')
    gon.user_label = t('subscriptions.search.user_label')
    gon.submit_label = t('subscriptions.search.submit_label')
  end

end
