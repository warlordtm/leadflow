#!/bin/bash
# PostgreSQL Backup Script for Lead & Client Follow-Up CRM
# Creates a compressed backup of the database with timestamped filename.

set -e

BACKUP_DIR="${BACKUP_DIR:-$HOME/.postgres-backups}"
TIMESTAMP=$(date +%Y%m%d_%H%M%S)
DATABASE="${DATABASE:-leadcrm}"
PG_HOST="${PGHOST:-127.0.0.1}"
PG_PORT="${PGPORT:-5433}"
PG_USER="${PG_USER:-afit}"

mkdir -p "$BACKUP_DIR"

BACKUP_FILE="$BACKUP_DIR/leadcrm_backup_${TIMESTAMP}.sql.gz"

echo "Starting backup of database '$DATABASE' on port $PG_PORT..."

pg_dump -h "$PG_HOST" -p "$PG_PORT" -U "$PG_USER" "$DATABASE" | gzip > "$BACKUP_FILE"

echo "Backup completed: $BACKUP_FILE"
echo "Backup size: $(du -h "$BACKUP_FILE" | cut -f1)"

# Retention: keep last 7 days of backups
find "$BACKUP_DIR" -name "leadcrm_backup_*.sql.gz" -mtime +7 -delete 2>/dev/null || true
echo "Old backups cleaned up (retention: 7 days)"
