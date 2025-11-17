import {UserProperty} from '../app/api/model/userProperty';
import {BuildInfo} from '../app/api/model/buildInfo';
import {CurrencyStatisticResponse} from '../app/api/model/currencyStatisticResponse';
import {PairStatisticResponse} from '../app/api/model/pairStatisticResponse';
import {Address} from '../app/api/model/address';
import {StrategyData} from '../app/properties/services/strategy.data';
import {UsersStatisticResponse} from '../app/api/model/usersStatisticResponse';
import {ErrorMessage} from '../app/api/model/errorMessage';

export const mockPropertyStore = {
  loadTimezoneList(): string[] {
    return [];
  },
  loadUnicodeLocalesList(): string[] {
    return [];
  },
  loadSystemCurrencyList(): string[] {
    return [];
  },
  systemCurrencyList(): string[] {
    return [];
  },
  userProperty(): UserProperty {
    return {} as UserProperty;
  },
  getUserProperty(): UserProperty {
    return {} as UserProperty;
  },
  locales(): string[] {
    return [];
  },
  timezones(): string[] {
    return [];
  },
  getUserAddress(): string[] {
    return [];
  },
  userAddress(): Address | null {
    return {} as Address;
  },
  loadActuatorStrategyData(): string[] {
    return [];
  },
  strategyData(): StrategyData | null {
    return null;
  }
};

export const mockBuildInfoStore = {
  loadBuildInfo(): BuildInfo {
    return {} as BuildInfo;
  },
  buildInfo(): BuildInfo {
    return {} as BuildInfo;
  }
}

export const mockReportStore = {
  loadErrorList(): string[] {
    return [];
  },
  errorMessageList(): ErrorMessage[] {
    return [];
  }
}

export const mockStatisticStore = {
  loadCurrencyStatistics(): string[] {
    return [];
  },
  loadPairStatistics(): string[] {
    return [];
  },
  currencyStatisticResponse(): CurrencyStatisticResponse | null {
    return null;
  },
  pairStatisticResponse(): PairStatisticResponse | null {
    return null;
  },
  loadUserStatistic(): string[] {
    return [];
  },
  usersStatisticResponse(): UsersStatisticResponse | null {
    return null;
  }
}

export const mockTransactionsStore = {
  loadSystemAccountTransactionList(): string[] {
    return [];
  },
  systemTransactions(): string[] {
    return []
  },
  loadExchangeAccountTransactionList(): string[] {
    return [];
  },
  exchangeTransactions(): string[] {
    return [];
  }
}

export const mockMonitoringStore = {
  loadActuatorAdminHealthCheck(): string[] {
    return [];
  },
  loadActuatorInternalHealthCheck(): string[] {
    return [];
  },
  loadActuatorExternalHealthCheck(): string[] {
    return [];
  },
  adminHealthCheck(): object {
    return {};
  },
  internalHealthCheck(): object {
    return {};
  },
  externalHealthCheck(): object {
    return {};
  }

}
