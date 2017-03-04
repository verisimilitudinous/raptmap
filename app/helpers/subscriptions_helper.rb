module SubscriptionsHelper
  def link_to_alternate_search
    if params[:map]
      link_to "Lo-fi Version", simple_form_path
    else
      link_to "Interactive Map", map_path
    end
  end

  def units_array
    [
      [t('measurements.km.text'), "km"],
      [t('measurements.m.text'), "m"],
      [t('measurements.mi.text'), "mi"],
      [t('measurements.ft.text'), "ft"]
    ]
  end
  def start_or_join_conversation(start, join)
    if @fellow_listeners_count.zero?
      start
    else
      join
    end
  end
  def subscription_attrs_for_localization
    {
      topic_name: @subscription.topic.name,
      radius_length: @subscription.location.radius_length,
      radius_units: @subscription.location.radius_units,
      location_name: @subscription.location.name
    }
  end
  def subscription_attrs_for_localization_with_count(count)
    subscription_attrs_for_localization.merge({ count: count })
  end
  def sharing_domain
    "https://#{t('domain')}"
  end

  def topic_sharing_path
    "/t/#{@subscription.topic.uid}"
  end
  def topic_sharing_url
    sharing_domain + topic_sharing_path
  end
  def topic_sharing_link
    link_to topic_sharing_url, topic_sharing_path
  end

  def sharing_title_and_desc
    attrs = { topic_name: @topic.name, location_name: @location.name }
    if @topic_uid.present? and @location_uid.present?
      provide(:title, t('subscriptions.search.topic_and_location_title', attrs))
      provide(:description, t('subscriptions.search.topic_and_location_description', attrs))
    else
      if @topic_uid.present?
        provide(:title, t('subscriptions.search.topic_title', attrs))
        provide(:description, t('subscriptions.search.topic_description', attrs))
      else
        provide(:description, t('subscriptions.search.base_description'))
      end
    end
  end

  def topic_and_location_sharing_path
    "/t/#{@subscription.topic.uid}/l/#{@subscription.location.uid}"
  end
  def topic_and_location_sharing_url
    sharing_domain + topic_and_location_sharing_path
  end
  def topic_and_location_sharing_link
    link_to topic_and_location_sharing_url, topic_and_location_sharing_path
  end

end
