#!/bin/bash

# Update system
sudo yum update -y
sudo yum groupinstall -y "Development Tools"
sudo yum install -y git curl unzip

# Cài đặt Node.js 22 từ NodeSource
curl -fsSL https://rpm.nodesource.com/setup_22.x | sudo bash -
sudo yum install -y nodejs

# Optional dev tools
sudo npm install -g pm2
sudo npm install -g yarn

# Update & install Docker
sudo yum update -y
sudo yum install -y docker git

# Start and enable Docker service
sudo systemctl start docker
sudo systemctl enable docker

# Install Docker Compose
DOCKER_COMPOSE_VERSION="2.22.0"
sudo curl -L "https://github.com/docker/compose/releases/download/v${DOCKER_COMPOSE_VERSION}/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose
sudo chmod +x /usr/local/bin/docker-compose

# Clone your repository (replace with your actual repo)
cd /home/ec2-user
git clone https://github.com/FinbertMDS/manual-chatbot.git
cd manual-chatbot

# Run ChromaDB with Docker Compose
sudo docker-compose up -d

# Done
echo "✅ Setup complete"
