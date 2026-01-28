import { UserProperty } from '../app/api/model/userProperty';
import { Address } from '../app/api/model/address';
import { BuildInfo } from '../app/api/model/buildInfo';

export const mockPropertyStore = {
  loadTimezoneList(): string[] {
    return [];
  },
  loadUnicodeLocalesList(): string[] {
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
    return null;
  },
  loadSystemCurrencyList(): string[] {
    return [];
  },
  ticketId(): string[] {
    return [];
  },
};

export const mockAccountsStore = {
  loadAccountBalanceList(): string[] {
    return [];
  },
  accountBalanceList(): string[] {
    return [];
  },
  userBankAccounts(): string[] {
    return [];
  },
  loadUserOperationList(): string[] {
    return [];
  },
  userOperationList(): string[] {
    return [];
  },
  withdrawLimits(): string[] {
    return [];
  },
  loadWithdrawLimitList(): string[] {
    return [];
  },
};

export const mockMessagesStore = {
  loadSystemMessageList(): string[] {
    return [];
  },
  systemMessages(): string[] {
    return [];
  },
};
export const mockTicketsStore = {
  loadUserTicketList(): string[] {
    return [];
  },
  userTicketList(): string[] {
    return [];
  },
  saveTicket(): string[] {
    return [];
  },
  loadRealizedTicketList(): string[] {
    return [];
  },
  realizedTicketList(): string[] {
    return [];
  },
};
export const mockRatesStore = {
  loadCurrencyRates(): string[] {
    return [];
  },
  currencyRates(): string[] {
    return [];
  },
};
export const mockReportsStore = {
  loadFinancialReportPdfDocument(): string[] {
    return [];
  },
};

export const mockUtilsStore = {
  loadBuildInfo(): BuildInfo {
    return {} as BuildInfo;
  },
  buildInfo(): BuildInfo {
    return {} as BuildInfo;
  },
};
