#!/bin/bash

# Update and upgrade system packages
sudo apt update -y && sudo apt upgrade -y

# Install required dependencies
sudo apt install -y curl git unzip build-essential

# Install Node.js (LTS version)
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt install -y nodejs

# Verify Node.js and npm installation
node -v
npm -v

# Install PM2 globally to manage the Node.js app
sudo npm install -g pm2

# Setup SSH Key for GitHub
sudo mkdir -p /home/ubuntu/.ssh
sudo ssh-keygen -t rsa -b 4096 -C "yousefshaban.eg@gmail.com" -f /home/ubuntu/.ssh/id_rsa -N ""
sudo chown -R ubuntu:ubuntu /home/ubuntu/.ssh

# Start SSH agent and add the key
sudo -u ubuntu bash -c 'eval "$(ssh-agent -s)" && ssh-add /home/ubuntu/.ssh/id_rsa'

# Add GitHub's SSH key fingerprint to known_hosts
sudo -u ubuntu ssh-keyscan -t rsa github.com >> /home/ubuntu/.ssh/known_hosts

# Add public key to GitHub using API
GITHUB_TOKEN="GITHUB_TOKEN"
SSH_PUBLIC_KEY=$(cat /home/ubuntu/.ssh/id_rsa.pub)
curl -u "YOUR_GITHUB_USERNAME:$GITHUB_TOKEN" \
     -X POST \
     -H "Accept: application/vnd.github+json" \
     https://api.github.com/user/keys \
     -d "{\"title\":\"EC2-Instance-Key\",\"key\":\"$SSH_PUBLIC_KEY\"}"

# Clone the Node.js backend project from GitHub
sudo -u ubuntu git clone git@github.com:YOUR_GITHUB_USERNAME/your-repo.git /home/ubuntu/repo-folder-backend

# Navigate to the project directory
cd /home/ubuntu/repo-folder-backend

# Install project dependencies
sudo -u ubuntu npm install

# Set up environment variables
cat <<EOT >> /home/ubuntu/repo-folder-backend/.env
API_PORT=3000
DATABASE_URI=
NODE_ENV=production
LOG_PATH=./logs
DEFAULT_PAGE_NUMBER=1
DEFAULT_PAGE_SIZE=20
JWT_SECRET=
JWT_EXPIRES_IN=14d
AWS_ACCESS_KEY=
AWS_SECRET_ACCESS_KEY=
BUCKET_NAME=
BUCKET_REGION=
EOT

# Start the application using PM2
sudo -u ubuntu pm2 start npm --name repo-folder-backend -- start

# Configure PM2 to start on boot
sudo env PATH=$PATH:/usr/bin pm2 startup systemd -u ubuntu --hp /home/ubuntu
sudo -u ubuntu pm2 save

# Allow necessary ports through the firewall
sudo ufw allow 22   # SSH
sudo ufw allow 3000 # Node.js app port
sudo ufw --force enable
