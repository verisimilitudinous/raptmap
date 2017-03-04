require 'test_helper'

class TopicTest < ActiveSupport::TestCase
  # test "the truth" do
  #   assert true
  # end

  def setup
    @attrs = {name: "Tichu"}
    @topic = Topic.new(@attrs)
  end

  test "should be valid" do
    assert @topic.valid?
  end

  test "name should be present" do
    @topic.name = "     "
    assert_not @topic.valid?
  end

  test "name should not be too long" do
    @topic.name = "a" * 265
    assert_not @topic.valid?
  end

  test "name should be unique" do
    duplicate_topic = @topic.dup
    duplicate_topic.name = @topic.name.upcase
    @topic.save
    assert_not duplicate_topic.valid?
  end
end
