module ApplicationHelper
  def fingerprinted_asset(name)
    Rails.env.production? ? "#{name}-#{ASSET_FINGERPRINT}" : name
  end

  def full_title(page_title = '')
    base_title = t('layouts.header.heading')
    if page_title.empty?
      base_title
    else
      base_title + " | " + page_title
    end
  end

  def full_description(page_description = '')
    base_description = t('layouts.header.subheading')
    if page_description.empty?
      base_description
    else
      page_description
    end
  end

  def locale_text(locale)
    case locale
    when :en
      link_to("English", "#")
    when :ja
      "Japanese"
    end
  end

  def english_locale_link(locale)
    if locale === :en
      "English"
    else
      link_to("English", "/en")
    end
  end

  def japanese_locale_link(locale)
    if locale === :ja
      "日本語"
    else
      link_to("日本語", "/ja")
    end
  end

end
