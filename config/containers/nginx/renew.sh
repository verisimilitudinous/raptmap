#!/bin/bash

project_path="/home/ferret/containers/raptmap"
compose_file_path="$project_path/docker-compose-prod.yml"
needs_restart=false

services=( "raptmap" )

for service_name in "${services[@]}"
do

  config_file="$project_path/config/containers/nginx/$service_name.ini"
  le_path='letsencrypt'
  exp_limit=30;

  if [ ! -f $config_file ]; then
    echo "[ERROR] config file does not exist: $config_file"
    continue
  fi

  domain=`grep "^\s*domains" $config_file | sed "s/^\s*domains\s*=\s*//" | sed 's/(\s*)\|,.*$//'`
  cert_file="/etc/letsencrypt/live/$domain/fullchain.pem"
  key_file="/etc/letsencrypt/live/$domain/privkey.pem"

  if [ ! -f $cert_file ]; then
    echo "[ERROR] certificate file not found for domain $domain."
  fi

  exp=$(date -d "`openssl x509 -in $cert_file -text -noout|grep "Not After"|cut -c 25-`" +%s)
  datenow=$(date -d "now" +%s)
  days_exp=$(echo \( $exp - $datenow \) / 86400 |bc)

  echo "Checking expiration date for $domain..."

  if [ "$days_exp" -gt "$exp_limit" ] ; then
    echo "The certificate is up to date, no need for renewal ($days_exp days left)."
    continue
  else
    echo "The certificate for $domain is about to expire soon. Starting webroot renewal script..."
    $le_path certonly -a webroot --agree-tos --renew-by-default --config $config_file

    echo "Copying certs into nginx directory"
    cp $cert_file $key_file $project_path/config/containers/nginx/ssl/

    echo "Changing permissions"
    sudo chown ferret:ferret $project_path/config/containers/nginx/ssl/*

    needs_restart=true

    echo "Renewal process finished for domain $domain"
    continue
  fi

done

if [ "$needs_restart" = true ] ; then
  echo "Reloading services"
  docker-compose -f $compose_file_path restart
else
  echo "No certs updated, no restart needed"
fi

exit 0
