#!/bin/bash

# Script to switch email providers for biswas.me
# Usage: ./switch-email-provider.sh [mailpit|brevo]

PROVIDER=${1:-mailpit}
ENV_FILE="backend/.env"

if [ ! -f "$ENV_FILE" ]; then
    echo "Error: $ENV_FILE not found"
    echo "Creating from .env.example..."
    cp backend/.env.example "$ENV_FILE"
fi

case $PROVIDER in
    "mailpit")
        echo "Switching to Mailpit (development) email provider..."
        sed -i '' 's/MAIL_PROVIDER=.*/MAIL_PROVIDER=mailpit/' "$ENV_FILE"
        echo "✅ Email provider set to Mailpit"
        echo "📧 Emails will be sent to Mailpit at http://localhost:8025"
        echo "🔧 Make sure Mailpit is running: mailpit --smtp=localhost:1025 --listen=localhost:8025"
        ;;
    "brevo")
        echo "Switching to Brevo (production) email provider..."
        sed -i '' 's/MAIL_PROVIDER=.*/MAIL_PROVIDER=brevo/' "$ENV_FILE"
        echo "✅ Email provider set to Brevo"
        echo "📧 Emails will be sent via Brevo API"
        echo "🔑 Make sure BREVO_API_KEY is set in $ENV_FILE"
        ;;
    *)
        echo "Usage: $0 [mailpit|brevo]"
        echo ""
        echo "Available providers:"
        echo "  mailpit - Local email testing (development)"
        echo "  brevo   - Production email service"
        echo ""
        echo "Current provider:"
        grep MAIL_PROVIDER "$ENV_FILE" || echo "  Not set (defaults to mailpit)"
        exit 1
        ;;
esac

echo ""
echo "🔄 Restart the backend server to apply changes:"
echo "   cd backend && PORT=8080 go run main.go"