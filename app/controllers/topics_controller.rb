class TopicsController < ApplicationController
  def autocomplete
    @counter = params[:counter]
    @topics = Topic.search_by_name(remove_quotations(params[:query]))
  end
end
