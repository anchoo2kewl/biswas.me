#!/bin/bash

# Complete academic page deployment script for biswas.me
set -e

echo "🎓 Starting complete academic page deployment..."

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
        git commit -m "Reorganize academic pages: $(date '+%Y-%m-%d %H:%M:%S')" || true
    fi
    
    print_step "Pushing changes to GitHub..."
    git push origin master
    
    print_step "Creating academic folder structure on server..."
    
    # Create academic folder structure
    ssh -p 4022 anshuman@localhost "mkdir -p public_html/academic"
    
    # Upload main index.html
    print_step "Uploading main index.html..."
    scp -P 4022 main_index.html anshuman@localhost:/home/anshuman/public_html/index.html
    
    # Upload academic page
    print_step "Uploading academic page..."
    scp -P 4022 updated_academic_page.html anshuman@localhost:/home/anshuman/public_html/academic/index.html
    
    # Upload deployment script
    print_step "Uploading deployment script..."
    scp -P 4022 deploy-academic-full.sh anshuman@localhost:/home/anshuman/deploy-academic.sh
    ssh -p 4022 anshuman@localhost "chmod +x /home/anshuman/deploy-academic.sh"
    
    print_step "Verifying uploads..."
    ssh -p 4022 anshuman@localhost "ls -la public_html/ && ls -la public_html/academic/"
    
    print_status "✅ Academic page structure deployed successfully!"
    print_status "🌐 Main page: your-academic-domain/"
    print_status "🎓 Academic profile: your-academic-domain/academic/"
    
    echo ""
    echo "File structure:"
    echo "  public_html/"
    echo "  ├── index.html (redirect page)"
    echo "  ├── academic/"
    echo "  │   ├── index.html (main academic page)"
    echo "  │   ├── css/ (stylesheets)"
    echo "  │   ├── images/ (profile images)"
    echo "  │   └── favicon files"
    echo ""
    echo "Useful commands:"
    echo "  Update academic page: ./deploy-academic-full.sh"
    echo "  Update image: scp -P 4022 new_image.jpg anshuman@localhost:/home/anshuman/public_html/academic/images/me_small.png"
    echo "  Check status: ssh -p 4022 anshuman@localhost 'ls -la public_html/academic/'"
    
    exit 0
fi

# Server mode - pull and deploy (if needed)
print_status "Academic page structure is already updated via local deployment"
print_status "🎉 Academic page deployment completed!"
