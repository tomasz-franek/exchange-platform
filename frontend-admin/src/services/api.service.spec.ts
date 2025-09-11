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
import { AdminPropertiesService, SystemPropertyResponse } from '../app/api';

describe('ApiService', () => {
  let apiService: ApiService;
  let systemService: jasmine.SpyObj<SystemService>;
  let adminAccountsService: jasmine.SpyObj<AdminAccountsService>;
  let adminReportsService: jasmine.SpyObj<AdminReportsService>;
  let adminStatisticsService: jasmine.SpyObj<AdminStatisticsService>;
  let adminTransactionsService: jasmine.SpyObj<AdminTransactionsService>;
  let adminMessagesService: jasmine.SpyObj<AdminMessagesService>;
  let adminUsersService: jasmine.SpyObj<AdminUsersService>;
  let usersService: jasmine.SpyObj<UsersService>;
  let dictionariesService: jasmine.SpyObj<DictionariesService>;
  let adminErrorsService: jasmine.SpyObj<AdminErrorsService>;
  let adminPropertiesService: jasmine.SpyObj<AdminPropertiesService>;

  beforeEach(() => {
    const systemServiceSpy = jasmine.createSpyObj('SystemService', [
      'loadBuildInfo',
      'configuration',
    ]);
    const accountServiceSpy = jasmine.createSpyObj('AdminAccountsService', [
      'loadAccounts',
      'saveAccountDeposit',
      'saveWithdrawRequest',
      'loadSystemAccountList',
      'loadAccountOperationList',
      'configuration',
    ]);
    const adminReportsServiceSpy = jasmine.createSpyObj('AdminReportsService', [
      'generateAccountsReport',
      'loadOperationPdfDocument',
      'configuration',
    ]);
    const adminStatisticsServiceSpy = jasmine.createSpyObj(
      'AdminStatisticsService',
      [
        'loadUsersStatistic',
        'configuration',
        'loadCurrencyStatistics',
        'loadPairStatistics',
      ],
    );
    const adminTransactionsServiceSpy = jasmine.createSpyObj(
      'AdminTransactionsService',
      [
        'loadTransactionList',
        'configuration',
        'loadExchangeAccountTransactionList',
        'loadSystemAccountTransactionList',
      ],
    );
    const adminMessagesServiceSpy = jasmine.createSpyObj(
      'AdminMessagesService',
      [
        'saveSystemMessage',
        'updateSystemMessage',
        'loadSystemMessageList',
        'configuration',
      ],
    );
    const adminUsersServiceSpy = jasmine.createSpyObj('AdminUsersService', [
      'loadUserList',
      'configuration',
    ]);

    const usersServiceSpy = jasmine.createSpyObj('UsersService', [
      'getUserProperty',
      'saveUserProperty',
      'getUserAddress',
      'saveUserAddress',
      'configuration',
    ]);

    const dictionariesServiceSpy = jasmine.createSpyObj('DictionariesService', [
      'loadTimezoneList',
      'loadUnicodeLocalesList',
      'configuration',
    ]);
    const adminErrorsServiceSpy = jasmine.createSpyObj('AdminErrorsService', [
      'loadErrorList',
      'deleteError',
      'configuration',
    ]);

    const adminPropertiesServiceSpy = jasmine.createSpyObj(
      'AdminPropertiesService',
      ['loadSystemProperties', 'configuration'],
    );

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
    ) as jasmine.SpyObj<SystemService>;
    adminAccountsService = TestBed.inject(
      AdminAccountsService,
    ) as jasmine.SpyObj<AdminAccountsService>;
    adminReportsService = TestBed.inject(
      AdminReportsService,
    ) as jasmine.SpyObj<AdminReportsService>;
    adminStatisticsService = TestBed.inject(
      AdminStatisticsService,
    ) as jasmine.SpyObj<AdminStatisticsService>;
    adminTransactionsService = TestBed.inject(
      AdminTransactionsService,
    ) as jasmine.SpyObj<AdminTransactionsService>;
    adminMessagesService = TestBed.inject(
      AdminMessagesService,
    ) as jasmine.SpyObj<AdminMessagesService>;
    adminUsersService = TestBed.inject(
      AdminUsersService,
    ) as jasmine.SpyObj<AdminUsersService>;
    usersService = TestBed.inject(UsersService) as jasmine.SpyObj<UsersService>;
    dictionariesService = TestBed.inject(
      DictionariesService,
    ) as jasmine.SpyObj<DictionariesService>;
    adminErrorsService = TestBed.inject(
      AdminErrorsService,
    ) as jasmine.SpyObj<AdminErrorsService>;
    adminPropertiesService = TestBed.inject(
      AdminPropertiesService,
    ) as jasmine.SpyObj<AdminPropertiesService>;
  });

  it('should load accounts', () => {
    const mockUserAccounts = [
      {
        currency: 'CHF',
        version: 2,
        id: 'id',
      },
    ] as UserAccount[];
    adminAccountsService.loadAccounts.and.returnValue(
      of(mockUserAccounts) as never,
    );

    apiService.loadAccounts({ userId: '1' }).subscribe((operations) => {
      expect(operations).toEqual(mockUserAccounts);
    });

    expect(adminAccountsService.loadAccounts).toHaveBeenCalled();
  });

  it('should generate accounts report', () => {
    const mockAccountsReportResponse = {
      reportDateUTC: '2020-01-01',
    } as AccountsReportResponse;
    adminReportsService.generateAccountsReport.and.returnValue(
      of(mockAccountsReportResponse) as never,
    );

    apiService
      .generateAccountsReport({ userId: '1' })
      .subscribe((operations) => {
        expect(operations).toEqual(mockAccountsReportResponse);
      });

    expect(adminReportsService.generateAccountsReport).toHaveBeenCalled();
  });

  it('should load users statistic', () => {
    const mockUsersStatisticResponse = {
      active: 1,
      all: 2,
      blocked: 3,
    } as UsersStatisticResponse;
    adminStatisticsService.loadUsersStatistic.and.returnValue(
      of(mockUsersStatisticResponse) as never,
    );

    apiService.loadUsersStatistic({ userId: '1' }).subscribe((operations) => {
      expect(operations).toEqual(mockUsersStatisticResponse);
    });

    expect(adminStatisticsService.loadUsersStatistic).toHaveBeenCalled();
  });
  it('should select transactions', () => {
    const mockUsersStatisticResponse = [
      { dateUtc: '', amount: 200 },
    ] as Transaction[];
    adminTransactionsService.loadTransactionList.and.returnValue(
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
    adminTransactionsService.loadExchangeAccountTransactionList.and.returnValue(
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
    adminTransactionsService.loadSystemAccountTransactionList.and.returnValue(
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
    systemService.loadBuildInfo.and.returnValue(of(mockBuildInfo) as never);

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
    adminMessagesService.saveSystemMessage.and.returnValue(
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
    adminMessagesService.updateSystemMessage.and.returnValue(
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
    adminMessagesService.loadSystemMessageList.and.returnValue(
      of(systemMessageList) as never,
    );

    apiService.loadSystemMessageList().subscribe((operations) => {
      expect(operations).toEqual(systemMessageList);
    });

    expect(adminMessagesService.loadSystemMessageList).toHaveBeenCalled();
  });

  it('should save account-deposit', () => {
    const userAccountOperationRequest = {} as UserAccountOperation;
    adminAccountsService.saveAccountDeposit.and.returnValue(
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
    adminAccountsService.saveWithdrawRequest.and.returnValue(
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
    adminUsersService.loadUserList.and.returnValue(of(users) as never);

    apiService.loadUserList(loadUserRequest).subscribe((response) => {
      expect(response).toEqual(users);
    });

    expect(adminUsersService.loadUserList).toHaveBeenCalledWith(
      loadUserRequest,
    );
  });

  it('should load user property for request', () => {
    const userProperty = { userId: 'userId' } as UserProperty;
    usersService.getUserProperty.and.returnValue(of(userProperty) as never);

    apiService.getUserProperty().subscribe((response) => {
      expect(response).toEqual(userProperty);
    });

    expect(usersService.getUserProperty).toHaveBeenCalled();
  });

  it('should save user property for request', () => {
    const userProperty = { userId: 'userId' } as UserProperty;
    usersService.saveUserProperty.and.returnValue(of(userProperty) as never);

    apiService.saveUserProperty(userProperty).subscribe((response) => {
      expect(response).toEqual(userProperty);
    });

    expect(usersService.saveUserProperty).toHaveBeenCalledWith(userProperty);
  });

  it('should load timezones for request', () => {
    const timezones = ['a', 'b'] as string[];
    dictionariesService.loadTimezoneList.and.returnValue(
      of(timezones) as never,
    );

    apiService.loadTimezoneList().subscribe((response) => {
      expect(response).toEqual(timezones);
    });

    expect(dictionariesService.loadTimezoneList).toHaveBeenCalled();
  });

  it('should load unicode locales for request', () => {
    const timezones = ['a', 'b'] as string[];
    dictionariesService.loadUnicodeLocalesList.and.returnValue(
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
    usersService.getUserAddress.and.returnValue(of(address) as never);

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
    usersService.saveUserAddress.and.returnValue(of(address) as never);

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
    adminErrorsService.loadErrorList.and.returnValue(of(messages) as never);
    const errorListRequest: ErrorListRequest = { offset: 2 };
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
    adminErrorsService.deleteError.and.returnValue(of(messages) as never);
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
    adminAccountsService.loadSystemAccountList.and.returnValue(
      of(accounts) as never,
    );
    apiService.loadSystemAccountList().subscribe((response) => {
      expect(response).toEqual(accounts);
    });

    expect(adminAccountsService.loadSystemAccountList).toHaveBeenCalled();
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
    adminAccountsService.loadAccountOperationList.and.returnValue(
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
    adminReportsService.loadOperationPdfDocument.and.returnValue(of() as never);
    apiService
      .loadOperationPdfDocument(loadAccountOperationsRequest)
      .subscribe((response) => {
        expect(response).toEqual(blob);
      });

    expect(adminReportsService.loadOperationPdfDocument).toHaveBeenCalledWith(
      loadAccountOperationsRequest,
    );
  });

  it('should load currency statistics', () => {
    const currency = 'EUR';
    const currencyStatisticResponse = {
      amountTotal: 1,
      active: 2,
      blocked: 3,
    } as CurrencyStatisticResponse;
    adminStatisticsService.loadCurrencyStatistics.and.returnValue(
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
    adminStatisticsService.loadPairStatistics.and.returnValue(
      of(pairStatisticResponse) as never,
    );
    apiService.loadPairStatistics(pair).subscribe((response) => {
      expect(response).toEqual(response);
    });

    expect(adminStatisticsService.loadPairStatistics).toHaveBeenCalledWith(
      pair,
    );
  });

  it('should load system properties', () => {
    const systemPropertyResponse = {
      feeStrategy: 'feeStrategy',
      ratioStrategy: 'ratioStrategy',
    } as SystemPropertyResponse;
    adminPropertiesService.loadSystemProperties.and.returnValue(
      of(systemPropertyResponse) as never,
    );
    apiService.loadSystemProperties().subscribe((response) => {
      expect(response).toEqual(response);
    });

    expect(adminPropertiesService.loadSystemProperties).toHaveBeenCalled();
  });
});
