#!/bin/bash
# Starts a local PostgreSQL instance on port 5433 for the Lead CRM app.
# Uses trust authentication for local connections.

PG_BIN=/usr/lib/postgresql/14/bin
PGDATA=$HOME/.postgres-data
PGLOG=$HOME/.postgres-log
PGPORT=5433
PGSOCKET=/tmp/pgsocket

if [ -d "$PGDATA" ]; then
  echo "Starting PostgreSQL on port $PGPORT..."
  mkdir -p "$PGSOCKET"
  chmod 777 "$PGSOCKET"
  $PG_BIN/pg_ctl -D "$PGDATA" -l "$PGLOG" \
    -o "-p $PGPORT -c listen_addresses='127.0.0.1' -c unix_socket_directories='$PGSOCKET'" \
    start 2>&1
  sleep 2
  pg_isready -h 127.0.0.1 -p $PGPORT && echo "PostgreSQL is running on port $PGPORT" || echo "Failed to start PostgreSQL"
else
  echo "Initializing PostgreSQL data directory..."
  mkdir -p "$PGDATA"
  chmod 700 "$PGDATA"
  mkdir -p "$PGSOCKET"
  chmod 777 "$PGSOCKET"
  $PG_BIN/initdb -D "$PGDATA" -U postgres --auth=trust 2>&1
  echo "Starting PostgreSQL on port $PGPORT..."
  $PG_BIN/pg_ctl -D "$PGDATA" -l "$PGLOG" \
    -o "-p $PGPORT -c listen_addresses='127.0.0.1' -c unix_socket_directories='$PGSOCKET'" \
    start 2>&1
  sleep 2
  pg_isready -h 127.0.0.1 -p $PGPORT && echo "PostgreSQL is running on port $PGPORT" || echo "Failed to start PostgreSQL"
  echo "Creating role and databases..."
  psql -h 127.0.0.1 -p $PGPORT -U postgres -d postgres -c "CREATE ROLE afit WITH LOGIN PASSWORD 'afitpass' SUPERUSER;" 2>/dev/null || true
  psql -h 127.0.0.1 -p $PGPORT -U postgres -d postgres -c "CREATE DATABASE leadcrm OWNER afit;" 2>/dev/null || true
  psql -h 127.0.0.1 -p $PGPORT -U postgres -d postgres -c "CREATE DATABASE leadcrm_test OWNER afit;" 2>/dev/null || true
  echo "Done. Run 'npx prisma db push' to set up the database schema."
fi
