import type { MockedObject } from 'vitest';
import { vi } from 'vitest';
import { TestBed } from '@angular/core/testing';
import { ApiService } from './api.service';
import { SystemService } from '../app/api/api/system.service';
import { BuildInfo } from '../app/api/model/buildInfo';
import { AdminAccountsService } from '../app/api/api/adminAccounts.service';
import { AdminReportsService } from '../app/api/api/adminReports.service';
import { of } from 'rxjs';
import { AdminStatisticsService } from '../app/api/api/adminStatistics.service';
import { Transaction } from '../app/api/model/transaction';
import { UserAccount } from '../app/api/model/userAccount';
import { AccountsReportResponse } from '../app/api/model/accountsReportResponse';
import { UsersStatisticResponse } from '../app/api/model/usersStatisticResponse';
import { AdminTransactionsService } from '../app/api/api/adminTransactions.service';
import { AdminMessagesService } from '../app/api/api/adminMessages.service';
import { SystemMessage } from '../app/api/model/systemMessage';
import { UserAccountOperation } from '../app/api/model/userAccountOperation';
import { AdminUsersService } from '../app/api/api/adminUsers.service';
import { LoadUserRequest } from '../app/api/model/loadUserRequest';
import { UserData } from '../app/api/model/userData';
import { UsersService } from '../app/api/api/users.service';
import { UserProperty } from '../app/api/model/userProperty';
import { DictionariesService } from '../app/api/api/dictionaries.service';
import { Address } from '../app/api/model/address';
import { AdminErrorsService } from '../app/api/api/adminErrors.service';
import { ErrorMessage } from '../app/api/model/errorMessage';
import { ErrorListRequest } from '../app/api/model/errorListRequest';
import { AccountOperationsRequest } from '../app/api/model/accountOperationsRequest';
import { AccountOperation } from '../app/api/model/accountOperation';
import { MessagePriority } from '../app/api/model/messagePriority';
import { CurrencyStatisticResponse } from '../app/api/model/currencyStatisticResponse';
import { PairStatisticResponse } from '../app/api/model/pairStatisticResponse';
import { Pair } from '../app/api/model/pair';
import { AdminPropertiesService } from '../app/api';
import { SystemCurrency } from '../app/api/model/systemCurrency';
import { AccountAmountRequest } from '../app/api/model/accountAmountRequest';
import { AccountAmountResponse } from '../app/api/model/accountAmountResponse';
import { UserBankAccount } from '../app/api/model/userBankAccount';
import { UserBankAccountRequest } from '../app/api/model/userBankAccountRequest';
import { CorrectionRequest } from '../app/api/model/correctionRequest';
import { CorrectionId } from '../app/api/model/correctionId';
import { TransactionsPdfRequest } from '../app/api/model/transactionsPdfRequest';
import { PairPeriodResponse } from '../app/api/model/pairPeriodResponse';

