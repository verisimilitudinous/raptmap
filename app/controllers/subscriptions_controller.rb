class SubscriptionsController < ApplicationController

  def search
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
    supply_gon_search
  end

  def results
    if topic_params[:name].present?
      @topic = Topic.where(Topic.arel_table[:name].matches(topic_params[:name])).first_or_initialize(name: topic_params[:name])
    else
      @topic = Topic.new(topic_params)
    end
    @location = Location.new(location_params)
    y = @topic.valid?
    z = @location.valid?
    if y and z
      @subscription = Subscription.new
      @subscription.build_topic(@topic.attributes)
      @subscription.build_location(@location.attributes)
      @subscription.build_user
      @fellow_posters_count = @subscription.find_nearby_posters.size
      @fellow_listeners_count = @subscription.find_nearby_listeners.size
      render action: 'new'
    else
      render action: 'search'
    end
  end

  def index
    redirect_to action: 'search'
  end

  def show
    @subscription = Subscription.find_by_uid(params[:uid])
    @fellow_posters_count = @subscription.find_nearby_posters.size
    @fellow_listeners_count = @subscription.find_nearby_listeners.size
  end

  def new
    @subscription = Subscription.new(subscription_params)
    @fellow_posters_count = @subscription.find_nearby_posters.size
    @fellow_listeners_count = @subscription.find_nearby_listeners.size
  end

  def create
    @subscription = Subscription.new(subscription_params)
    if @subscription.save
      SubscriptionMailer.registration_email(@subscription).deliver_later
      # ProcessRegistrationEmailJob.perform_later(@subscription)
      flash[:success] = t('.success')
      redirect_to action: 'show', uid: @subscription.uid
    else
      @fellow_posters_count = @subscription.find_nearby_posters.size
      @fellow_listeners_count = @subscription.find_nearby_listeners.size
      render action: 'new'
    end
  end

  def destroy
    @subscription = Subscription.find_by_uid(params[:subscription][:uid])
    @subscription.safely_destroy
    redirect_to subscriptions_url, notice: t('.notice')
  end

  def test_ip
    location = Location.by_ip(request.remote_ip, I18n.locale)
    render text: (location[:latitude].to_s + "," + location[:longitude].to_s)
  end

  private
    def subscription_params
      params.require(:subscription).permit([user_attributes: [:email],
                                            topic_attributes: [:name],
                                            location_attributes: [:latitude,
                                                                  :longitude,
                                                                  :name,
                                                                  :radius_length,
                                                                  :radius_units]])
    end

    def topic_params
      params.require(:topic).permit([:name])
    end

    def location_params
      params.require(:location).permit([:latitude,:longitude,:name,:radius_length,:radius_units])
    end

    def supply_gon_search
      gon.default_coordinates = Location.by_ip(request.remote_ip, I18n.locale)
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
