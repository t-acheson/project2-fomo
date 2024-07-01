# Install certbot
sudo snap install --classic certbot

# Prepare certbot command
sudo ln -s /snap/bin/certbot /usr/bin/certbot

# Make sure your webserver is down before running
sudo certbot certonly --manual -d *.${DOMAIN} -d ${DOMAIN} --preferred-challenges dns-01

# Then follow the steps. Set your domain to the same domain as the DOMAIN environment variable
