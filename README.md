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

## Contribute

Pull Requests are welcome. For significant changes, please open an issue first to discuss what you
would like to change. Make sure to update tests as appropriate.
Please read our [Contribution Guidelines](/docs/project-contribution.md) for more information on how
to get involved.

## License

Exchange platform is licensed under a MIT license.