# Pull the base from Ruby slim.
# https://hub.docker.com/_/ruby/
FROM ruby:2.3-slim

# This doesn't do anything important.
# It just establishes me as the all-knowing and just God...of this Dockerfile.
MAINTAINER Jon Jensen <github@id.xjensen.com>

# This installs some app dependencies.
# Ruby slim is based on Debian, so we can use good ol' apt-get.
RUN apt-get update && apt-get install -qq -y --no-install-recommends \
  build-essential \
  locales \
  nodejs \
  libpq-dev

# Docker's default locale is "C".
# This app is multilingual; let's not tempt that devil.
# Change the locale to something UTF-8-ish.
RUN locale-gen en_US.UTF-8
ENV LANG en_US.UTF-8
ENV LANGUAGE en_US:en
ENV LC_ALL en_US.UTF-8

# Set up the default directory where the app will live.
ENV INSTALL_PATH /raptmap
RUN mkdir -p $INSTALL_PATH

# Let's work from that directory now.
WORKDIR $INSTALL_PATH

# Install all the Ruby gems from the Gemfile.
COPY Gemfile Gemfile.lock ./
RUN bundle install

# Copy all the app files over.
COPY . .

# Set up a volume so file changes are reflected on the host machine.
VOLUME ["$INSTALL_PATH/public"]

# Make sure all commands prefixed with the following.
ENTRYPOINT ["bundle", "exec"]

# Finally, start up puma.
CMD ["puma", "-C", "config/puma.rb"]
