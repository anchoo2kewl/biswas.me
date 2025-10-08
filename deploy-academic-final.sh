#!/bin/bash

# Final academic page deployment script
set -e

echo "🎓 Final academic page deployment..."

# Colors for output
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

print_status() {
    echo -e "${GREEN}[INFO]${NC} $1"
}

print_step() {
    echo -e "${BLUE}[STEP]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

# Commit changes to git
print_step "Committing changes to git..."
git add .
git commit -m "Fix academic page: single line links, clean design $(date '+%Y-%m-%d %H:%M:%S')" || true

print_step "Pushing to GitHub..."
git push origin master

# Deploy academic page
print_step "Deploying academic page..."
scp -P 4022 fixed_academic_page.html anshuman@localhost:/home/anshuman/public_html/academic/index.html

print_step "Verifying deployment..."
ssh -p 4022 anshuman@localhost "ls -la public_html/academic/index.html"

print_status "✅ Academic page deployed successfully!"
print_status "🌐 Main page: your-academic-domain/"
print_status "🎓 Academic profile: your-academic-domain/academic/"

echo ""
echo "Current features:"
echo "  ✅ All 4 professional links on single line"
echo "  ✅ Clean, modern design with subtle colors"
echo "  ✅ Smooth hover animations for papers and links"
echo "  ✅ Responsive design for mobile devices"
echo "  ✅ Organized folder structure (academic/)"
echo ""
echo "To update the profile image:"
echo "  ./update-academic-image.sh <image_file>"
echo ""
echo "File structure:"
echo "  public_html/"
echo "  ├── index.html (redirect page)"
echo "  └── academic/"
echo "      ├── index.html (main academic page)"
echo "      ├── images/me_small.png (profile image)"
echo "      └── css/ (stylesheets)"
