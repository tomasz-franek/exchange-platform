# Keycloak configuration

## Admin console login

http://localhost:8081

## Self registration url

http://localhost:8081/realms/exchange-realm/account

## Keycloak configuration

* Realm `exchange-realm`
* Roles:
    - `ADMIN`
    - `EXCHANGE_CLIENT`
* Admin:
    - login `system-admin` password `password`
* Clients:
    - login `exchange-client1` password `password`
    - login `exchange-client2` password `password`
* registration of new clients allowed