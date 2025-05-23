```mermaid
stateDiagram-v2
    [*] --> UserAccount: 1.DEPOSIT(+)
    UserAccount --> ExchangeSystem: 2.EXCHANGE(-)
    ExchangeSystem --> UserAccount: 3.DEPOSIT(+)
    UserAccount --> SystemAccount: FEE(-)
    UserAccount --> [*]: WITHDRAW(-)
    SystemAccount --> UserAccount: CORRECTION(+)
    UserAccount --> SystemAccount: CORRECTION(-)
```

## Requirements

1. **Partial Exchange Allowed**
    - Users should have the option to cancel their order after partial exchanges. This feature
      enhances flexibility for users, allowing them to manage their funds more effectively.

2. **Fees Paid After Full Exchange or When Exchange is Canceled**
    - Fees associated with the exchange should only be charged after the full exchange is completed
      or if the exchange is canceled by the user. Users should not be penalized for initiating an
      exchange that they later decide to cancel.

3. **Fees for Canceled Exchange Calculated for Exchanged Part**  <span style="color:red">Not
   implemented yet</span>.
    - In the event of a canceled exchange, the fees should be calculated only for the portion of the
      exchange that has already been processed. Users will only be charged for the services they
      have utilized, maintaining fairness in the fee structure.

4. **Fee Paid with Destination Currency** <span style="color:red">Not implemented yet</span>.
    - All fees incurred during the exchange process should be paid using the destination currency.

5. **Fees Are Optional and Configurable** <span style="color:red">Not implemented yet</span>.
    - Fees associated with the exchange should be optional and configurable by the system
      administrator. This flexibility allows users to choose whether to apply fees based on their
      preferences or specific conditions, enhancing user satisfaction and adaptability to different
      market scenarios.

# Events generated for the specific operations

Financial Events in the system for the specific operations

## Deposit ( without fees )

| Account            |               Value                | Currency | Event Type |
|--------------------|:----------------------------------:|----------|------------|
| User A account EUR | <span style="color:green">+ 100.00 | EUR      | DEPOSIT    |

## Deposit ( with fees )

| Account              |               Value                | Currency | Event Type |
|----------------------|:----------------------------------:|----------|------------|
| User A account EUR   | <span style="color:green">+ 100.00 | EUR      | DEPOSIT    |
| Exchange account EUR |   <span style="color:red">- 0.10   | EUR      | FEE        |

## Exchange Request

| Account              |               Value                | Currency | Event Type | Ratio |
|----------------------|:----------------------------------:|----------|------------|-------|
| User A account EUR   | <span style="color:red"> - 100.00  | EUR      | EXCHANGE   | 1.3   |
| Exchange account EUR | <span style="color:green">+ 100.00 | EUR      | DEPOSIT    | 1.3   |

## Cancel Full Exchange Request

| Account              |               Value                | Currency | Event Type |
|----------------------|:----------------------------------:|----------|------------|
| Exchange account EUR |  <span style="color:red">- 100.00  | EUR      | WITHDRAW   |
| User A account EUR   | <span style="color:green">+ 100.00 | EUR      | DEPOSIT    |

## Full Exchange Result

_Before exchange_

| Account              |               Value                | Currency | Event Type | Ratio |
|----------------------|:----------------------------------:|----------|------------|:-----:|
| User A   account EUR |  <span style="color:red">- 123.00  | EUR      | EXCHANGE   | 1.23  |
| Exchange account EUR | <span style="color:green">+ 123.00 | EUR      | DEPOSIT    | 1.23  |
| User B   account USD |  <span style="color:red">- 100.00  | USD      | EXCHANGE   | 1.23  |
| Exchange account USD | <span style="color:green">+ 100.00 | USD      | DEPOSIT    | 1.23  |

**{EXCHANGE OPERATION between EUR and USD with ratio 1.23, after exchange fees calculated for User A
and B }**

_After exchange_

| Account              |               Value                | Currency | Event Type | Ratio |
|----------------------|:----------------------------------:|----------|------------|:-----:|
| Exchange account USD |  <span style="color:red">- 100.00  | USD      | WITHDRAW   |       |
| User A account USD   | <span style="color:green">+ 100.00 | USD      | DEPOSIT    | 1.23  |
| User A account USD   |   <span style="color:red">- 0.10   | USD      | FEE        |       |
| Exchange account EUR |  <span style="color:red">- 123.00  | EUR      | WITHDRAW   |       |
| User B account EUR   | <span style="color:green">+ 123.00 | EUR      | DEPOSIT    | 1.23  |
| System account EUR   |   <span style="color:red">- 0.10   | EUR      | FEE        |       |

