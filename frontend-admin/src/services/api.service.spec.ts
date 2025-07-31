import {TestBed} from '@angular/core/testing';
import {ApiService} from './api.service';
import {SystemService} from '../app/api/api/system.service';
import {BuildInfo} from '../app/api/model/buildInfo';
import {AdminAccountsService} from '../app/api/api/adminAccounts.service';
import {AdminReportsService} from '../app/api/api/adminReports.service';
import {of} from 'rxjs';
import {AdminStatisticsService} from '../app/api/api/adminStatistics.service';
import {Transaction} from '../app/api/model/transaction';
import {UserAccount} from '../app/api/model/userAccount';
import {AccountsReportResponse} from '../app/api/model/accountsReportResponse';
import {UsersStatisticResponse} from '../app/api/model/usersStatisticResponse';
import {AdminTransactionsService} from "../app/api/api/adminTransactions.service";
import {AdminMessagesService} from "../app/api";
import {SystemMessage} from "../app/api/model/systemMessage";
import {UserAccountOperation} from '../app/api/model/userAccountOperation';
import {AdminUsersService} from '../app/api/api/adminUsers.service';
import {LoadUserRequest} from '../app/api/model/loadUserRequest';
import {UserData} from '../app/api/model/userData';
import {UsersService} from '../app/api/api/users.service';
import {UserProperty} from '../app/api/model/userProperty';
import {DictionariesService} from '../app/api/api/dictionaries.service';

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

  beforeEach(() => {
    const systemServiceSpy = jasmine.createSpyObj('SystemService', [
      'loadBuildInfo',
    ]);
    const accountServiceSpy = jasmine.createSpyObj('AdminAccountsService', [
      'loadAccounts',
      'saveAccountDeposit',
      'saveWithdrawRequest'
    ]);
    const adminReportsServiceSpy = jasmine.createSpyObj('AdminReportsService', [
      'generateAccountsReport',
    ]);
    const adminStatisticsServiceSpy = jasmine.createSpyObj('AdminStatisticsService', [
      'loadUsersStatistic',
    ]);
    const adminTransactionsServiceSpy = jasmine.createSpyObj('AdminTransactionsService', [
      'loadTransactionList',
    ]);
    const adminMessagesServiceSpy = jasmine.createSpyObj('AdminMessagesService', [
      'saveSystemMessage',
      'updateSystemMessage',
    ]);
    const adminUsersServiceSpy = jasmine.createSpyObj('AdminUsersService', [
      'loadUserList'
    ]);

    const usersServiceSpy = jasmine.createSpyObj('UsersService', [
      'getUserProperty',
      'saveUserProperty',
    ])

    const dictionariesServiceSpy = jasmine.createSpyObj('DictionariesService', [
      'loadTimezoneList',
      'loadUnicodeLocalesList',
    ])


    TestBed.configureTestingModule({
      providers: [
        ApiService,
        {provide: SystemService, useValue: systemServiceSpy},
        {provide: AdminAccountsService, useValue: accountServiceSpy},
        {provide: AdminReportsService, useValue: adminReportsServiceSpy},
        {provide: AdminStatisticsService, useValue: adminStatisticsServiceSpy},
        {provide: AdminTransactionsService, useValue: adminTransactionsServiceSpy},
        {provide: AdminMessagesService, useValue: adminMessagesServiceSpy},
        {provide: AdminUsersService, useValue: adminUsersServiceSpy},
        {provide: UsersService, useValue: usersServiceSpy},
        {provide: DictionariesService, useValue: dictionariesServiceSpy},
      ],
    });
    apiService = TestBed.inject(ApiService);
    systemService = TestBed.inject(
      SystemService,
    ) as jasmine.SpyObj<SystemService>;
    adminAccountsService = TestBed.inject(
      AdminAccountsService,
    ) as jasmine.SpyObj<AdminAccountsService>
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
    usersService = TestBed.inject(
      UsersService,
    ) as jasmine.SpyObj<UsersService>;
    dictionariesService = TestBed.inject(
      DictionariesService,
    ) as jasmine.SpyObj<DictionariesService>;
  });


  it('should load accounts', () => {
    const mockUserAccounts = [{
      currency: "CHF",
      version: 2,
      id: 'id'
    }] as UserAccount[];
    adminAccountsService.loadAccounts.and.returnValue(of(mockUserAccounts) as any);

    apiService.loadAccounts({userId: '1'}).subscribe((operations) => {
      expect(operations).toEqual(mockUserAccounts);
    });

    expect(adminAccountsService.loadAccounts).toHaveBeenCalled();
  });

  it('should generate accounts report', () => {
    const mockAccountsReportResponse = {
      reportDateUTC: '2020-01-01',
    } as AccountsReportResponse;
    adminReportsService.generateAccountsReport.and.returnValue(of(mockAccountsReportResponse) as any);

    apiService.generateAccountsReport({userId: '1'}).subscribe((operations) => {
      expect(operations).toEqual(mockAccountsReportResponse);
    });

    expect(adminReportsService.generateAccountsReport).toHaveBeenCalled();
  });

  it('should load users statistic', () => {
    const mockUsersStatisticResponse = {
      active: 1,
      all: 2,
      blocked: 3
    } as UsersStatisticResponse;
    adminStatisticsService.loadUsersStatistic.and.returnValue(of(mockUsersStatisticResponse) as any);

    apiService.loadUsersStatistic({userId: '1'}).subscribe((operations) => {
      expect(operations).toEqual(mockUsersStatisticResponse);
    });

    expect(adminStatisticsService.loadUsersStatistic).toHaveBeenCalled();
  });
  it('should select transactions', () => {
    const mockUsersStatisticResponse = [{dateUTC: '', amount: 200}] as Transaction[];
    adminTransactionsService.loadTransactionList.and.returnValue(of(mockUsersStatisticResponse) as any);

    apiService.loadTransactionList({dateFromUTC: '', dateToUTC: ''}).subscribe((operations) => {
      expect(operations).toEqual(mockUsersStatisticResponse);
    });

    expect(adminTransactionsService.loadTransactionList).toHaveBeenCalled();
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
    systemService.loadBuildInfo.and.returnValue(of(mockBuildInfo) as any);

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
      priority: 2
    } as SystemMessage;
    adminMessagesService.saveSystemMessage.and.returnValue(of(systemMessage) as any);

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
      priority: 2
    } as SystemMessage;
    adminMessagesService.updateSystemMessage.and.returnValue(of(systemMessage) as any);

    apiService.updateSystemMessage(systemMessage).subscribe((operations) => {
      expect(operations).toEqual(systemMessage);
    });

    expect(adminMessagesService.updateSystemMessage).toHaveBeenCalled();
  });

  it('should save account-deposit', () => {
    const userAccountOperationRequest = {} as UserAccountOperation;
    adminAccountsService.saveAccountDeposit.and.returnValue(
      of({success: true}) as any,
    );

    apiService
    .saveAccountDeposit(userAccountOperationRequest)
    .subscribe((response) => {
      expect(response).toEqual({success: true});
    });

    expect(adminAccountsService.saveAccountDeposit).toHaveBeenCalledWith(
      userAccountOperationRequest,
    );
  });

  it('should save withdraw request', () => {
    const userAccountOperationRequest = {} as UserAccountOperation;
    adminAccountsService.saveWithdrawRequest.and.returnValue(
      of({success: true}) as any,
    );

    apiService
    .saveWithdrawRequest(userAccountOperationRequest)
    .subscribe((response) => {
      expect(response).toEqual({success: true});
    });

    expect(adminAccountsService.saveWithdrawRequest).toHaveBeenCalledWith(
      userAccountOperationRequest,
    );
  });

  it('should load user list for request', () => {
    const loadUserRequest = [] as LoadUserRequest;
    const users = [
      {email: 'email1', userId: 'userId1', name: 'name1'},
      {email: 'email2', userId: 'userId2', name: 'name2'},
    ] as UserData[];
    adminUsersService.loadUserList.and.returnValue(of(users) as any);

    apiService
    .loadUserList(loadUserRequest)
    .subscribe((response) => {
      expect(response).toEqual(users);
    });

    expect(adminUsersService.loadUserList).toHaveBeenCalledWith(
      loadUserRequest,
    );
  });

  it('should load user property for request', () => {
    const userProperty = {userId: 'userId',} as UserProperty;
    usersService.getUserProperty.and.returnValue(of(userProperty) as any);

    apiService
    .getUserProperty()
    .subscribe((response) => {
      expect(response).toEqual(userProperty);
    });

    expect(usersService.getUserProperty).toHaveBeenCalled();
  });

  it('should save user property for request', () => {
    const userProperty = {userId: 'userId',} as UserProperty;
    usersService.saveUserProperty.and.returnValue(of(userProperty) as any);

    apiService
    .saveUserProperty(userProperty)
    .subscribe((response) => {
      expect(response).toEqual(userProperty);
    });

    expect(usersService.saveUserProperty).toHaveBeenCalledWith(userProperty);
  });

  it('should load timezones for request', () => {
    const timezones = ["a", "b"] as string[];
    dictionariesService.loadTimezoneList.and.returnValue(of(timezones) as any);

    apiService
    .loadTimezoneList()
    .subscribe((response) => {
      expect(response).toEqual(timezones);
    });

    expect(dictionariesService.loadTimezoneList).toHaveBeenCalled();
  });

  it('should load unicode locales for request', () => {
    const timezones = ["a", "b"] as string[];
    dictionariesService.loadUnicodeLocalesList.and.returnValue(of(timezones) as any);

    apiService
    .loadUnicodeLocalesList()
    .subscribe((response) => {
      expect(response).toEqual(timezones);
    });

    expect(dictionariesService.loadUnicodeLocalesList).toHaveBeenCalled();
  });
});
