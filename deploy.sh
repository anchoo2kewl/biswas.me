#!/bin/bash

# Production deployment script for biswas.me
set -e

echo "🚀 Starting deployment of biswas.me..."

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Function to print colored output
print_status() {
    echo -e "${GREEN}[INFO]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# Check if we're on the server or local
if [[ $(hostname) == *"biswas.me"* ]] || [[ $1 == "server" ]]; then
    SERVER_MODE=true
    print_status "Running in server mode"
else
    SERVER_MODE=false
    print_status "Running in local mode - will push to git"
fi

if [ "$SERVER_MODE" = false ]; then
    # Local machine - commit and push changes
    print_status "Checking for uncommitted changes..."
    
    if ! git diff --quiet || ! git diff --cached --quiet; then
        print_warning "You have uncommitted changes. Committing them..."
        git add .
        git commit -m "Deploy: $(date '+%Y-%m-%d %H:%M:%S')" || true
    fi
    
    print_status "Pushing changes to GitHub..."
    git push origin main || git push origin master
    
    print_status "✅ Code pushed to GitHub. Now SSH to your server and run:"
    echo ""
    echo "ssh ubuntu@biswas.me"
    echo "cd /home/ubuntu/projects/biswas.me"
    echo "./deploy.sh server"
    echo ""
    exit 0
fi

# Server mode - pull and deploy
print_status "Pulling latest changes from GitHub..."
git pull origin main || git pull origin master

print_status "Stopping existing containers..."
docker-compose down || true

print_status "Building production Docker image..."
docker-compose build

print_status "Starting new containers..."
docker-compose up -d

print_status "Waiting for services to be ready..."
sleep 10

print_status "Checking service health..."
if curl -f http://localhost:3000/api/health >/dev/null 2>&1; then
    print_status "✅ Backend health check passed"
else
    print_warning "Backend health check failed, checking logs..."
    docker-compose logs --tail=20 portfolio
fi

if curl -f http://localhost:3000 >/dev/null 2>&1; then
    print_status "✅ Frontend health check passed"
else
    print_warning "Frontend health check failed, checking logs..."
    docker-compose logs --tail=20 portfolio
fi

print_status "Cleaning up old Docker images..."
docker system prune -f

print_status "🎉 Deployment completed!"
print_status "🌐 Your site should be available at: https://biswas.me"

echo ""
echo "Useful commands:"
echo "  View logs: docker-compose logs -f"
echo "  Restart:   docker-compose restart"
echo "  Stop:      docker-compose down"
echo "  Status:    docker-compose ps"