describe('ApiService', () => {
  let apiService: ApiService;
  let systemService: MockedObject<SystemService>;
  let adminAccountsService: MockedObject<AdminAccountsService>;
  let adminReportsService: MockedObject<AdminReportsService>;
  let adminStatisticsService: MockedObject<AdminStatisticsService>;
  let adminTransactionsService: MockedObject<AdminTransactionsService>;
  let adminMessagesService: MockedObject<AdminMessagesService>;
  let adminUsersService: MockedObject<AdminUsersService>;
  let usersService: MockedObject<UsersService>;
  let dictionariesService: MockedObject<DictionariesService>;
  let adminErrorsService: MockedObject<AdminErrorsService>;
  let adminPropertiesService: MockedObject<AdminPropertiesService>;

  beforeEach(() => {
    const systemServiceSpy = {
      loadBuildInfo: vi.fn().mockName('SystemService.loadBuildInfo'),
      loadSystemCurrencyList: vi
        .fn()
        .mockName('SystemService.loadSystemCurrencyList'),
      configuration: vi.fn().mockName('SystemService.configuration'),
    };
    const accountServiceSpy = {
      loadAccounts: vi.fn().mockName('AdminAccountsService.loadAccounts'),
      saveAccountDeposit: vi
        .fn()
        .mockName('AdminAccountsService.saveAccountDeposit'),
      saveWithdrawRequest: vi
        .fn()
        .mockName('AdminAccountsService.saveWithdrawRequest'),
      loadSystemAccountList: vi
        .fn()
        .mockName('AdminAccountsService.loadSystemAccountList'),
      loadExchangeAccountList: vi
        .fn()
        .mockName('AdminAccountsService.loadExchangeAccountList'),
      loadAccountOperationList: vi
        .fn()
        .mockName('AdminAccountsService.loadAccountOperationList'),
      loadAccountAmount: vi
        .fn()
        .mockName('AdminAccountsService.loadAccountAmount'),
      configuration: vi.fn().mockName('AdminAccountsService.configuration'),
      loadBankAccountList: vi
        .fn()
        .mockName('AdminAccountsService.loadBankAccountList'),
      validateBankAccount: vi
        .fn()
        .mockName('AdminAccountsService.validateBankAccount'),
    };
    const adminReportsServiceSpy = {
      generateAccountsReport: vi
        .fn()
        .mockName('AdminReportsService.generateAccountsReport'),
      loadOperationPdfDocument: vi
        .fn()
        .mockName('AdminReportsService.loadOperationPdfDocument'),
      loadTransactionsPdfDocument: vi
        .fn()
        .mockName('AdminReportsService.loadTransactionsPdfDocument'),
      loadPairPeriodReport: vi
        .fn()
        .mockName('AdminReportsService.loadPairPeriodReport'),
      configuration: vi.fn().mockName('AdminReportsService.configuration'),
    };
    const adminStatisticsServiceSpy = {
      loadUsersStatistic: vi
        .fn()
        .mockName('AdminStatisticsService.loadUsersStatistic'),
      configuration: vi.fn().mockName('AdminStatisticsService.configuration'),
      loadCurrencyStatistics: vi
        .fn()
        .mockName('AdminStatisticsService.loadCurrencyStatistics'),
      loadPairStatistics: vi
        .fn()
        .mockName('AdminStatisticsService.loadPairStatistics'),
    };
    const adminTransactionsServiceSpy = {
      loadTransactionList: vi
        .fn()
        .mockName('AdminTransactionsService.loadTransactionList'),
      configuration: vi.fn().mockName('AdminTransactionsService.configuration'),
      loadExchangeAccountTransactionList: vi
        .fn()
        .mockName(
          'AdminTransactionsService.loadExchangeAccountTransactionList',
        ),
      loadSystemAccountTransactionList: vi
        .fn()
        .mockName('AdminTransactionsService.loadSystemAccountTransactionList'),
      saveCorrectionRequest: vi
        .fn()
        .mockName('AdminTransactionsService.saveCorrectionRequest'),
      loadUserTransactionList: vi
        .fn()
        .mockName('AdminTransactionsService.loadUserTransactionList'),
    };
    const adminMessagesServiceSpy = {
      saveSystemMessage: vi
        .fn()
        .mockName('AdminMessagesService.saveSystemMessage'),
      updateSystemMessage: vi
        .fn()
        .mockName('AdminMessagesService.updateSystemMessage'),
      loadSystemMessageList: vi
        .fn()
        .mockName('AdminMessagesService.loadSystemMessageList'),
      configuration: vi.fn().mockName('AdminMessagesService.configuration'),
    };
    const adminUsersServiceSpy = {
      loadUserList: vi.fn().mockName('AdminUsersService.loadUserList'),
      configuration: vi.fn().mockName('AdminUsersService.configuration'),
    };

    const usersServiceSpy = {
      getUserProperty: vi.fn().mockName('UsersService.getUserProperty'),
      saveUserProperty: vi.fn().mockName('UsersService.saveUserProperty'),
      getUserAddress: vi.fn().mockName('UsersService.getUserAddress'),
      saveUserAddress: vi.fn().mockName('UsersService.saveUserAddress'),
      configuration: vi.fn().mockName('UsersService.configuration'),
    };

    const dictionariesServiceSpy = {
      loadTimezoneList: vi
        .fn()
        .mockName('DictionariesService.loadTimezoneList'),
      loadUnicodeLocalesList: vi
        .fn()
        .mockName('DictionariesService.loadUnicodeLocalesList'),
      configuration: vi.fn().mockName('DictionariesService.configuration'),
    };
    const adminErrorsServiceSpy = {
      loadErrorList: vi.fn().mockName('AdminErrorsService.loadErrorList'),
      deleteError: vi.fn().mockName('AdminErrorsService.deleteError'),
      configuration: vi.fn().mockName('AdminErrorsService.configuration'),
    };

    const adminPropertiesServiceSpy = {
      updateSystemCurrency: vi
        .fn()
        .mockName('AdminPropertiesService.updateSystemCurrency'),
      configuration: vi.fn().mockName('AdminPropertiesService.configuration'),
    };

    TestBed.configureTestingModule({
      providers: [
        ApiService,
        { provide: SystemService, useValue: systemServiceSpy },
        { provide: AdminAccountsService, useValue: accountServiceSpy },
        { provide: AdminReportsService, useValue: adminReportsServiceSpy },
        {
          provide: AdminStatisticsService,
          useValue: adminStatisticsServiceSpy,
        },
        {
          provide: AdminTransactionsService,
          useValue: adminTransactionsServiceSpy,
        },
        { provide: AdminMessagesService, useValue: adminMessagesServiceSpy },
        { provide: AdminUsersService, useValue: adminUsersServiceSpy },
        { provide: UsersService, useValue: usersServiceSpy },
        { provide: DictionariesService, useValue: dictionariesServiceSpy },
        { provide: AdminErrorsService, useValue: adminErrorsServiceSpy },
        {
          provide: AdminPropertiesService,
          useValue: adminPropertiesServiceSpy,
        },
      ],
    });
    apiService = TestBed.inject(ApiService);
    systemService = TestBed.inject(
      SystemService,
    ) as MockedObject<SystemService>;
    adminAccountsService = TestBed.inject(
      AdminAccountsService,
    ) as MockedObject<AdminAccountsService>;
    adminReportsService = TestBed.inject(
      AdminReportsService,
    ) as MockedObject<AdminReportsService>;
    adminStatisticsService = TestBed.inject(
      AdminStatisticsService,
    ) as MockedObject<AdminStatisticsService>;
    adminTransactionsService = TestBed.inject(
      AdminTransactionsService,
    ) as MockedObject<AdminTransactionsService>;
    adminMessagesService = TestBed.inject(
      AdminMessagesService,
    ) as MockedObject<AdminMessagesService>;
    adminUsersService = TestBed.inject(
      AdminUsersService,
    ) as MockedObject<AdminUsersService>;
    usersService = TestBed.inject(UsersService) as MockedObject<UsersService>;
    dictionariesService = TestBed.inject(
      DictionariesService,
    ) as MockedObject<DictionariesService>;
    adminErrorsService = TestBed.inject(
      AdminErrorsService,
    ) as MockedObject<AdminErrorsService>;
    adminPropertiesService = TestBed.inject(
      AdminPropertiesService,
    ) as MockedObject<AdminPropertiesService>;
  });

  it('should load accounts', () => {
    const mockUserAccounts = [
      {
        currency: 'CHF',
        version: 2,
        id: 'id',
      },
    ] as UserAccount[];
    adminAccountsService.loadAccounts.mockReturnValue(
      of(mockUserAccounts) as never,
    );

    apiService.loadAccounts({ userId: '1' }).subscribe((operations) => {
      expect(operations).toEqual(mockUserAccounts);
    });

    expect(adminAccountsService.loadAccounts).toHaveBeenCalled();
  });

  it('should generate accounts report', () => {
    const mockAccountsReportResponse = [
      {
        reportDateUtc: '2020-01-01',
        currency: 'USD',
        amountCancellations: 1,
        amountCorrections: 3,
        amountDeposits: 14,
        amountExchanges: 43,
        amountFees: 3,
        amountWithdraws: 15,
      },
    ] as AccountsReportResponse[];
    adminReportsService.generateAccountsReport.mockReturnValue(
      of(mockAccountsReportResponse) as never,
    );

    apiService
      .generateAccountsReport({ userId: '1', dateFromUtc: '2001-01-01' })
      .subscribe((operations) => {
        expect(operations).toEqual(mockAccountsReportResponse);
      });

    expect(adminReportsService.generateAccountsReport).toHaveBeenCalled();
  });

  it('should load users statistic', () => {
    const mockUsersStatisticResponse = {
      allTickets: 12,
      amountTotal: 10000,
      amountInTickets: 34,
      activeTickets: 12,
    } as UsersStatisticResponse;
    adminStatisticsService.loadUsersStatistic.mockReturnValue(
      of(mockUsersStatisticResponse) as never,
    );

    apiService
      .loadUsersStatistic({ userId: '1', currency: 'EUR' })
      .subscribe((operations) => {
        expect(operations).toEqual(mockUsersStatisticResponse);
      });

    expect(adminStatisticsService.loadUsersStatistic).toHaveBeenCalled();
  });
  it('should select transactions', () => {
    const mockUsersStatisticResponse = [
      { dateUtc: '', amount: 200 },
    ] as Transaction[];
    adminTransactionsService.loadTransactionList.mockReturnValue(
      of(mockUsersStatisticResponse) as never,
    );

    apiService
      .loadTransactionList({ dateFromUtc: '', dateToUtc: '' })
      .subscribe((operations) => {
        expect(operations).toEqual(mockUsersStatisticResponse);
      });

    expect(adminTransactionsService.loadTransactionList).toHaveBeenCalled();
  });

  it('should select exchange transactions', () => {
    const mockUsersStatisticResponse = [
      { dateUtc: '', amount: 200 },
    ] as Transaction[];
    adminTransactionsService.loadExchangeAccountTransactionList.mockReturnValue(
      of(mockUsersStatisticResponse) as never,
    );

    apiService
      .loadExchangeAccountTransactionList({ dateFromUtc: '', dateToUtc: '' })
      .subscribe((operations) => {
        expect(operations).toEqual(mockUsersStatisticResponse);
      });

    expect(
      adminTransactionsService.loadExchangeAccountTransactionList,
    ).toHaveBeenCalled();
  });

  it('should select system transactions', () => {
    const mockUsersStatisticResponse = [
      { dateUtc: '', amount: 200 },
    ] as Transaction[];
    adminTransactionsService.loadSystemAccountTransactionList.mockReturnValue(
      of(mockUsersStatisticResponse) as never,
    );

    apiService
      .loadSystemAccountTransactionList({ dateFromUtc: '', dateToUtc: '' })
      .subscribe((operations) => {
        expect(operations).toEqual(mockUsersStatisticResponse);
      });

    expect(
      adminTransactionsService.loadSystemAccountTransactionList,
    ).toHaveBeenCalled();
  });

  it('should load build info', () => {
    const mockBuildInfo = {
      buildTime: 'buildTime',
      branchName: 'branchName',
      commitHash: 'commitHash',
      commitTime: 'commitTime',
      moduleName: 'moduleName',
      versionNumber: 'versionNumber',
    } as BuildInfo;
    systemService.loadBuildInfo.mockReturnValue(of(mockBuildInfo) as never);

    apiService.loadBuildInfo().subscribe((operations) => {
      expect(operations).toEqual(mockBuildInfo);
    });

    expect(systemService.loadBuildInfo).toHaveBeenCalled();
  });

  it('should save system message', () => {
    const systemMessage = {
      messageText: 'messageText',
      id: 'id',
      active: true,
      version: 12,
      priority: MessagePriority.High,
    } as SystemMessage;
    adminMessagesService.saveSystemMessage.mockReturnValue(
      of(systemMessage) as never,
    );

    apiService.saveSystemMessage(systemMessage).subscribe((operations) => {
      expect(operations).toEqual(systemMessage);
    });

    expect(adminMessagesService.saveSystemMessage).toHaveBeenCalled();
  });

  it('should update system message', () => {
    const systemMessage = {
      messageText: 'messageText',
      id: 'id',
      active: true,
      version: 12,
      priority: MessagePriority.Low,
    } as SystemMessage;
    adminMessagesService.updateSystemMessage.mockReturnValue(
      of(systemMessage) as never,
    );

    apiService.updateSystemMessage(systemMessage).subscribe((operations) => {
      expect(operations).toEqual(systemMessage);
    });

    expect(adminMessagesService.updateSystemMessage).toHaveBeenCalled();
  });

  it('should load system messages', () => {
    const systemMessageList = [
      {
        messageText: 'messageText',
        id: 'id',
        active: true,
        version: 12,
        priority: MessagePriority.High,
      },
    ] as SystemMessage[];
    adminMessagesService.loadSystemMessageList.mockReturnValue(
      of(systemMessageList) as never,
    );

    apiService.loadSystemMessageList().subscribe((operations) => {
      expect(operations).toEqual(systemMessageList);
    });

    expect(adminMessagesService.loadSystemMessageList).toHaveBeenCalled();
  });

  it('should save account-deposit', () => {
    const userAccountOperationRequest = {} as UserAccountOperation;
    adminAccountsService.saveAccountDeposit.mockReturnValue(
      of({ success: true }) as never,
    );

    apiService
      .saveAccountDeposit(userAccountOperationRequest)
      .subscribe((response) => {
        expect(response).toEqual({ success: true });
      });

    expect(adminAccountsService.saveAccountDeposit).toHaveBeenCalledWith(
      userAccountOperationRequest,
    );
  });

  it('should save withdraw request', () => {
    const userAccountOperationRequest = {} as UserAccountOperation;
    adminAccountsService.saveWithdrawRequest.mockReturnValue(
      of({ success: true }) as never,
    );

    apiService
      .saveWithdrawRequest(userAccountOperationRequest)
      .subscribe((response) => {
        expect(response).toEqual({ success: true });
      });

    expect(adminAccountsService.saveWithdrawRequest).toHaveBeenCalledWith(
      userAccountOperationRequest,
    );
  });

  it('should load user list for request', () => {
    const loadUserRequest = [] as LoadUserRequest;
    const users = [
      { email: 'email1', userId: 'userId1', name: 'name1' },
      { email: 'email2', userId: 'userId2', name: 'name2' },
    ] as UserData[];
    adminUsersService.loadUserList.mockReturnValue(of(users) as never);

    apiService.loadUserList(loadUserRequest).subscribe((response) => {
      expect(response).toEqual(users);
    });

    expect(adminUsersService.loadUserList).toHaveBeenCalledWith(
      loadUserRequest,
    );
  });

  it('should load user property for request', () => {
    const userProperty = { userId: 'userId' } as UserProperty;
    usersService.getUserProperty.mockReturnValue(of(userProperty) as never);

    apiService.getUserProperty().subscribe((response) => {
      expect(response).toEqual(userProperty);
    });

    expect(usersService.getUserProperty).toHaveBeenCalled();
  });

  it('should save user property for request', () => {
    const userProperty = { userId: 'userId' } as UserProperty;
    usersService.saveUserProperty.mockReturnValue(of(userProperty) as never);

    apiService.saveUserProperty(userProperty).subscribe((response) => {
      expect(response).toEqual(userProperty);
    });

    expect(usersService.saveUserProperty).toHaveBeenCalledWith(userProperty);
  });

  it('should load timezones for request', () => {
    const timezones = ['a', 'b'] as string[];
    dictionariesService.loadTimezoneList.mockReturnValue(
      of(timezones) as never,
    );

    apiService.loadTimezoneList().subscribe((response) => {
      expect(response).toEqual(timezones);
    });

    expect(dictionariesService.loadTimezoneList).toHaveBeenCalled();
  });

  it('should load unicode locales for request', () => {
    const timezones = ['a', 'b'] as string[];
    dictionariesService.loadUnicodeLocalesList.mockReturnValue(
      of(timezones) as never,
    );

    apiService.loadUnicodeLocalesList().subscribe((response) => {
      expect(response).toEqual(timezones);
    });

    expect(dictionariesService.loadUnicodeLocalesList).toHaveBeenCalled();
  });

  it('should load user address', () => {
    const address = {
      id: 'id',
      userId: 'userId',
      name: 'name',
      version: 2,
      countryCode: 'countryCode',
      phone: 'phone',
      postalOffice: 'postalOffice',
      street: 'street',
      taxID: 'taxID',
      vatID: 'vatID',
      zipCode: 'zipCode',
    } as Address;
    usersService.getUserAddress.mockReturnValue(of(address) as never);

    apiService.getUserAddress().subscribe((response) => {
      expect(response).toEqual(address);
    });

    expect(usersService.getUserAddress).toHaveBeenCalled();
  });

  it('should save user address', () => {
    const address = {
      id: 'id',
      userId: 'userId',
      name: 'name',
      version: 2,
      countryCode: 'countryCode',
      phone: 'phone',
      postalOffice: 'postalOffice',
      street: 'street',
      taxID: 'taxID',
      vatID: 'vatID',
      zipCode: 'zipCode',
    } as Address;
    usersService.saveUserAddress.mockReturnValue(of(address) as never);

    apiService.saveUserAddress(address).subscribe((response) => {
      expect(response).toEqual(address);
    });

    expect(usersService.saveUserAddress).toHaveBeenCalledWith(address);
  });

  it('should list errors', () => {
    const messages = [
      {
        id: 'id',
        message: 'zipCode',
      },
    ] as ErrorMessage[];
    adminErrorsService.loadErrorList.mockReturnValue(of(messages) as never);
    const errorListRequest: ErrorListRequest = { offset: 2, size: 3 };
    apiService.loadErrorList(errorListRequest).subscribe((response) => {
      expect(response).toEqual(messages);
    });

    expect(adminErrorsService.loadErrorList).toHaveBeenCalledWith(
      errorListRequest,
    );
  });

  it('should delete error', () => {
    const messages = [
      {
        id: 'id',
        message: 'zipCode',
      },
    ] as ErrorMessage[];
    adminErrorsService.deleteError.mockReturnValue(of(messages) as never);
    apiService.deleteError(1).subscribe((response) => {
      expect(response).toEqual(messages);
    });

    expect(adminErrorsService.deleteError).toHaveBeenCalledWith(1);
  });

  it('should load system account list', () => {
    const accounts = [
      {
        currency: 'EUR',
        version: 2,
        id: 'id',
      },
    ] as UserAccount[];
    adminAccountsService.loadSystemAccountList.mockReturnValue(
      of(accounts) as never,
    );
    apiService.loadSystemAccountList().subscribe((response) => {
      expect(response).toEqual(accounts);
    });

    expect(adminAccountsService.loadSystemAccountList).toHaveBeenCalled();
  });

  it('should load exchange account list', () => {
    const accounts = [
      {
        currency: 'EUR',
        version: 2,
        id: 'id',
      },
    ] as UserAccount[];
    adminAccountsService.loadExchangeAccountList.mockReturnValue(
      of(accounts) as never,
    );
    apiService.loadExchangeAccountList().subscribe((response) => {
      expect(response).toEqual(accounts);
    });

    expect(adminAccountsService.loadExchangeAccountList).toHaveBeenCalled();
  });

  it('should load system account operation list', () => {
    const systemAccountOperationsRequest = {
      systemAccountId: '1',
      dateToUtc: '2025-01-01',
      dateFromUtc: '2025-01-01',
    } as AccountOperationsRequest;
    const accountOperations = [
      {
        dateUtc: '2025-01-01',
        amount: 200,
      },
    ] as AccountOperation[];
    adminAccountsService.loadAccountOperationList.mockReturnValue(
      of(accountOperations) as never,
    );
    apiService
      .loadAccountOperationList(systemAccountOperationsRequest)
      .subscribe((response) => {
        expect(response).toEqual(accountOperations);
      });

    expect(adminAccountsService.loadAccountOperationList).toHaveBeenCalledWith(
      systemAccountOperationsRequest,
    );
  });

  it('should load operation pdf document list', () => {
    const loadAccountOperationsRequest = {
      systemAccountId: '1',
      dateToUtc: '2025-01-01',
      dateFromUtc: '2025-01-01',
    } as AccountOperationsRequest;
    const blob = new Blob([], {
      type: 'application/pdf',
    });
    adminReportsService.loadOperationPdfDocument.mockReturnValue(of() as never);
    apiService
      .loadOperationPdfDocument(loadAccountOperationsRequest)
      .subscribe((response) => {
        expect(response).toEqual(blob);
      });

    expect(adminReportsService.loadOperationPdfDocument).toHaveBeenCalledWith(
      loadAccountOperationsRequest,
    );
  });

  it('should load transactions pdf document list', () => {
    const transactionsPdfRequest = {
      systemAccountId: '1',
      dateToUtc: '2025-01-01',
      dateFromUtc: '2025-01-01',
    } as TransactionsPdfRequest;
    const blob = new Blob([], {
      type: 'application/pdf',
    });
    adminReportsService.loadTransactionsPdfDocument.mockReturnValue(
      of() as never,
    );
    apiService
      .loadTransactionsPdfDocument(transactionsPdfRequest)
      .subscribe((response) => {
        expect(response).toEqual(blob);
      });

    expect(
      adminReportsService.loadTransactionsPdfDocument,
    ).toHaveBeenCalledWith(transactionsPdfRequest);
  });
  it('should load currency statistics', () => {
    const currency = 'EUR';
    const currencyStatisticResponse = {
      amountTotal: 1,
      amountInTickets: 2,
      currency: 'EUR',
    } as CurrencyStatisticResponse;
    adminStatisticsService.loadCurrencyStatistics.mockReturnValue(
      of(currencyStatisticResponse) as never,
    );
    apiService.loadCurrencyStatistics(currency).subscribe((response) => {
      expect(response).toEqual(response);
    });

    expect(adminStatisticsService.loadCurrencyStatistics).toHaveBeenCalledWith(
      currency,
    );
  });
  it('should load pair statistics', () => {
    const pair = Pair.EurGbp;
    const pairStatisticResponse = {
      amountTicketsSell: 1,
      amountTicketsBuy: 2,
    } as PairStatisticResponse;
    adminStatisticsService.loadPairStatistics.mockReturnValue(
      of(pairStatisticResponse) as never,
    );
    apiService.loadPairStatistics(pair).subscribe((response) => {
      expect(response).toEqual(response);
    });

    expect(adminStatisticsService.loadPairStatistics).toHaveBeenCalledWith(
      pair,
    );
  });

  it('should load pair statistics', () => {
    const pair = Pair.EurGbp;
    const period = 12;
    const pairStatisticResponse = {
      minimumRatio: 1,
      currentRatio: 2,
      maximumRatio: 3,
    } as PairPeriodResponse;
    adminReportsService.loadPairPeriodReport.mockReturnValue(
      of(pairStatisticResponse) as never,
    );
    apiService.loadPairPeriodReport(pair, period).subscribe((response) => {
      expect(response).toEqual(response);
    });

    expect(adminReportsService.loadPairPeriodReport).toHaveBeenCalledWith(
      pair,
      period,
    );
  });

  it('should update system currency', () => {
    const systemCurrency = {
      id: 1,
      currency: 'EUR',
      minimumExchange: 12,
    } as SystemCurrency;
    adminPropertiesService.updateSystemCurrency.mockReturnValue(
      of([]) as never,
    );
    apiService.updateSystemCurrency(systemCurrency).subscribe((response) => {
      expect(response).toEqual(response);
    });

    expect(adminPropertiesService.updateSystemCurrency).toHaveBeenCalledWith(
      systemCurrency,
    );
  });

  it('should load system currency list', () => {
    const systemCurrencyList = [
      {
        id: 1,
        currency: 'EUR',
        minimumExchange: 12,
      },
    ] as SystemCurrency[];
    systemService.loadSystemCurrencyList.mockReturnValue(
      of(systemCurrencyList) as never,
    );
    apiService.loadSystemCurrencyList().subscribe((response) => {
      expect(response).toEqual(response);
    });

    expect(systemService.loadSystemCurrencyList).toHaveBeenCalled();
  });

  it('should load account amount', () => {
    const accountAmountRequest = { accountId: 'a' } as AccountAmountRequest;
    const accountAmountResponse = { amount: 2393944 } as AccountAmountResponse;
    adminAccountsService.loadAccountAmount.mockReturnValue(
      of(accountAmountResponse) as never,
    );
    apiService.loadAccountAmount(accountAmountRequest).subscribe((response) => {
      expect(response).toEqual(accountAmountResponse);
    });

    expect(adminAccountsService.loadAccountAmount).toHaveBeenCalledWith(
      accountAmountRequest,
    );
  });

  it('should load user bank account amount', () => {
    const userBankAccountRequest: UserBankAccountRequest = {
      userId: 'userId',
      userAccountId: 'userAccountId',
    };
    const userBankAccountResponse = [
      {
        userAccountId: 'userAccountId',
        version: 1,
        verifiedDateUtc: 'verifiedDateUtc',
        accountNumber: 'accountNumber',
        id: 'id',
        countryCode: 'CC',
        createdDateUtc: 'createdDateUtc',
      },
    ] as UserBankAccount[];
    adminAccountsService.loadBankAccountList.mockReturnValue(
      of(userBankAccountResponse) as never,
    );
    apiService
      .loadBankAccountList(userBankAccountRequest)
      .subscribe((response) => {
        expect(response).toEqual(userBankAccountResponse);
      });

    expect(adminAccountsService.loadBankAccountList).toHaveBeenCalledWith(
      userBankAccountRequest,
    );
  });

  it('should validate user bank account amount', () => {
    const userBankAccount: UserBankAccount = {
      userAccountId: 'userAccountId',
      version: 1,
      verifiedDateUtc: 'verifiedDateUtc',
      accountNumber: 'accountNumber',
      id: 'id',
      countryCode: 'CC',
      createdDateUtc: 'createdDateUtc',
    };
    adminAccountsService.validateBankAccount.mockReturnValue(
      of(userBankAccount) as never,
    );
    apiService.validateBankAccount(userBankAccount).subscribe((response) => {
      expect(response).toEqual(response);
    });

    expect(adminAccountsService.validateBankAccount).toHaveBeenCalledWith(
      userBankAccount,
    );
  });

  it('should load user transactions', () => {
    const mockUsersStatisticResponse = [
      { dateUtc: '', amount: 200 },
    ] as Transaction[];
    adminTransactionsService.loadUserTransactionList.mockReturnValue(
      of(mockUsersStatisticResponse) as never,
    );
    const request = {
      userId: 'userId',
      userAccountId: 'userAccountId',
    };

    apiService.loadUserTransactionList(request).subscribe((operations) => {
      expect(operations).toEqual(mockUsersStatisticResponse);
    });

    expect(
      adminTransactionsService.loadUserTransactionList,
    ).toHaveBeenCalledWith(request);
  });

  it('should select exchange transactions', () => {
    const mockCorrection = { id: 1 } as CorrectionId;
    adminTransactionsService.saveCorrectionRequest.mockReturnValue(
      of(mockCorrection) as never,
    );
    const correctionRequest = {
      userId: 'userId',
      userAccountId: 'userAccountId',
      amount: 300,
    } as CorrectionRequest;

    apiService
      .saveCorrectionRequest(correctionRequest)
      .subscribe((operations) => {
        expect(operations).toEqual(mockCorrection);
      });

    expect(adminTransactionsService.saveCorrectionRequest).toHaveBeenCalledWith(
      correctionRequest,
    );
  });
});
