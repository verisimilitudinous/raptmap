require 'rails_helper'

RSpec.feature "StaticPages", type: :feature do
  describe "the about page" do

    it "renders English content" do
      visit '/en/about'
      expect(page).to have_css("header h1", text: "The Rapt Map")
    end

    it "renders Japanese content" do
      visit '/ja/about'
      expect(page).to have_css("header h1", text: "ラプトマップ")
    end

  end
end
