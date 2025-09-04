# biswas.me

Personal portfolio website of Anshuman Biswas, VP of Engineering at Elastio. Built with modern technologies for performance and developer experience.

## Tech Stack

**Frontend:**
- Next.js 15 with TypeScript
- Tailwind CSS + shadcn/ui components
- React Hook Form + Zod validation
- Smooth scrolling navigation
- PDF resume viewer

**Backend:**
- Go 1.24+ with SQLite database
- reCAPTCHA verification
- CORS-enabled REST API
- Dual email system (notification + auto-reply)
- Multiple email providers (Mailpit, Brevo)

**Development Tools:**
- Mailpit for email testing
- Hot reload for both frontend and backend
- Make commands for easy development

## Prerequisites

- Node.js (v18 or higher)
- Go (v1.24 or higher)
- yarn package manager
- make (for development commands)
- Homebrew (for mailpit installation)

## Quick Start

1. **Clone and install**
   ```bash
   git clone <your-repo-url>
   cd biswas.me
   make install
   ```

2. **Start development environment**
   ```bash
   make dev
   ```
   
   This starts all services in parallel:
   - Frontend: http://localhost:3000
   - Backend API: http://localhost:8080  
   - Mailpit (email testing): http://localhost:8025

3. **Test the contact form**
   - Fill out the contact form on the website
   - Check received emails at http://localhost:8025
   - Backend logs will show API requests

## Development Commands

```bash
# Start all services (frontend, backend, mailpit)
make dev

# Start individual services
make frontend    # Next.js dev server
make backend     # Go API server  
make mailpit     # Email testing server

# Build for production
make build

# Run production build
make prod

# Clean build artifacts
make clean

# Run tests
make test

# Show all available commands
make help
```

## Configuration

**Environment Variables:**
Create `backend/.env`:
```bash
# Server
PORT=8080

# Email Provider (mailpit for dev, brevo for production)
MAIL_PROVIDER=mailpit
BREVO_API_KEY=your_brevo_api_key_here
FROM_EMAIL=anshuman@biswas.me
TO_EMAIL=anshuman@biswas.me

# reCAPTCHA
RECAPTCHA_SECRET_KEY=your_recaptcha_secret_key_here

# Mailpit (development)
MAILPIT_SMTP_HOST=localhost
MAILPIT_SMTP_PORT=1025
```

**Email Provider Setup:**
Switch between email providers easily:
```bash
# For development (local testing)
./switch-email-provider.sh mailpit

# For production (real emails via Brevo)
./switch-email-provider.sh brevo
```

**reCAPTCHA Setup:**
1. Get keys from [Google reCAPTCHA](https://www.google.com/recaptcha/)
2. Update `config/env.config.ts` with your site key
3. Set `RECAPTCHA_SECRET_KEY` in backend environment

## Services

**Frontend (Next.js):**
- Development: http://localhost:3000
- Hot reload enabled
- TypeScript + Tailwind CSS
- PDF resume viewer
- Smooth scrolling navigation

**Backend (Go):**
- Development: http://localhost:8080
- SQLite database (in-memory for dev)
- reCAPTCHA verification
- CORS enabled for localhost:3000
- Email sending via SMTP

**Mailpit (Email Testing):**
- Web UI: http://localhost:8025
- SMTP: localhost:1025
- Catches all emails sent by backend
- No external email services needed for development

## API Endpoints

**Backend API:**
```bash
GET  /health                 # Health check
POST /ajax/message.php       # Contact form submission
```

**Contact Form Data:**
```json
{
  "name": "string",
  "email": "string", 
  "message": "string",
  "g-recaptcha-response": "string"
}
```

## Project Structure

```
├── app/                 # Next.js app directory (routes)
├── components/          # Reusable UI components
├── config/             # Configuration files
├── hooks/              # Custom React hooks
├── lib/                # Utility functions
├── public/             # Static assets (resume PDF, etc)
├── styles/             # Global styles
├── backend/            # Go backend server
│   ├── main.go         # Main server file
│   ├── go.mod          # Go dependencies
│   └── messages.db     # SQLite database (created automatically)
├── migrations/         # Database migration files
├── Makefile           # Development commands
└── backup/             # Backup of original project files
```

## Troubleshooting

**Port conflicts:**
```bash
# Check what's using ports
lsof -i :3000  # Frontend
lsof -i :8080  # Backend  
lsof -i :8025  # Mailpit web
lsof -i :1025  # Mailpit SMTP
```

**Database issues:**
```bash
# Reset database
rm backend/messages.db
# Restart backend to recreate
```

**Missing dependencies:**
```bash
# Reinstall everything
make clean
make install
```

**Email not working:**
1. Ensure mailpit is running on :1025
2. Check backend logs for SMTP errors
3. Verify mailpit web UI at :8025

---

## Production Deployment

1. Build the application: `make build`
2. Configure environment variables
3. Set up proper SMTP server (not mailpit)
4. Deploy frontend static files
5. Run Go backend binary

## License

Personal portfolio project by Anshuman Biswas.