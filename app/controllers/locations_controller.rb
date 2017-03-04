class LocationsController < ApplicationController
  def autocomplete
    @locations = Pelias.autocomplete(remove_quotations(params[:query]))
  end
end
