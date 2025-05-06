# input-record topic

Create topic

```bash
bin/kafka-topics.sh --create --topic input-record --bootstrap-server localhost:9092
bin/kafka-topics.sh --create --topic deposit --bootstrap-server localhost:9092
bin/kafka-topics.sh --create --topic withdraw --bootstrap-server localhost:9092
bin/kafka-topics.sh --create --topic transaction-record --bootstrap-server localhost:9092
bin/kafka-topics.sh --create --topic exchange-record --bootstrap-server localhost:9092
bin/kafka-topics.sh --create --topic log --bootstrap-server localhost:9092
```

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

### Example request:

```json
{
  "currency": "EUR",
  "userId": 1,
  "amount": 100
}
```

# transaction-record topic

### Example request:

```json
{
}
```

# exchange-record topic

### Example request:

```json
{
}
```

# log topic

### Example request:

```json
{
}
```