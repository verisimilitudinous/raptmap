FROM ruby:2.3-slim

MAINTAINER Jon Jensen <jon@xjensen.com>

RUN apt-get update && apt-get install -qq -y --no-install-recommends \
      build-essential \
      locales \
      nodejs \
      libpq-dev

RUN locale-gen en_US.UTF-8
ENV LANG en_US.UTF-8
ENV LANGUAGE en_US:en
ENV LC_ALL en_US.UTF-8

ENV INSTALL_PATH /raptmap
RUN mkdir -p $INSTALL_PATH
WORKDIR $INSTALL_PATH

COPY Gemfile Gemfile.lock ./
RUN bundle install

COPY . .

VOLUME ["$INSTALL_PATH/public"]

ENTRYPOINT ["bundle", "exec"]

CMD ["puma", "-C", "config/puma.rb"]
