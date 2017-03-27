class LocationsController < ApplicationController
  def autocomplete
    @counter = params[:counter].to_i
    @locations = Pelias.autocomplete(remove_quotations(params[:query]))
  end
end
