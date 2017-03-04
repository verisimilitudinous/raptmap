class TopicsController < ApplicationController

  def autocomplete
    @topics = Topic.search_by_name(remove_quotations(params[:query]))
  end

end
