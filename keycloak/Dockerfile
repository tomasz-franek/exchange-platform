FROM quay.io/keycloak/keycloak:latest

COPY resources/realm.json /opt/keycloak/data/import/realm.json

#CMD ["start-dev", "--import-realm", " --http-port=8081"]
#start with debug
CMD ["start-dev", "--log-level=org.keycloak:trace", "--import-realm"]