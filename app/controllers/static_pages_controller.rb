class StaticPagesController < ApplicationController
  def about
    render template: "static_pages/about/#{I18n.locale}"
  end

  def privacy
  end
end
