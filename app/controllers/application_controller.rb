class ApplicationController < ActionController::Base
  protect_from_forgery with: :exception
  before_action :add_allow_credentials_headers
  before_action :set_locale

  def add_allow_credentials_headers
    # https://developer.mozilla.org/en-US/docs/Web/HTTP/Access_control_CORS#section_5
    #
    # Because we want our front-end to send cookies to allow the API to be authenticated
    # (using 'withCredentials' in the XMLHttpRequest), we need to add some headers so
    # the browser will not reject the response
    response.headers['Access-Control-Allow-Origin'] = request.headers['Origin'] || '*'
    response.headers['Access-Control-Allow-Credentials'] = 'true'
  end

  def options
    head :status => 200, :'Access-Control-Allow-Headers' => 'accept, content-type'
  end

  def url_options
    { locale: I18n.locale }.merge(super)
  end

  private

  def set_locale
    if params[:locale].present?
      I18n.locale = params[:locale]
    else
      I18n.locale = http_accept_language.compatible_language_from(I18n.available_locales)
    end
  end

  def remove_quotations(str)
    if str.starts_with?('"')
      str = str.slice(1..-1)
    end
    if str.ends_with?('"')
      str = str.slice(0..-2)
    end
    str
  end

end
