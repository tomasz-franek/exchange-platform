import {TestBed} from '@angular/core/testing';
import {ApiService} from './api.service'; // Adjust the import path as necessary
import {SystemService} from '../api/api/system.service';
import {BuildInfo} from '../api/model/buildInfo';
import {AdminAccountsService} from '../api/api/adminAccounts.service';
import {AdminReportsService} from '../api/api/adminReports.service';
import {of} from 'rxjs';
import {AdminStatisticsService} from '../api/api/adminStatistics.service';
import {AdminTransactionsService, Transaction} from '../api';
import {UserAccount} from '../api/model/userAccount';
import {AccountsReportResponse} from '../api/model/accountsReportResponse';
import {UsersStatisticResponse} from '../api/model/usersStatisticResponse';

describe('ApiService', () => {
  let apiService: ApiService;
  let systemService: jasmine.SpyObj<SystemService>;
  let adminAccountsService: jasmine.SpyObj<AdminAccountsService>;
  let adminReportsService: jasmine.SpyObj<AdminReportsService>;
  let adminStatisticsService: jasmine.SpyObj<AdminStatisticsService>;
  let adminTransactionsService: jasmine.SpyObj<AdminTransactionsService>;

  beforeEach(() => {
    const systemServiceSpy = jasmine.createSpyObj('SystemService', [
      'loadBuildInfo',
    ]);
    const accountServiceSpy = jasmine.createSpyObj('AdminAccountsService', [
      'loadAccounts',
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

    TestBed.configureTestingModule({
      providers: [
        ApiService,
        {provide: SystemService, useValue: systemServiceSpy},
        {provide: AdminAccountsService, useValue: accountServiceSpy},
        {provide: AdminReportsService, useValue: adminReportsServiceSpy},
        {provide: AdminStatisticsService, useValue: adminStatisticsServiceSpy},
        {provide: AdminTransactionsService, useValue: adminTransactionsServiceSpy},
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
      active:1,
      all:2,
      blocked:3
    } as UsersStatisticResponse;
    adminStatisticsService.loadUsersStatistic.and.returnValue(of(mockUsersStatisticResponse) as any);

    apiService.loadUsersStatistic({userId:'1'}).subscribe((operations) => {
      expect(operations).toEqual(mockUsersStatisticResponse);
    });

    expect(adminStatisticsService.loadUsersStatistic).toHaveBeenCalled();
  });
  it('should select transactions', () => {
    const mockUsersStatisticResponse = [{dateUTC:'',value:200}] as Transaction[];
    adminTransactionsService.selectTransactions.and.returnValue(of(mockUsersStatisticResponse) as any);

    apiService.selectTransactions({dateFromUTC:'',dateToUTC:''}).subscribe((operations) => {
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
});
