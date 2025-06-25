# Exchange platform

Currency exchange platform in market exchange model where user may submit their currency exchange
offers.

> [!IMPORTANT]
> Project is in a pre-alpha state, and only suitable for use by developers
>
>

## Technology Stack

- **Backend Services**: Java (v21), Spring Boot (v3.5.0)
- **Database**: PostgreSQL
- **Event Streaming Platform** Kafka + Zookeeper
- **Containerization & Orchestration**: Docker, Docker Compose
- **Identity and Access Management**: Keycloak
- **Frontend**: Angular (v19), TypeScript, NgRx library
- **Testing**:
    - JUnit (Java)
- **Other Tools**:
    - Liquibase (database migrations)
    - Prettier, ESLint (Frontend linting/formatting)

## Documentation

*[Developer guide](/docs/developer-guide.md)*.

*[Database structure](/docs/database.md)*.

## Quick Start

1. Clone the repository:

```bash
git clone https://github.com/tomasz-franek/exchange-platform.git
cd exchange-platform
```

2. Run with Docker Compose ( run the services in detached mode ) :

```bash
docker-compose up -d
# Or to rebuild:
docker-compose up --build -d
```

This command starts the following components:

* http://localhost:2400 - Client application

    - Created client users:
        - Login: **client1@exchange.com**, Password:  **password**
        - Login: **client2@exchange.com**, Password:  **password**
        - It is also possible to register a new user on the Keycloak login page.

* http://localhost:4100 - Admin application

    - Created admin users:
        - Login: **admin@exchange.com** Password:  **password**
        - It is also possible to promote a registered client login on the Keycloak admin after
          logging into the admin console.

* http://localhost:8081 - Keycloak admin console
    - Login: **admin** Password:  **admin**

## Contribute

Pull Requests are welcome. For significant changes, please open an issue first to discuss what you
would like to change. Make sure to update tests as appropriate.
Please read our [Contribution Guidelines](/docs/project-contribution.md) for more information on how
to get involved.

## License

Exchange platform is licensed under a MIT license.