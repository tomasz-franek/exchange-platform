import { TestBed } from '@angular/core/testing';
import { ApiService } from './api.service'; // Adjust the import path as necessary
import { of } from 'rxjs';
import { TicketsService } from '../../app/api/api/tickets.service';
import { AccountsService } from '../../app/api/api/accounts.service';
import { UsersService } from '../../app/api/api/users.service';
import { AccountBalance } from '../../app/api/model/accountBalance';
import { UserAccount } from '../../app/api/model/userAccount';
import { UserTicket } from '../../app/api/model/userTicket';
import { UserOperation } from '../../app/api/model/userOperation';
import { AccountOperationsRequest } from '../../app/api/model/accountOperationsRequest';
import { UserProperty } from '../../app/api/model/userProperty';
import { DictionariesService } from '../../app/api/api/dictionaries.service';
import { Pair } from '../../app/api/model/pair';
import { UserTicketStatus } from '../../app/api/model/userTicketStatus';
import { SystemService } from '../../app/api/api/system.service';
import { BuildInfo } from '../../app/api/model/buildInfo';
import { SystemMessage } from '../../app/api/model/systemMessage';
import { Address } from '../../app/api/model/address';
import { RatesService } from '../../app/api/api/rates.service';
import { CurrencyRate } from '../../app/api/model/currencyRate';
import { ReportsService } from '../../app/api';
import { MessagePriority } from '../../app/api/model/messagePriority';
import { SystemCurrency } from '../../app/api/model/systemCurrency';
import { UserBankAccount } from '../../app/api/model/userBankAccount';
import { TimezoneData } from '../../app/api/model/timezoneData';

