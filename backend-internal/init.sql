CREATE USER keycloak WITH PASSWORD 'keycloak';
CREATE USER exchange WITH PASSWORD 'exchange';
CREATE SCHEMA keycloak;
CREATE SCHEMA exchange;
GRANT ALL PRIVILEGES ON SCHEMA keycloak TO keycloak;
GRANT ALL PRIVILEGES ON SCHEMA exchange TO exchange;
