class CancellationsController < ApplicationController

  def new
    @user = User.new
  end

  def submit
    @user = User.find_by_email(params[:user][:email])
    if @user.present?
      SubscriptionMailer.unsubscribe_email(@user).deliver_later
      redirect_to unsubscribing_path
    else
      @user = User.new
      @user.errors.add(:email, :not_found)
      render action: 'new'
    end
  end

  def destroy
    @subscription = Subscription.find_by_unsubscribe_uid(params[:unsubscribe_uid])
    if @subscription.present?
      @subscription.safely_destroy
      redirect_to search_subscriptions_path, notice: t('subscriptions.destroy.notice')
    end
  end

end
