FROM quay.io/keycloak/keycloak:26.2

COPY resources/realm.json /opt/keycloak/data/import/realm.json

CMD ["start-dev", "--import-realm", " --http-port=8081"]

#CMD ["start-dev", "--log-level=org.keycloak:debug", "--import-realm", " --http-port=8081"]