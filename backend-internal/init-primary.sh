#!/bin/bash
set -e

echo "[Exchange] Creating replication user '${RO_USER}' ..."

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

echo "[Exchange] Creating exchange user '${EXCHANGE_DB_USERNAME}'..."

psql -v ON_ERROR_STOP=1 --username "$POSTGRES_USER" --dbname "$POSTGRES_DB" <<-EOSQL
    -- Create exchange user
    DO \$\$
    BEGIN

        IF NOT EXISTS (SELECT 1 FROM pg_user WHERE usename='${EXCHANGE_DB_USERNAME}') THEN
          CREATE USER ${EXCHANGE_DB_USERNAME} WITH PASSWORD '${EXCHANGE_DB_PASSWORD}';
        END IF;
        IF NOT EXISTS (SELECT 1 FROM information_schema.schemata WHERE schema_name = '${EXCHANGE_DB_SCHEMA}') THEN
          CREATE SCHEMA ${EXCHANGE_DB_SCHEMA};
        END IF;


        GRANT ALL PRIVILEGES ON SCHEMA ${EXCHANGE_DB_SCHEMA} TO ${EXCHANGE_DB_USERNAME};
    END
    \$\$;
EOSQL
    echo "[Exchange] Creating keycloak user '${KEYCLOAK_DB_USERNAME}' ..."


    psql -v ON_ERROR_STOP=1 --username "$POSTGRES_USER" --dbname "$POSTGRES_DB" <<-EOSQL
    -- Create keycloak user
    DO \$\$
    BEGIN
      IF NOT EXISTS (SELECT 1 FROM pg_user WHERE usename='${KEYCLOAK_DB_USERNAME}') THEN
        CREATE USER ${KEYCLOAK_DB_USERNAME} WITH PASSWORD '${KEYCLOAK_DB_PASSWORD}';
      END IF;
      IF NOT EXISTS (SELECT 1 FROM information_schema.schemata WHERE schema_name = '${KEYCLOAK_DB_SCHEMA}') THEN
        CREATE SCHEMA ${KEYCLOAK_DB_SCHEMA};
      END IF;
      GRANT ALL PRIVILEGES ON SCHEMA ${KEYCLOAK_DB_SCHEMA} TO ${KEYCLOAK_DB_USERNAME};
    END
    \$\$;
EOSQL

    echo "[Exchange] Creating replication slot '${RO_SLOT}' ..."

psql -v ON_ERROR_STOP=1 --username "$POSTGRES_USER" --dbname "$POSTGRES_DB" <<-EOSQL
-- Create keycloak user

    -- Create replication slot for exchange-db-ro-slot
     SELECT pg_create_physical_replication_slot('${RO_SLOT}');
    
    -- Grant necessary permissions
     GRANT CONNECT ON DATABASE $POSTGRES_DB TO ${RO_USER};
EOSQL

echo "[Exchange] Replication setup complete."