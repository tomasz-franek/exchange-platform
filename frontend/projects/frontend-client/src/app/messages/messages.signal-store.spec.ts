import { TestBed } from '@angular/core/testing';
import { ApiService } from '../../services/api/api.service';
import { MessageService } from 'primeng/api';
import { TranslateService } from '@ngx-translate/core';
import { of, Subject, throwError } from 'rxjs';
import { patchState } from '@ngrx/signals';
import { unprotected } from '@ngrx/signals/testing';
import { HttpErrorResponse } from '@angular/common/http';
import { MessageStore } from './messages.signal-store';
import { SystemMessage } from '../api/model/systemMessage';

describe('MessageStore', () => {
  let apiService: jasmine.SpyObj<ApiService>;
  let messageService: jasmine.SpyObj<MessageService>;
  let translateService: jasmine.SpyObj<TranslateService>;

  beforeEach(() => {
    const translateServiceSpy = jasmine.createSpyObj('TranslateService', [
      'instant',
    ]);
    const apiServiceSpy = jasmine.createSpyObj('ApiService', [
      'loadSystemMessageList',
    ]);
    const messageServiceSpy = jasmine.createSpyObj('MessageService', ['add']);

    TestBed.configureTestingModule({
      providers: [
        { provide: TranslateService, useValue: translateServiceSpy },
        { provide: MessageService, useValue: messageServiceSpy },
        { provide: ApiService, useValue: apiServiceSpy },
      ],
    });

    apiService = TestBed.inject(ApiService) as jasmine.SpyObj<ApiService>;
    messageService = TestBed.inject(
      MessageService,
    ) as jasmine.SpyObj<MessageService>;
    translateService = TestBed.inject(
      TranslateService,
    ) as jasmine.SpyObj<TranslateService>;
  });

  describe('loadSystemMessageList', () => {
    it('should set isLoading true', () => {
      // given
      apiService.loadSystemMessageList.and.returnValue(new Subject<any>());
      const messageStore = TestBed.inject(MessageStore);
      patchState(unprotected(messageStore), {
        isLoading: false,
      });

      // when
      messageStore.loadSystemMessageList();

      // then
      expect(messageStore.isLoading()).toBeTrue();
    });

    it('should set systemMessages when backend return data', () => {
      // given
      const systemMessages: SystemMessage[] = [
        {
          messageText: 'text',
          active: true,
          dateFromUtc: 'dateFromUtc',
          dateToUtc: 'dateToUtc',
          id: 'id',
          priority: 'HIGH',
          version: 1,
        },
        {
          messageText: 'text2',
          active: true,
          dateFromUtc: 'dateFromUtc',
          dateToUtc: 'dateToUtc',
          id: 'id',
          priority: 'LOW',
          version: 2,
        },
      ];
      apiService.loadSystemMessageList.and.returnValue(
        of(systemMessages) as any,
      );
      const messageStore = TestBed.inject(MessageStore);
      patchState(unprotected(messageStore), {
        systemMessages: [],
        isLoading: false,
      });

      // when
      messageStore.loadSystemMessageList();

      // then
      expect(messageStore.systemMessages()).toEqual(systemMessages);
    });

    it('should call messageService.add with error message when backend returns error', () => {
      // given
      translateService.instant.and.returnValue('error');
      apiService.loadSystemMessageList.and.returnValue(
        throwError(() => new HttpErrorResponse({})),
      );
      const messageStore = TestBed.inject(MessageStore);
      patchState(unprotected(messageStore), {
        systemMessages: [],
        isLoading: false,
      });

      // when
      messageStore.loadSystemMessageList();

      // then
      expect(messageService.add).toHaveBeenCalledWith({
        severity: 'error',
        detail:
          'errorHttp failure response for (unknown url): undefined undefined',
      });
      expect(translateService.instant).toHaveBeenCalledWith('ERRORS.LOAD');
    });
  });
});
