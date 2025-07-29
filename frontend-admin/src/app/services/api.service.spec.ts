import {TestBed} from '@angular/core/testing';
import {ApiService} from './api.service';
import {SystemService} from '../api/api/system.service';
import {BuildInfo} from '../api/model/buildInfo';
import {AdminAccountsService} from '../api/api/adminAccounts.service';
import {AdminReportsService} from '../api/api/adminReports.service';
import {of} from 'rxjs';
import {AdminStatisticsService} from '../api/api/adminStatistics.service';
import {Transaction} from '../api/model/transaction';
import {UserAccount} from '../api/model/userAccount';
import {AccountsReportResponse} from '../api/model/accountsReportResponse';
import {UsersStatisticResponse} from '../api/model/usersStatisticResponse';
import {AdminTransactionsService} from "../api/api/adminTransactions.service";
import {AdminMessagesService} from "../api";
import {SystemMessage} from "../api/model/systemMessage";
import {
  UserAccountOperation
} from "../../../../frontend-client/src/app/api/model/userAccountOperation";

describe('ApiService', () => {
  let apiService: ApiService;
  let systemService: jasmine.SpyObj<SystemService>;
  let adminAccountsService: jasmine.SpyObj<AdminAccountsService>;
  let adminReportsService: jasmine.SpyObj<AdminReportsService>;
  let adminStatisticsService: jasmine.SpyObj<AdminStatisticsService>;
  let adminTransactionsService: jasmine.SpyObj<AdminTransactionsService>;
  let adminMessagesService: jasmine.SpyObj<AdminMessagesService>;

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
      'selectTransactions',
    ]);
    const adminMessagesServiceSpy = jasmine.createSpyObj('AdminMessagesService', [
      'saveSystemMessage',
      'updateSystemMessage',
    ]);

    TestBed.configureTestingModule({
      providers: [
        ApiService,
        {provide: SystemService, useValue: systemServiceSpy},
        {provide: AdminAccountsService, useValue: accountServiceSpy},
        {provide: AdminReportsService, useValue: adminReportsServiceSpy},
        {provide: AdminStatisticsService, useValue: adminStatisticsServiceSpy},
        {provide: AdminTransactionsService, useValue: adminTransactionsServiceSpy},
        {provide: AdminMessagesService, useValue: adminMessagesServiceSpy},
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
    adminTransactionsService.selectTransactions.and.returnValue(of(mockUsersStatisticResponse) as any);

    apiService.selectTransactions({dateFromUTC: '', dateToUTC: ''}).subscribe((operations) => {
      expect(operations).toEqual(mockUsersStatisticResponse);
    });

    expect(adminTransactionsService.selectTransactions).toHaveBeenCalled();
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
});
