# Exchange database

## Recreate exchange schema

If you want to recreate database use this script to drop/create schema and then start Exchange
Backend External application to execute Liquibase scripts.

```shell
DROP SCHEMA exchange CASCADE;
CREATE SCHEMA exchange;
GRANT ALL PRIVILEGES ON SCHEMA exchange TO exchange;
```

## Database schema

```mermaid
erDiagram
    User {
        id UUID(PK)
        name varchar(100)
    }

    UserAccount {
        id UUID(PK)
        user_id UUID(FK)
        currency VARCHAR(3)
    }

    ExchangeEvent {
        id BIGINT(PK)
        pair VARCHAR(6)
        direction VARCHAR(1)
        date_utc DATETIME
        event_type VARCHAR(1)
        user_account_id UUID(FK)
        value NUMBER
        ratio NUMBER
    }

    ExchangeEventSource {
        id BIGINT(PK)
        user_account_id UUID(FK)
        date_utc DATETIME
        event_type VARCHAR(1)
        value NUMBER
    }

    SystemSnapshot {
        id BIGINT(PK)
        date_utc DATETIME
        last_event_source_id BIGINT(FK)
    }

    SnapshotData {
        system_snapshot_id BIGINT(PK)(FK)
        user_account_id UUID(PK)(FK)
        value NUMBER
    }

    User ||--|{ UserAccount: has
    UserAccount ||--o{ ExchangeEvent: list
    UserAccount ||--o{ ExchangeEventSource: generate
    SystemSnapshot ||--o| ExchangeEventSource: based_on
    SystemSnapshot ||--o{ SnapshotData: presents

```