## Full Exchange Result With Different Rates

_Before exchange_

| Account              |               Value                | Currency | Event Type | Ratio |
|----------------------|:----------------------------------:|----------|------------|:-----:|
| User A   account EUR |  <span style="color:red">- 123.00  | EUR      | EXCHANGE   | 1.23  |
| Exchange account EUR | <span style="color:green">+ 123.00 | EUR      | DEPOSIT    | 1.23  |
| User B   account USD |  <span style="color:red">- 50.00   | USD      | EXCHANGE   | 1.23  |
| Exchange account USD | <span style="color:green">+ 50.00  | USD      | DEPOSIT    | 1.23  |
| User C   account USD |  <span style="color:red">- 50.00   | USD      | EXCHANGE   | 1.20  |
| Exchange account USD | <span style="color:green">+ 50.00  | USD      | DEPOSIT    | 1.20  |

**{EXCHANGE OPERATION between EUR and USD with ratio 1.23 for 50 USD and ratio 1.20 for 50 USD,
after exchange fees
calculated for B and C, left 1.5 EUR for
user A }**

_After exchange_

| Account                          |               Value                | Currency | Event Type | Ratio |
|----------------------------------|:----------------------------------:|----------|------------|:-----:|
| Exchange account USD             |  <span style="color:red">- 100.00  | USD      | WITHDRAW   |       |
| User A account USD               | <span style="color:green">+ 100.00 | USD      | DEPOSIT    | 1.23  |
| Exchange account EUR             |  <span style="color:red">- 61.50   | EUR      | WITHDRAW   |       |
| User B account EUR               | <span style="color:green">+ 61.50  | EUR      | DEPOSIT    | 1.23  |
| System account EUR ( for user B) |   <span style="color:red">- 0.05   | EUR      | FEE        |       |
| Exchange account EUR             |  <span style="color:red">- 60.00   | EUR      | WITHDRAW   |       |
| User C account EUR               | <span style="color:green">+ 60.00  | EUR      | DEPOSIT    | 1.20  |
| System account EUR ( for user C) |   <span style="color:red">- 0.05   | EUR      | FEE        |       |

## Full Exchange Result

_Before exchange_

| Account              |               Value                | Currency | Event Type | Ratio |
|----------------------|:----------------------------------:|----------|------------|:-----:|
| User A   account EUR |  <span style="color:red">- 123.00  | EUR      | EXCHANGE   | 1.23  |
| Exchange account EUR | <span style="color:green">+ 123.00 | EUR      | DEPOSIT    | 1.23  |
| User B   account USD |  <span style="color:red">- 100.00  | USD      | EXCHANGE   | 1.23  |
| Exchange account USD | <span style="color:green">+ 100.00 | USD      | DEPOSIT    | 1.23  |

**{EXCHANGE OPERATION between EUR and USD with ratio 1.23, after exchange fees calculated for User A
and B }**

_After exchange_

| Account              |               Value                | Currency | Event Type | Ratio |
|----------------------|:----------------------------------:|----------|------------|:-----:|
| Exchange account USD |  <span style="color:red">- 100.00  | USD      | WITHDRAW   |       |
| User A account USD   | <span style="color:green">+ 100.00 | USD      | DEPOSIT    | 1.23  |
| User A account USD   |   <span style="color:red">- 0.10   | USD      | FEE        |       |
| Exchange account EUR |  <span style="color:red">- 123.00  | EUR      | WITHDRAW   |       |
| User B account EUR   | <span style="color:green">+ 123.00 | EUR      | DEPOSIT    | 1.23  |
| System account EUR   |   <span style="color:red">- 0.10   | EUR      | FEE        |       |

## Partial Exchange

_Before exchange_

