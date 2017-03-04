Griddler.configure do |config|
  config.email_service = :mailgun
  config.processor_class = Mailman
  config.processor_method = :process
  config.reply_delimiter = '###@###@###'
end
