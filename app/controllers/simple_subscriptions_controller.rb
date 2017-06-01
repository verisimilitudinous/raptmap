class SimpleSubscriptionsController < ApplicationController

  def search
    @topic = Topic.new
    @location = Location.new
  end

  def results
    # First put the user's answers into objects.
    @topic = Topic.new(topic_params)
    @location = Location.new(location_params)
    # Next, we explicitly validate each.
    topic_validation = @topic.valid?
    location_validation = @location.valid?
    # Explicit validations above are needed to ensure we get 
    # the @location's error messages. If we just did the following...
    #
    # if @topic.valid? and @location.valid?
    #
    # ...then we would miss @location errors if @topic fails too.
    if topic_validation and location_validation
      # Find some additional suggestions for the user.
      @topics = Topic.where(Topic.arel_table[:name].matches(topic_params[:name]))
      @locations = Pelias.autocomplete(@location.name)
    else
      render action: 'search'
    end
  end

  def new
    @subscription = Subscription.new
    @subscription.build_topic(topic_params)
    @subscription.build_location(location_params)
    @subscription.build_user
    @fellow_posters_count = @subscription.find_nearby_posters.size
    @fellow_listeners_count = @subscription.find_nearby_listeners.size
  end

  def create
    @subscription = Subscription.new(subscription_params)
    if @subscription.save
      SubscriptionMailer.registration_email(@subscription).deliver_later
      flash[:success] = t('.success')
      redirect_to action: 'show', uid: @subscription.uid
    else
      @fellow_posters_count = @subscription.find_nearby_posters.size
      @fellow_listeners_count = @subscription.find_nearby_listeners.size
      render action: 'new'
    end
  end

  def show
    @subscription = Subscription.find_by_uid(params[:uid])
    @fellow_posters_count = @subscription.find_nearby_posters.size
    @fellow_listeners_count = @subscription.find_nearby_listeners.size
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


end
