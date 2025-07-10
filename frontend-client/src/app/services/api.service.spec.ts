import { TestBed } from '@angular/core/testing';
import { ApiService } from './api.service'; // Adjust the import path as necessary
import { of } from 'rxjs';
import { TicketsService } from '../api/api/tickets.service';
import { AccountsService } from '../api/api/accounts.service';
import { UsersService } from '../api/api/users.service';
import { UserAccountOperation } from '../api/model/userAccountOperation';
import { AccountBalance } from '../api/model/accountBalance';
import { UserAccount } from '../api/model/userAccount';
import { UserTicket } from '../api/model/userTicket';
import { UserOperation } from '../api/model/userOperation';
import { AccountOperationsRequest } from '../api/model/accountOperationsRequest';
import { UserProperty } from '../api/model/userProperty';
import { DictionariesService } from '../api/api/dictionaries.service';
import { CurrencyRate, RatesService } from '../api';
import { Pair } from '../api/model/pair';
import { UserTicketStatus } from '../api/model/userTicketStatus';
import { SystemService } from '../api/api/system.service';
import { BuildInfo } from '../api/model/buildInfo';

describe('ApiService', () => {
  let apiService: ApiService;
  let ticketsService: jasmine.SpyObj<TicketsService>;
  let accountsService: jasmine.SpyObj<AccountsService>;
  let usersService: jasmine.SpyObj<UsersService>;
  let ratesService: jasmine.SpyObj<RatesService>;
  let systemService: jasmine.SpyObj<SystemService>;

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
    ]);
    const usersServiceSpy = jasmine.createSpyObj('UsersService', [
      'getUserProperty',
      'saveUserProperty',
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
  });

  it('should save a user ticket', () => {
    const userTicket = {
      userId: 'x',
      userAccountId: 'y',
      version: 1,
      amount: 100,
      direction: 'SELL',
      id: 1,
      epochUTC: 20,
      pair: 'EUR_USD',
    } as UserTicket;
    ticketsService.saveUserTicket.and.returnValue(of({ success: true }) as any);

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
        epochUTC: 7,
        id: 2,
        direction: 'BUY',
        eventType: 'DEPOSIT',
      },
    ] as UserTicket[];
    ticketsService.loadUserTicketList.and.returnValue(of(mockTickets) as any);

    apiService.loadUserTicketList().subscribe((tickets) => {
      expect(tickets).toEqual(mockTickets);
    });

    expect(ticketsService.loadUserTicketList).toHaveBeenCalled();
  });

  it('should save account deposit', () => {
    const userAccountOperationRequest = {} as UserAccountOperation;
    accountsService.saveAccountDeposit.and.returnValue(
      of({ success: true }) as any,
    );

    apiService
      .saveAccountDeposit(userAccountOperationRequest)
      .subscribe((response) => {
        expect(response).toEqual({ success: true });
      });

    expect(accountsService.saveAccountDeposit).toHaveBeenCalledWith(
      userAccountOperationRequest,
    );
  });

  it('should save withdraw request', () => {
    const userAccountOperationRequest = {} as UserAccountOperation;
    accountsService.saveWithdrawRequest.and.returnValue(
      of({ success: true }) as any,
    );

    apiService
      .saveWithdrawRequest(userAccountOperationRequest)
      .subscribe((response) => {
        expect(response).toEqual({ success: true });
      });

    expect(accountsService.saveWithdrawRequest).toHaveBeenCalledWith(
      userAccountOperationRequest,
    );
  });

  it('should load account balance list', () => {
    const mockBalances = [
      { amount: 10, currency: 'USD', userAccountId: 'x' },
    ] as AccountBalance[];
    accountsService.loadAccountBalanceList.and.returnValue(
      of(mockBalances) as any,
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
    accountsService.createUserAccount.and.returnValue(of(userAccount) as any);

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
      of(mockOperations) as any,
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
    accountsService.updateUserAccount.and.returnValue(of(userAccount) as any);

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
    usersService.getUserProperty.and.returnValue(of(mockUserProperty) as any);

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
    usersService.saveUserProperty.and.returnValue(of({ success: true }) as any);

    apiService.saveUserProperty(userProperty).subscribe((response) => {
      expect(response).toEqual({ success: true });
    });

    expect(usersService.saveUserProperty).toHaveBeenCalledWith(userProperty);
  });

  it('should cancel exchange ticket', () => {
    const userTicket = {
      id: 0,
      userId: '77777777-0000-3333-0000-77777777',
      direction: 'SELL',
      epochUTC: 0,
      order: '',
      amount: 0,
      ratio: 0,
      pair: Pair.GbpUsd,
      ticketStatus: UserTicketStatus.New,
      version: 0,
    } as UserTicket;
    ticketsService.cancelExchangeTicket.and.returnValue(
      of({ success: true }) as any,
    );

    apiService.cancelExchangeTicket(userTicket).subscribe((response) => {
      expect(response).toEqual({ success: true });
    });

    expect(ticketsService.cancelExchangeTicket).toHaveBeenCalledWith(
      userTicket,
    );
  });

  it('should cancel exchange ticket', () => {
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
    ratesService.loadCurrencyRates.and.returnValue(of(mockOperations) as any);

    apiService.loadCurrencyRates().subscribe((operations) => {
      expect(operations).toEqual(mockOperations);
    });

    expect(ratesService.loadCurrencyRates).toHaveBeenCalled();
  });

  it('should cancel exchange ticket', () => {
    const mockBuildInfo = {
      buildTime: 'buildTime',
      branchName: 'branchName',
      commitHash: 'commitHash',
      commitTime: 'commitTime',
      moduleName: 'moduleName',
      versionNumber: 'versionNumber',
    } as BuildInfo;
    systemService.loadBuildInfo.and.returnValue(of(mockBuildInfo) as any);

    apiService.loadBuildInfo().subscribe((operations) => {
      expect(operations).toEqual(mockBuildInfo);
    });

    expect(systemService.loadBuildInfo).toHaveBeenCalled();
  });
});
