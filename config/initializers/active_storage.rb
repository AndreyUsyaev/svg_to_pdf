Rails.application.config.to_prepare do
  ActiveStorage::Current.url_options = {
    host: ENV.fetch("APP_HOST", "localhost:3000")
  }
end
