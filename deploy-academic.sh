#!/bin/bash

# Academic page deployment script for biswas.me
set -e

echo "🎓 Starting deployment of academic page..."

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
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

print_step() {
    echo -e "${BLUE}[STEP]${NC} $1"
}

# Check if we're on the server or local
if [[ $(hostname) == *"biswas.me"* ]] || [[ $1 == "server" ]]; then
    SERVER_MODE=true
    print_status "Running in server mode"
else
    SERVER_MODE=false
    print_status "Running in local mode - will push to git and deploy"
fi

if [ "$SERVER_MODE" = false ]; then
    # Local machine - commit and push changes
    print_step "Checking for uncommitted changes..."
    
    if ! git diff --quiet || ! git diff --cached --quiet; then
        print_warning "You have uncommitted changes. Committing them..."
        git add .
        git commit -m "Update academic page: $(date '+%Y-%m-%d %H:%M:%S')" || true
    fi
    
    print_step "Pushing changes to GitHub..."
    git push origin master
    
    print_step "Deploying to academic server..."
    
    # Check if the updated academic page exists
    if [ ! -f "updated_academic_page.html" ]; then
        print_error "updated_academic_page.html not found!"
        exit 1
    fi
    
    # Upload to academic server
    print_step "Uploading to academic server..."
    scp -P 4022 updated_academic_page.html anshuman@localhost:/home/anshuman/public_html/index.html
    
    print_step "Verifying upload..."
    ssh -p 4022 anshuman@localhost "ls -la public_html/index.html"
    
    print_status "✅ Academic page deployed successfully!"
    print_status "🌐 Your academic page should be available at your academic domain"
    
    echo ""
    echo "Useful commands:"
    echo "  View logs: ssh -p 4022 anshuman@localhost 'tail -f /var/log/apache2/access.log'"
    echo "  Check status: ssh -p 4022 anshuman@localhost 'ls -la public_html/'"
    echo "  Update image: scp -P 4022 new_image.jpg anshuman@localhost:/home/anshuman/public_html/images/me_small.png"
    
    exit 0
fi

# Server mode - pull and deploy (if needed)
print_status "Academic page is already updated via local deployment"
print_status "🎉 Academic page deployment completed!"
