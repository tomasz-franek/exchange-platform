# Fee Calculation Strategies

Fee calculation strategies refer to the various methods and approaches used to determine the fees
charged for exchange process.

## 1. NoFeeStrategy ( default strategy )

### Description

The `NoFeeStrategy` class implements a fee calculation strategy that charges no fee at all. This
strategy is ideal for scenarios where no fees should be applied to transactions.

### Formula

The fee is calculated as:

$\text{Fee} = \text{0}$

### Example

When using `NoFeeStrategy`, calling the `calculateFee` method will always return 0, regardless of
the transaction amount.

## 2. Flat Fee Strategy

### Description

The `FlatFeeStrategy` class implements a fee calculation strategy that charges a fixed amount as a
fee. This strategy is useful when a consistent fee is desired, regardless of the transaction amount.

### Formula

The fee is calculated as:

$\text{Fee} = \text{flatFeeAmount}$

### Example

If a `FlatFeeStrategy` is initialized with a flat fee of 100, calling the `calculateFee` method will
always return 100, regardless of the amount.

## 3. PercentageFeeStrategy

### Description

The `PercentageFeeStrategy` class implements a fee calculation strategy that charges a fee based on
a percentage of the amount. This strategy is useful for scenarios where fees are proportional to the
transaction amount.

### Formula

The fee is calculated as:

$\text{Fee} = \frac{\text{amount} * \text{percentageFee}}{100}$

### Example

If a `PercentageFeeStrategy` is initialized with a percentage fee of 1% and the amount
is 200, the result will be 2 (which is 1% of 200).