describe('ApiService', () => {
  let apiService: ApiService;
  let ticketsService: jasmine.SpyObj<TicketsService>;
  let accountsService: jasmine.SpyObj<AccountsService>;
  let usersService: jasmine.SpyObj<UsersService>;
  let ratesService: jasmine.SpyObj<RatesService>;
  let systemService: jasmine.SpyObj<SystemService>;
  let dictionariesService: jasmine.SpyObj<DictionariesService>;
  let reportsService: jasmine.SpyObj<ReportsService>;

  beforeEach(() => {
    const ticketsServiceSpy = jasmine.createSpyObj('TicketsService', [
      'saveUserTicket',
      'loadUserTicketList',
      'cancelExchangeTicket',
    ]);
    const accountsServiceSpy = jasmine.createSpyObj('AccountsService', [
      'saveAccountDeposit',
      'saveWithdrawRequest',
      'loadAccountBalanceList',
      'createUserAccount',
      'loadUserOperationList',
      'updateUserAccount',
      'saveBankAccount',
      'loadBankAccountList',
    ]);
    const usersServiceSpy = jasmine.createSpyObj('UsersService', [
      'getUserProperty',
      'saveUserProperty',
      'getUserAddress',
      'saveUserAddress',
    ]);

    const dictionariesServiceSpy = jasmine.createSpyObj('DictionaryService', [
      'loadTimezoneList',
      'loadUnicodeLocalesList',
    ]);

    const ratesServiceSpy = jasmine.createSpyObj('RatesService', [
      'loadCurrencyRates',
    ]);

    const systemServiceSpy = jasmine.createSpyObj('SystemService', [
      'loadBuildInfo',
      'loadSystemMessageList',
      'loadSystemCurrencyList',
    ]);

    const reportsServiceSpy = jasmine.createSpyObj('ReportsService', [
      'loadExchangePdfDocument',
    ]);

    TestBed.configureTestingModule({
      providers: [
        ApiService,
        { provide: TicketsService, useValue: ticketsServiceSpy },
        { provide: AccountsService, useValue: accountsServiceSpy },
        { provide: UsersService, useValue: usersServiceSpy },
        { provide: DictionariesService, useValue: dictionariesServiceSpy },
        { provide: RatesService, useValue: ratesServiceSpy },
        { provide: SystemService, useValue: systemServiceSpy },
        { provide: ReportsService, useValue: reportsServiceSpy },
      ],
    });

    apiService = TestBed.inject(ApiService);
    ticketsService = TestBed.inject(
      TicketsService,
    ) as jasmine.SpyObj<TicketsService>;
    accountsService = TestBed.inject(
      AccountsService,
    ) as jasmine.SpyObj<AccountsService>;
    usersService = TestBed.inject(UsersService) as jasmine.SpyObj<UsersService>;
    ratesService = TestBed.inject(RatesService) as jasmine.SpyObj<RatesService>;
    systemService = TestBed.inject(
      SystemService,
    ) as jasmine.SpyObj<SystemService>;
    dictionariesService = TestBed.inject(
      DictionariesService,
    ) as jasmine.SpyObj<DictionariesService>;
    reportsService = TestBed.inject(
      ReportsService,
    ) as jasmine.SpyObj<ReportsService>;
  });

  it('should save a user ticket', () => {
    const userTicket = {
      userId: 'x',
      userAccountId: 'y',
      version: 1,
      amount: 100,
      direction: 'SELL',
      id: 1,
      epochUtc: 20,
      pair: 'EUR_USD',
    } as UserTicket;
    ticketsService.saveUserTicket.and.returnValue(
      of({ success: true }) as never,
    );

    apiService.saveTicket(userTicket).subscribe((response) => {
      expect(response).toEqual({ success: true });
    });

    expect(ticketsService.saveUserTicket).toHaveBeenCalledWith(userTicket);
  });

  it('should load user ticket list', () => {
    const mockTickets = [
      {
        userId: 'a',
        userAccountId: 'b',
        pair: 'USD_CHF',
        version: 2,
        amount: 4,
        ratio: 3,
        epochUtc: 7,
        id: 2,
        direction: 'BUY',
        eventType: 'DEPOSIT',
      },
    ] as UserTicket[];
    ticketsService.loadUserTicketList.and.returnValue(of(mockTickets) as never);

    apiService.loadUserTicketList().subscribe((tickets) => {
      expect(tickets).toEqual(mockTickets);
    });

    expect(ticketsService.loadUserTicketList).toHaveBeenCalled();
  });

  it('should load account balance list', () => {
    const mockBalances = [
      { amount: 10, currency: 'USD', userAccountId: 'x' },
    ] as AccountBalance[];
    accountsService.loadAccountBalanceList.and.returnValue(
      of(mockBalances) as never,
    );

    apiService.loadAccountBalanceList().subscribe((balances) => {
      expect(balances).toEqual(mockBalances);
    });

    expect(accountsService.loadAccountBalanceList).toHaveBeenCalled();
  });

  it('should create a user account', () => {
    const userAccount = {
      /* mock user account data */
    } as UserAccount;
    accountsService.createUserAccount.and.returnValue(of(userAccount) as never);

    apiService.createUserAccount(userAccount).subscribe((account) => {
      expect(account).toEqual(userAccount);
    });

    expect(accountsService.createUserAccount).toHaveBeenCalledWith(userAccount);
  });

  it('should load user operation list', () => {
    const accountOperationsRequest = {
      userId: '1',
      userAccountId: 'x',
      currency: 'CHF',
      dateFrom: '2024-01-01',
      dateTo: '2022-01-01',
      page: 1,
      size: 10,
    } as AccountOperationsRequest;
    const mockOperations = [
      {
        amount: 12,
        currency: 'CHF',
        eventType: 'DEPOSIT',
      },
      {
        amount: 26,
        currency: 'EUR',
        eventType: 'DEPOSIT',
      },
    ] as UserOperation[];
    accountsService.loadUserOperationList.and.returnValue(
      of(mockOperations) as never,
    );

    apiService
      .loadUserOperationList(accountOperationsRequest)
      .subscribe((operations) => {
        expect(operations).toEqual(mockOperations);
      });

    expect(accountsService.loadUserOperationList).toHaveBeenCalledWith(
      accountOperationsRequest,
    );
  });

  it('should update user account', () => {
    const userAccount = {
      version: 1,
      currency: 'GBP',
      id: '12',
    } as UserAccount;
    accountsService.updateUserAccount.and.returnValue(of(userAccount) as never);

    apiService.updateUserAccount(userAccount).subscribe((account) => {
      expect(account).toEqual(userAccount);
    });

    expect(accountsService.updateUserAccount).toHaveBeenCalledWith(userAccount);
  });

  it('should get user property', () => {
    const mockUserProperty = {
      timezone: 'UTC',
      userId: '12',
      language: 'en-US',
      version: 1,
    } as UserProperty;
    usersService.getUserProperty.and.returnValue(of(mockUserProperty) as never);

    apiService.getUserProperty().subscribe((property) => {
      expect(property).toEqual(mockUserProperty);
    });

    expect(usersService.getUserProperty).toHaveBeenCalled();
  });

  it('should save user property', () => {
    const userProperty = {
      timezone: 'UTC',
      userId: '12',
      language: 'en-US',
      version: 1,
    } as UserProperty;
    usersService.saveUserProperty.and.returnValue(of(userProperty) as never);

    apiService.saveUserProperty(userProperty).subscribe((response) => {
      expect(response).toEqual(userProperty);
    });

    expect(usersService.saveUserProperty).toHaveBeenCalledWith(userProperty);
  });

  it('should cancel exchange ticket', () => {
    const userTicket = {
      id: 0,
      userId: '77777777-0000-3333-0000-77777777',
      direction: 'SELL',
      epochUtc: 0,
      order: '',
      amount: 0,
      ratio: 0,
      pair: Pair.GbpUsd,
      ticketStatus: UserTicketStatus.New,
      version: 0,
    } as UserTicket;
    ticketsService.cancelExchangeTicket.and.returnValue(
      of({ success: true }) as never,
    );

    apiService.cancelExchangeTicket(userTicket).subscribe((response) => {
      expect(response).toEqual({ success: true });
    });

    expect(ticketsService.cancelExchangeTicket).toHaveBeenCalledWith(
      userTicket,
    );
  });

  it('should load currency rates', () => {
    const mockOperations = [
      {
        pair: 'EUR_CHF',
        buyAmount: 1,
        sellAmount: 3,
        buyRate: 2,
        sellRate: 3,
      },
      {
        pair: 'EUR_GBP',
        buyAmount: 1,
        sellAmount: 3,
        buyRate: 2,
        sellRate: 3,
      },
    ] as CurrencyRate[];
    ratesService.loadCurrencyRates.and.returnValue(of(mockOperations) as never);

    apiService.loadCurrencyRates().subscribe((operations) => {
      expect(operations).toEqual(mockOperations);
    });

    expect(ratesService.loadCurrencyRates).toHaveBeenCalled();
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

  it('should load timezones', () => {
    const mockTimezones = [
      { offset: 1, name: 'timezone1' },
      { offset: 2, name: 'timezone2' },
      { offset: 3, name: 'timezone3' },
    ] as TimezoneData[];
    dictionariesService.loadTimezoneList.and.returnValue(
      of(mockTimezones) as never,
    );

    apiService.loadTimezoneList().subscribe((operations) => {
      expect(operations).toEqual(mockTimezones);
    });

    expect(dictionariesService.loadTimezoneList).toHaveBeenCalled();
  });

  it('should load unicode locales', () => {
    const mockLocales = ['a', 'b', 'c'] as string[];
    dictionariesService.loadUnicodeLocalesList.and.returnValue(
      of(mockLocales) as never,
    );

    apiService.loadUnicodeLocalesList().subscribe((operations) => {
      expect(operations).toEqual(mockLocales);
    });

    expect(dictionariesService.loadUnicodeLocalesList).toHaveBeenCalled();
  });
  it('should load system messages', () => {
    const mockSystemMessages = [
      {
        messageText: 'messageText',
        id: 'id',
        version: 2,
        active: true,
        priority: MessagePriority.High,
      },
    ] as SystemMessage[];
    systemService.loadSystemMessageList.and.returnValue(
      of(mockSystemMessages) as never,
    );

    apiService.loadSystemMessageList().subscribe((operations) => {
      expect(operations).toEqual(mockSystemMessages);
    });

    expect(systemService.loadSystemMessageList).toHaveBeenCalled();
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

  it('should load system currency list', () => {
    const systemCurrencyList = [
      {
        currency: 'EUR',
        id: 1,
        minimumExchange: 23,
      },
    ] as SystemCurrency[];
    systemService.loadSystemCurrencyList.and.returnValue(
      of(systemCurrencyList) as never,
    );

    apiService.loadSystemCurrencyList().subscribe((response) => {
      expect(response).toEqual(systemCurrencyList);
    });

    expect(systemService.loadSystemCurrencyList).toHaveBeenCalled();
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

  it('should save user address', () => {
    const userBankAccount: UserBankAccount = {
      id: 'id',
      userAccountId: 'userAccountId',
      version: 2,
      accountNumber: 'accountNumber',
      countryCode: 'cc',
      createdDateUtc: 'createdDateUtc',
      verifiedDateUtc: 'verifiedDateUtc',
    };
    accountsService.saveBankAccount.and.returnValue(
      of(userBankAccount) as never,
    );

    apiService.saveBankAccount(userBankAccount).subscribe((response) => {
      expect(response).toEqual(userBankAccount);
    });

    expect(accountsService.saveBankAccount).toHaveBeenCalledWith(
      userBankAccount,
    );
  });

  it('should load user bank account amount', () => {
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
    accountsService.loadBankAccountList.and.returnValue(
      of(userBankAccountResponse) as never,
    );
    apiService.loadBankAccountList('EUR').subscribe((response) => {
      expect(response).toEqual(userBankAccountResponse);
    });

    expect(accountsService.loadBankAccountList).toHaveBeenCalledWith('EUR');
  });
});