| Account              |               Value                | Currency | Event Type | Ratio |
|----------------------|:----------------------------------:|----------|------------|:-----:|
| User A   account EUR |  <span style="color:red">- 123.00  | EUR      | EXCHANGE   | 1.23  |
| Exchange account EUR | <span style="color:green">+ 123.00 | EUR      | DEPOSIT    | 1.23  |
| User B   account USD |  <span style="color:red">- 10.00   | USD      | EXCHANGE   | 1.23  |
| Exchange account USD | <span style="color:green">+ 10.00  | USD      | DEPOSIT    | 1.23  |

**{PARTIAL EXCHANGE between EUR and USD with ratio 1.23, fees calculated only for user B, fees for
user A will
be calculated after full exchange or after cancel partial exchange}**

_After exchange_

| Account              |               Value               | Currency | Event Type | Ratio |
|----------------------|:---------------------------------:|----------|------------|:-----:|
| Exchange account USD |  <span style="color:red">- 10.00  | USD      | WITHDRAW   |       |
| User A account USD   | <span style="color:green">+ 10.00 | USD      | DEPOSIT    | 1.23  |
| Exchange account EUR |  <span style="color:red">- 12.30  | EUR      | WITHDRAW   |       |
| User B account EUR   | <span style="color:green">+ 12.30 | EUR      | DEPOSIT    | 1.23  |
| System account EUR   |  <span style="color:red">- 0.10   | EUR      | FEE        |       |

## Cancel Partial Exchange

_Before exchange_

| Account              |               Value                | Currency | Event Type | Ratio |
|----------------------|:----------------------------------:|----------|------------|:-----:|
| User A   account EUR |  <span style="color:red">- 123.00  | EUR      | EXCHANGE   | 1.23  |
| Exchange account EUR | <span style="color:green">+ 123.00 | EUR      | DEPOSIT    | 1.23  |
| User B   account USD |  <span style="color:red">- 10.00   | USD      | EXCHANGE   | 1.23  |
| Exchange account USD | <span style="color:green">+ 10.00  | USD      | DEPOSIT    | 1.23  |

**{PARTIAL EXCHANGE between EUR and USD with ratio 1.23, full Fee calculated for exchange for User
B}**

_After exchange_

| Account              |               Value               | Currency | Event Type | Ratio |
|----------------------|:---------------------------------:|----------|------------|:-----:|
| Exchange account USD |  <span style="color:red">- 10.00  | USD      | WITHDRAW   |       |
| User A account USD   | <span style="color:green">+ 10.00 | USD      | DEPOSIT    | 1.23  |
| Exchange account EUR |  <span style="color:red">- 12.30  | EUR      | WITHDRAW   |       |
| User B account EUR   | <span style="color:green">+ 12.30 | EUR      | DEPOSIT    | 1.23  |
| User A account USD   |  <span style="color:red">- 0.10   | EUR      | FEE        |       |

**{CANCEL Exchange for User A, rest EUR move Back to User A EUR account, fee for user A calculated
for USD}**

_After cancelling exchange_

| Account              |               Value               | Currency | Event Type | Ratio |
|----------------------|:---------------------------------:|----------|------------|:-----:|
| Exchange account EUR |  <span style="color:red">- 110.7  | EUR      | WITHDRAW   |       |
| User A account EUR   | <span style="color:green">+ 110.7 | EUR      | DEPOSIT    | 1.23  |
| User A account USD   |  <span style="color:red">- 0.10   | USD      | FEE        |       |

## Withdraw ( without fees )

| Account            |              Value               | Currency | Event Type |
|--------------------|:--------------------------------:|----------|------------|
| User A account EUR | <span style="color:red">- 100.00 | EUR      | WITHDRAW   |

## Withdraw ( with fees )

| Account            |              Value              | Currency | Event Type |
|--------------------|:-------------------------------:|----------|------------|
| User A account EUR | <span style="color:red">- 99.90 | EUR      | WITHDRAW   |
| User A account EUR | <span style="color:red">- 0.10  | EUR      | FEE        |

## Correction from User Account to System Account

| Account            |              Value               | Currency | Event Type | Message                  |
|--------------------|:--------------------------------:|----------|------------|--------------------------|
| User A account EUR | <span style="color:red">- 100.00 | EUR      | CORRECTION | Incorrectly charged fees |

## Correction from System Account to User Account

| Account            |               Value                | Currency | Event Type | Message                  |
|--------------------|:----------------------------------:|----------|------------|--------------------------|
| User A account EUR | <span style="color:green">+ 100.00 | EUR      | CORRECTION | Incorrectly charged fees |
