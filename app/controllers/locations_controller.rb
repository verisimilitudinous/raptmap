class LocationsController < ApplicationController
  def autocomplete
    @counter = params[:counter]
    @locations = Pelias.autocomplete(remove_quotations(params[:query]))
  end
end
