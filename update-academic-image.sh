#!/bin/bash

# Script to update academic page image and deploy
set -e

echo "🖼️  Updating academic page image..."

# Colors for output
GREEN='\033[0;32m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

print_status() {
    echo -e "${GREEN}[INFO]${NC} $1"
}

print_step() {
    echo -e "${BLUE}[STEP]${NC} $1"
}

# Check if image file is provided
if [ $# -eq 0 ]; then
    echo "Usage: $0 <image_file>"
    echo "Example: $0 new_profile_image.jpg"
    exit 1
fi

IMAGE_FILE=$1

if [ ! -f "$IMAGE_FILE" ]; then
    echo "Error: Image file '$IMAGE_FILE' not found!"
    exit 1
fi

print_step "Uploading new image to academic server..."
scp -P 4022 "$IMAGE_FILE" anshuman@localhost:/home/anshuman/public_html/academic/images/me_small.png

print_step "Verifying image upload..."
ssh -p 4022 anshuman@localhost "ls -la public_html/academic/images/me_small.png"

print_status "✅ Academic page image updated successfully!"
print_status "🌐 Your academic page should now show the new image"

echo ""
echo "To update the academic page content:"
echo "  1. Edit fixed_academic_page.html"
echo "  2. Run: scp -P 4022 fixed_academic_page.html anshuman@localhost:/home/anshuman/public_html/academic/index.html"
echo ""
echo "To deploy everything:"
echo "  ./deploy-academic-full.sh"
