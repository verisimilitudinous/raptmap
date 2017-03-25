module ApplicationHelper

  # fingerprinted_asset() fetches the ASSET_FINGERPRINT from config/initializers/fingerprint.rb
  # ASSET_FINGERPRINT is generated outside of Rails by webpack.
  # Used for cache-busting assets in prod.
  def fingerprinted_asset(name)
    Rails.env.production? ? "#{name}-#{ASSET_FINGERPRINT}" : name
  end

  # full_title() creates the <title> for the page.
  def full_title(page_title = '')
    base_title = t('layouts.header.heading')
    if page_title.empty?
      base_title
    else
      base_title + " | " + page_title
    end
  end

  # full_description() creates the page description for use in <meta> tags.
  def full_description(page_description = '')
    base_description = t('layouts.header.subheading')
    if page_description.empty?
      base_description
    else
      page_description
    end
  end

  # asset_handler can be used in all layouts to supply correct js/css.
  def asset_handler
    tags = String.new
    tags << tag(:link, rel: "stylesheet", href: "/stylesheets/icons.css")
    if controller_name == "rich_subscriptions"
      tags << content_tag(:script, "", src: "/javascripts/#{fingerprinted_asset('map')}.js")
      tags << tag(:link, rel: "stylesheet", href: "/stylesheets/leaflet/leaflet.css")
      tags << tag(:link, rel: "stylesheet", href: "/stylesheets/leaflet/leaflet-slider.css")
      tags << tag(:link, rel: "stylesheet", href: "/stylesheets/leaflet/L.Control.Locate.min.css")
      tags << tag(:link, rel: "stylesheet", href: "/stylesheets/#{fingerprinted_asset('map')}.css")
    else
      tags << content_tag(:script, "", src: "/javascripts/#{fingerprinted_asset('application')}.js")
      tags << tag(:link, rel: "stylesheet", href: "/stylesheets/#{fingerprinted_asset('application')}.css")
    end
    tags.html_safe
  end

  # english_locale_link() handles the link for toggling English.
  # Link will not be active if current language is English.
  def english_locale_link(locale)
    if locale === :en
      "English"
    else
      link_to("English", "/en")
    end
  end

  # Likewise, japanese_locale_link() handles the link for toggling Japanese.
  def japanese_locale_link(locale)
    if locale === :ja
      "日本語"
    else
      link_to("日本語", "/ja")
    end
  end

end
