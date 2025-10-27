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
    Address {
        id UUID(PK)
        user_id UUID(FK)
        name VARCHAR(500)
        country VARCHAR(2)
        street VARCHAR(70)
        city VARCHAR(70)
    }
    ExchangeUser {
        id UUID(PK)
        name VARCHAR(100)
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

    UserBankAccount {
        id UUID(PK)
        user_account_id UUID(FK)
        account_number VARCHAR(50)
        country VARCHAR(2)
        created_date_utc DATETIME
        verified_date_utc DATETIME
    }
    UserPriority {
        user_id UUID(FK)
        unicode_locale VARCHAR(5)
        language VARCHAR(5)
        timezone VARCHAR(30)
    }

    ExchangeUser ||--o{ Address: has
    ExchangeUser ||--|{ UserAccount: has
    ExchangeUser ||--o{ UserPriority: define
    UserAccount ||--o{ UserBankAccount: has_real
    UserAccount ||--o{ ExchangeEvent: list
    UserAccount ||--o{ ExchangeEventSource: generate
    SystemSnapshot ||--|{ ExchangeEventSource: based_on
    SystemSnapshot ||--|{ SnapshotData: presents

```