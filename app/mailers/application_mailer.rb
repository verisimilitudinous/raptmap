class ApplicationMailer < ActionMailer::Base
  default from: 'postmaster@raptmap.com'
  layout 'mailer'
end
