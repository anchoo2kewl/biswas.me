.PHONY: dev backend frontend mailpit install clean build test pdf

# Development - runs all services
dev: 
	@echo "Starting development environment..."
	@make -j3 frontend backend mailpit

# Start frontend development server
frontend:
	@echo "Starting Next.js frontend on http://localhost:3000"
	yarn dev

# Start Go backend server with hot reload
backend:
	@echo "Starting Go backend on http://localhost:9000 with hot reload"
	cd backend && air

# Start mailpit email testing server
mailpit:
	@echo "Starting mailpit on http://localhost:8025"
	mailpit --smtp=localhost:1025 --listen=localhost:8025

# Install all dependencies
install:
	@echo "Installing frontend dependencies..."
	yarn install
	@echo "Installing backend dependencies..."
	cd backend && go mod tidy
	@echo "Installing mailpit..."
	@command -v mailpit >/dev/null 2>&1 || brew install mailpit
	@echo "All dependencies installed!"

# Build for production
build:
	@echo "Building frontend..."
	yarn build
	@echo "Building backend..."
	cd backend && go build -o ../dist/backend main.go
	@mkdir -p dist
	@echo "Build complete! Files in ./dist/"

# Clean build artifacts
clean:
	rm -rf .next dist backend/messages.db

# Run tests
test:
	@echo "Testing frontend..."
	yarn test --passWithNoTests
	@echo "Testing backend..."
	cd backend && go test ./...

# Generate PDF resume from HTML
pdf:
	@echo "Generating PDF resume..."
	@command -v "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome" >/dev/null 2>&1 || { echo "Error: Chrome not found. Please install Google Chrome."; exit 1; }
	@echo "Generating PDF from static HTML file..."
	@"/Applications/Google Chrome.app/Contents/MacOS/Google Chrome" --headless --disable-gpu --run-all-compositor-stages-before-draw --print-to-pdf=./public/AnshumanBiswas.pdf --print-to-pdf-no-header --no-pdf-header-footer --disable-pdf-tagging --virtual-time-budget=15000 --disable-background-timer-throttling "file://$(PWD)/static-resume.html" || { echo "Error: Failed to generate PDF"; exit 1; }
	@echo "PDF generated successfully: public/AnshumanBiswas.pdf"

# Production server (after build)
prod: build
	@echo "Starting production servers..."
	@make -j3 prod-frontend prod-backend mailpit

prod-frontend:
	yarn start

prod-backend:  
	cd backend && ./backend

# Show help
help:
	@echo "Available commands:"
	@echo "  make dev       - Start all development services"
	@echo "  make frontend  - Start only Next.js frontend"
	@echo "  make backend   - Start only Go backend"
	@echo "  make mailpit   - Start only mailpit email server"
	@echo "  make install   - Install all dependencies"
	@echo "  make build     - Build for production"
	@echo "  make prod      - Run production build"
	@echo "  make clean     - Clean build artifacts"
	@echo "  make test      - Run all tests"
	@echo "  make pdf       - Generate PDF resume from HTML"
	@echo "  make help      - Show this help"

# Default target
all: dev