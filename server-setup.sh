#!/bin/bash

# ilmAI VPS Server Setup Script
# This script sets up the production environment on Ubuntu 22.04

set -e  # Exit on any error

echo "🚀 Starting ilmAI VPS Server Setup..."
echo "=================================="

# Update system packages
echo "📦 Updating system packages..."
apt update && apt upgrade -y

# Install essential packages
echo "🔧 Installing essential packages..."
apt install -y curl wget git unzip software-properties-common apt-transport-https ca-certificates gnupg lsb-release

# Install Node.js 18.x
echo "📦 Installing Node.js 18.x..."
curl -fsSL https://deb.nodesource.com/setup_18.x | bash -
apt install -y nodejs

# Verify Node.js installation
echo "✅ Node.js version: $(node --version)"
echo "✅ NPM version: $(npm --version)"

# Install Docker
echo "🐳 Installing Docker..."
curl -fsSL https://download.docker.com/linux/ubuntu/gpg | gpg --dearmor -o /usr/share/keyrings/docker-archive-keyring.gpg
echo "deb [arch=$(dpkg --print-architecture) signed-by=/usr/share/keyrings/docker-archive-keyring.gpg] https://download.docker.com/linux/ubuntu $(lsb_release -cs) stable" | tee /etc/apt/sources.list.d/docker.list > /dev/null
apt update
apt install -y docker-ce docker-ce-cli containerd.io docker-compose-plugin

# Start and enable Docker
systemctl start docker
systemctl enable docker

# Add current user to docker group (if not root)
if [ "$USER" != "root" ]; then
    usermod -aG docker $USER
fi

# Install Docker Compose (standalone)
echo "🐳 Installing Docker Compose..."
curl -L "https://github.com/docker/compose/releases/latest/download/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose
chmod +x /usr/local/bin/docker-compose

# Verify Docker installation
echo "✅ Docker version: $(docker --version)"
echo "✅ Docker Compose version: $(docker-compose --version)"

# Install Nginx
echo "🌐 Installing Nginx..."
apt install -y nginx

# Start and enable Nginx
systemctl start nginx
systemctl enable nginx

# Install Certbot for SSL certificates
echo "🔒 Installing Certbot for SSL certificates..."
apt install -y certbot python3-certbot-nginx

# Create application directory
echo "📁 Creating application directory..."
mkdir -p /opt/ilmai
chown -R www-data:www-data /opt/ilmai

# Configure firewall
echo "🔥 Configuring UFW firewall..."
ufw --force enable
ufw allow ssh
ufw allow 'Nginx Full'
ufw allow 80/tcp
ufw allow 443/tcp

# Create systemd service for the application (backup method)
echo "⚙️ Creating systemd service..."
cat > /etc/systemd/system/ilmai.service << EOF
[Unit]
Description=ilmAI - Islamic Knowledge Assistant
After=network.target

[Service]
Type=simple
User=www-data
WorkingDirectory=/opt/ilmai/current
Environment=NODE_ENV=production
ExecStart=/usr/bin/npm start
Restart=always
RestartSec=10

[Install]
WantedBy=multi-user.target
EOF

# Enable the service (but don't start it yet - Docker will handle this)
systemctl daemon-reload
systemctl enable ilmai

# Setup log rotation
echo "📝 Setting up log rotation..."
cat > /etc/logrotate.d/ilmai << EOF
/var/log/nginx/ilmai.live.*.log {
    daily
    missingok
    rotate 52
    compress
    delaycompress
    notifempty
    create 644 www-data www-data
    postrotate
        systemctl reload nginx
    endscript
}
EOF

# Create basic Nginx configuration
echo "🌐 Creating basic Nginx configuration..."
cat > /etc/nginx/sites-available/ilmai.live << EOF
# Basic configuration - will be replaced with SSL version later
server {
    listen 80;
    server_name ilmai.live www.ilmai.live;
    
    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade \$http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host \$host;
        proxy_set_header X-Real-IP \$remote_addr;
        proxy_set_header X-Forwarded-For \$proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto \$scheme;
        proxy_cache_bypass \$http_upgrade;
    }
}
EOF

# Enable the site
ln -sf /etc/nginx/sites-available/ilmai.live /etc/nginx/sites-enabled/
rm -f /etc/nginx/sites-enabled/default

# Test Nginx configuration
nginx -t

# Reload Nginx
systemctl reload nginx

# Setup SSH key for GitHub Actions
echo "🔑 Setting up SSH key for deployments..."
mkdir -p /root/.ssh
chmod 700 /root/.ssh

echo "📋 Server setup completed successfully!"
echo "=================================="
echo ""
echo "✅ Node.js $(node --version) installed"
echo "✅ Docker $(docker --version | cut -d' ' -f3) installed"
echo "✅ Docker Compose $(docker-compose --version | cut -d' ' -f3) installed"
echo "✅ Nginx installed and configured"
echo "✅ Certbot installed for SSL certificates"
echo "✅ Firewall configured"
echo "✅ Application directory created: /opt/ilmai"
echo ""
echo "🔄 Next steps:"
echo "1. Add the SSH public key to /root/.ssh/authorized_keys"
echo "2. Configure GitHub repository secrets"
echo "3. Obtain SSL certificate: certbot --nginx -d ilmai.live -d www.ilmai.live"
echo "4. Deploy the application using GitHub Actions"
echo ""
echo "🌐 Your server is ready for deployment!"
