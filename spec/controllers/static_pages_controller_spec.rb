require 'rails_helper'

RSpec.describe StaticPagesController, type: :controller do
  describe "GET about" do

    it "renders the Japanese template" do
      get :about, params: {locale: :ja}
      expect(response).to render_template(:ja)
    end

    it "renders the English template" do
      get :about, params: {locale: :en}
      expect(response).to render_template(:en)
    end

  end
end
