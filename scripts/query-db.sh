#!/bin/bash

# SQLite Database Query Script for biswas.me
# Usage: ./scripts/query-db.sh [local|remote] [query]

set -e

# Colors for output
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

print_help() {
    echo "Usage: $0 [local|remote] [query]"
    echo ""
    echo "Examples:"
    echo "  $0 local                     # Query local database"
    echo "  $0 remote                    # Query remote database"
    echo "  $0 local \"SELECT COUNT(*) FROM messages;\""
    echo "  $0 remote \"SELECT * FROM messages ORDER BY created_at DESC LIMIT 5;\""
    echo ""
    echo "Common queries:"
    echo "  SELECT * FROM email ORDER BY date DESC LIMIT 10;"
    echo "  SELECT COUNT(*) FROM email;"
    echo "  SELECT name, email, date FROM email ORDER BY date DESC;"
    echo "  SELECT * FROM email WHERE email LIKE '%@gmail.com%';"
}

if [ "$1" = "--help" ] || [ "$1" = "-h" ]; then
    print_help
    exit 0
fi

# Determine environment
ENV=${1:-local}
QUERY=${2:-"SELECT * FROM email ORDER BY date DESC LIMIT 10;"}

case $ENV in
    local)
        DB_PATH="./backend/messages.db"
        if [ ! -f "$DB_PATH" ]; then
            echo -e "${YELLOW}Warning: Local database not found at $DB_PATH${NC}"
            echo "Run the backend server first to create the database."
            exit 1
        fi
        echo -e "${BLUE}Querying local database: $DB_PATH${NC}"
        sqlite3 -header -column "$DB_PATH" "$QUERY"
        ;;
    remote)
        echo -e "${BLUE}Querying remote database...${NC}"
        ssh ubuntu@biswas.me "cd /home/ubuntu/projects/biswas.me && docker-compose exec -T portfolio sqlite3 -header -column /app/backend/messages.db \"$QUERY\""
        ;;
    *)
        echo "Invalid environment: $ENV"
        echo "Use 'local' or 'remote'"
        print_help
        exit 1
        ;;
esac