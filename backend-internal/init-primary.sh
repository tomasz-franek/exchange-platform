#!/bin/bash
set -e

echo "[Exchange] Creating replication user..."

psql -v ON_ERROR_STOP=1 --username "$POSTGRES_USER" --dbname "$POSTGRES_DB" <<-EOSQL
    -- Create replication role
    DO \$\$
    BEGIN
        IF NOT EXISTS (SELECT FROM pg_roles WHERE rolname = '${RO_USER}') THEN
            CREATE ROLE ${RO_USER} WITH REPLICATION LOGIN PASSWORD '${RO_PASSWORD}';
        END IF;
    END
    \$\$;
EOSQL
echo "[Exchange] Creating exchange user..."


psql -v ON_ERROR_STOP=1 --username "$POSTGRES_USER" --dbname "$POSTGRES_DB" <<-EOSQL
    -- Create exchange user
    DO \$\$
    BEGIN

        IF NOT EXISTS (SELECT 1 FROM pg_user WHERE usename='exchange') THEN
          CREATE USER exchange WITH PASSWORD 'exchange';
        END IF;
        IF NOT EXISTS (SELECT 1 FROM information_schema.schemata WHERE schema_name = 'exchange') THEN
          CREATE SCHEMA exchange;
        END IF;


        GRANT ALL PRIVILEGES ON SCHEMA exchange TO exchange;
    END
    \$\$;
EOSQL
    echo "[Exchange] Creating keycloak user..."


    psql -v ON_ERROR_STOP=1 --username "$POSTGRES_USER" --dbname "$POSTGRES_DB" <<-EOSQL
    -- Create keycloak user
    DO \$\$
    BEGIN
      IF NOT EXISTS (SELECT 1 FROM pg_user WHERE usename='keycloak') THEN
        CREATE USER keycloak WITH PASSWORD 'keycloak';
      END IF;
      IF NOT EXISTS (SELECT 1 FROM information_schema.schemata WHERE schema_name = 'keycloak') THEN
        CREATE SCHEMA keycloak;
      END IF;
      GRANT ALL PRIVILEGES ON SCHEMA keycloak TO keycloak;
    END
    \$\$;
EOSQL

    echo "[Exchange] Creating replication slot exchange-db-ro-slot ..."

psql -v ON_ERROR_STOP=1 --username "$POSTGRES_USER" --dbname "$POSTGRES_DB" <<-EOSQL
-- Create keycloak user

    -- Create replication slot for exchange-db-ro-slot
     SELECT pg_create_physical_replication_slot('exchange_db_ro_slot');
    
    -- Grant necessary permissions
     GRANT CONNECT ON DATABASE $POSTGRES_DB TO ${RO_USER};
EOSQL

echo "[Exchange] Replication setup complete."