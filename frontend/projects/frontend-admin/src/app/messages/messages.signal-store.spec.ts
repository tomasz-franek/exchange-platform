import type { MockedObject } from 'vitest';
import { vi } from 'vitest';
import { TestBed } from '@angular/core/testing';
import { MessageService } from 'primeng/api';
import { TranslateService } from '@ngx-translate/core';
import { ApiService } from '../../services/api.service';
import { of, Subject, throwError } from 'rxjs';
import { SelectTransactionRequest } from '../api/model/selectTransactionRequest';
import { patchState } from '@ngrx/signals';
import { unprotected } from '@ngrx/signals/testing';
import { HttpErrorResponse } from '@angular/common/http';
import { MessageStore } from './messages.signal-store';
import { SystemMessage } from '../api/model/systemMessage';

describe('MessagesSignalStore', () => {
  let apiService: MockedObject<ApiService>;
  let messageService: MockedObject<MessageService>;
  let translateService: MockedObject<TranslateService>;

  beforeEach(async () => {
    const translateServiceSpy = {
      instant: vi.fn().mockName('TranslateService.instant'),
    };
    const apiServiceSpy = {
      loadSystemMessageList: vi
        .fn()
        .mockName('ApiService.loadSystemMessageList'),
      saveSystemMessage: vi.fn().mockName('ApiService.saveSystemMessage'),
      updateSystemMessage: vi.fn().mockName('ApiService.updateSystemMessage'),
    };
    const messageServiceSpy = {
      add: vi.fn().mockName('MessageService.add'),
    };
    TestBed.configureTestingModule({
      providers: [
        { provide: TranslateService, useValue: translateServiceSpy },
        { provide: MessageService, useValue: messageServiceSpy },
        { provide: ApiService, useValue: apiServiceSpy },
      ],
    });

    apiService = TestBed.inject(ApiService) as MockedObject<ApiService>;
    messageService = TestBed.inject(
      MessageService,
    ) as MockedObject<MessageService>;
    translateService = TestBed.inject(
      TranslateService,
    ) as MockedObject<TranslateService>;
  });

  describe('loadSystemMessageList', () => {
    it('should set isLoading true', () => {
      // given
      apiService.loadSystemMessageList.mockReturnValue(new Subject<any>());
      const messageStore = TestBed.inject(MessageStore);
      patchState(unprotected(messageStore), {
        isLoading: false,
      });

      // when
      messageStore.loadSystemMessageList();

      // then
      expect(messageStore.isLoading()).toBe(true);
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
      apiService.loadSystemMessageList.mockReturnValue(
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
      translateService.instant.mockReturnValue('error');
      apiService.loadSystemMessageList.mockReturnValue(
        throwError(() => new HttpErrorResponse({})),
      );
      const messageStore = TestBed.inject(MessageStore);
      patchState(unprotected(messageStore), {
        systemMessages: [
          {
            messageText: 'text2',
            active: true,
            dateFromUtc: 'dateFromUtc',
            dateToUtc: 'dateToUtc',
            id: 'id',
            priority: 'LOW',
            version: 2,
          },
        ],
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
      expect(messageStore.systemMessages()).toEqual([]);
    });
  });

  describe('saveSystemMessage', () => {
    it('should set isLoading true', () => {
      // given
      apiService.saveSystemMessage.mockReturnValue(new Subject<any>());
      apiService.updateSystemMessage.mockReturnValue(new Subject<any>());
      const messageStore = TestBed.inject(MessageStore);
      const request = {
        messageText: 'message',
        version: 1,
        priority: 'LOW',
        dateToUtc: 'date',
        id: 'id',
        dateFromUtc: 'dateUtc',
        active: false,
      } as SystemMessage;
      patchState(unprotected(messageStore), {
        isLoading: false,
      });

      // when
      messageStore.saveSystemMessage(request);

      // then
      expect(messageStore.isLoading()).toBe(true);
    });

    it('should set editedSystemMessage when backend return saved record', () => {
      // given
      const savedMessage = {
        messageText: 'message',
        version: 1,
        priority: 'LOW',
        dateToUtc: 'date',
        id: undefined,
        dateFromUtc: 'dateUtc',
        active: false,
      } as SystemMessage;
      apiService.saveSystemMessage.mockReturnValue(of(savedMessage) as any);
      const messageStore = TestBed.inject(MessageStore);
      const request = {
        messageText: 'message',
        version: 1,
        priority: 'LOW',
        dateToUtc: 'date',
        id: undefined,
        dateFromUtc: 'dateUtc',
        active: false,
      } as SystemMessage;
      patchState(unprotected(messageStore), {
        editedSystemMessage: {
          messageText: 'text-new',
        } as SystemMessage,

        isLoading: false,
      });

      // when
      messageStore.saveSystemMessage(request);

      // then
      expect(messageStore.editedSystemMessage()).toEqual(savedMessage);
      expect(apiService.saveSystemMessage).toHaveBeenCalledTimes(1);
      expect(apiService.saveSystemMessage).toHaveBeenCalledWith(request);
    });

    it('should set editedSystemMessage when backend return updated record', () => {
      // given
      const savedMessage = {
        messageText: 'message',
        version: 1,
        priority: 'LOW',
        dateToUtc: 'date',
        id: '1',
        dateFromUtc: 'dateUtc',
        active: false,
      } as SystemMessage;
      apiService.updateSystemMessage.mockReturnValue(of(savedMessage) as any);
      const messageStore = TestBed.inject(MessageStore);
      const request = {
        messageText: 'message',
        version: 1,
        priority: 'LOW',
        dateToUtc: 'date',
        id: '1',
        dateFromUtc: 'dateUtc',
        active: false,
      } as SystemMessage;
      patchState(unprotected(messageStore), {
        editedSystemMessage: {
          messageText: 'text-new',
        } as SystemMessage,

        isLoading: false,
      });

      // when
      messageStore.saveSystemMessage(request);

      // then
      expect(messageStore.editedSystemMessage()).toEqual(savedMessage);
      expect(apiService.updateSystemMessage).toHaveBeenCalledTimes(1);
      expect(apiService.updateSystemMessage).toHaveBeenCalledWith(request);
    });

    it('should call messageService.add with error message when backend returns error', () => {
      // given
      translateService.instant.mockReturnValue('error');
      apiService.saveSystemMessage.mockReturnValue(
        throwError(() => new HttpErrorResponse({})),
      );
      apiService.updateSystemMessage.mockReturnValue(
        throwError(() => new HttpErrorResponse({})),
      );
      const messageStore = TestBed.inject(MessageStore);
      const request = {} as SelectTransactionRequest;
      patchState(unprotected(messageStore), {
        editedSystemMessage: {
          messageText: 'text-new',
        } as SystemMessage,
        systemMessages: [
          {
            messageText: 'text-new',
          },
        ],
        isLoading: false,
      });

      // when
      messageStore.saveSystemMessage(request);

      // then
      expect(messageService.add).toHaveBeenCalledWith({
        severity: 'error',
        detail:
          'errorHttp failure response for (unknown url): undefined undefined',
      });
      expect(translateService.instant).toHaveBeenCalledWith('ERRORS.SEND');
      expect(messageStore.systemMessages()).toEqual([]);
      expect(messageStore.editedSystemMessage()).toEqual(undefined);
    });
  });
});
