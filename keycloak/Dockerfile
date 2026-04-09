FROM quay.io/keycloak/keycloak:latest

COPY resources/realm.json /opt/keycloak/data/import/realm.json
RUN mkdir /opt/keycloak/themes/exchange
COPY resources/exchange/ /opt/keycloak/themes/exchange/

CMD ["start-dev", "--import-realm", "--http-port=8050"]
#start with debug
#CMD ["start-dev", "--log-level=org.keycloak:debug", "--import-realm", "--http-port=8050"]