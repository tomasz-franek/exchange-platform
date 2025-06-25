# Exchange system topics

All topics created are listed in [docker-compose.yml](../docker-compose.yml) in service `init-kafka`

### Example request:

```json
{
  "pair": "EUR_GBP",
  "direction": "BUY",
  "userId": 1,
  "userAccountId": 1,
  "value": 100,
  "ratio": 1.1800
}
```

# deposit topic

### Example request:

```json
{
  "currency": "EUR",
  "userId": 1,
  "amount": 100
}
```

# withdraw topic
