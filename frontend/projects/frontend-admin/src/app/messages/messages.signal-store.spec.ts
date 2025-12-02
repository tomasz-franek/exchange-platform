import {fakeAsync, TestBed} from '@angular/core/testing';
import {MockProvider} from 'ng-mocks';
import {MessageService} from 'primeng/api';
import {TranslateService} from '@ngx-translate/core';
import {ApiService} from '../../services/api.service';
import {of, Subject, throwError} from 'rxjs';
import {SelectTransactionRequest} from '../api/model/selectTransactionRequest';
import {patchState} from '@ngrx/signals';
import {unprotected} from '@ngrx/signals/testing';
import {HttpErrorResponse} from '@angular/common/http';
import {MessageStore} from './messages.signal-store';
import {SystemMessage} from '../api/model/systemMessage';

describe('MessagesSignalStore', () => {
  beforeEach(async () => {
    TestBed.configureTestingModule({
      providers: [
        MockProvider(ApiService),
        MockProvider(MessageService),
        MockProvider(TranslateService)
      ],
    });
  });

  describe('loadSystemMessageList', () => {
    it('should set isLoading true', () => {
      // given
      const service = TestBed.inject(ApiService);
      spyOn(service, 'loadSystemMessageList').and.returnValue(new Subject<any>());
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
      const apiService = TestBed.inject(ApiService);
      const systemMessages: SystemMessage[] = [{
        messageText: 'text',
        active: true,
        dateFromUtc: 'dateFromUtc',
        dateToUtc: 'dateToUtc',
        id: 'id',
        priority: "HIGH",
        version: 1
      }, {
        messageText: 'text2',
        active: true,
        dateFromUtc: 'dateFromUtc',
        dateToUtc: 'dateToUtc',
        id: 'id',
        priority: "LOW",
        version: 2
      }];
      spyOn(apiService, 'loadSystemMessageList').and.returnValue(of(systemMessages) as any);
      const messageStore = TestBed.inject(MessageStore);
      const request = {} as SelectTransactionRequest;
      patchState(unprotected(messageStore), {
        systemMessages: [],
        isLoading: false,
      });

      // when
      messageStore.loadSystemMessageList();

      // then
      expect(messageStore.systemMessages()).toEqual(systemMessages);
    });

    it('should call messageService.add with error message when backend returns error', fakeAsync(() => {
      // given
      const translateService = TestBed.inject(TranslateService);
      spyOn(translateService, 'instant').and.returnValue('error');
      const messageService = TestBed.inject(MessageService);
      spyOn(messageService, 'add');
      const apiService = TestBed.inject(ApiService);
      spyOn(apiService, 'loadSystemMessageList').and.returnValue(
        throwError(() => new HttpErrorResponse({}))
      );
      const messageStore = TestBed.inject(MessageStore);
      patchState(unprotected(messageStore), {
        systemMessages: [{
          messageText: 'text2',
          active: true,
          dateFromUtc: 'dateFromUtc',
          dateToUtc: 'dateToUtc',
          id: 'id',
          priority: "LOW",
          version: 2
        }],
        isLoading: false,
      });

      // when
      messageStore.loadSystemMessageList();

      // then
      expect(messageService.add).toHaveBeenCalledWith({
        severity: 'error',
        detail: 'errorHttp failure response for (unknown url): undefined undefined'
      });
      expect(translateService.instant).toHaveBeenCalledWith('ERRORS.LOAD');
      expect(messageStore.systemMessages()).toEqual([]);
    }));
  })

  describe('saveSystemMessage', () => {
    it('should set isLoading true', () => {
      // given
      const service = TestBed.inject(ApiService);
      spyOn(service, 'saveSystemMessage').and.returnValue(new Subject<any>());
      spyOn(service, 'updateSystemMessage').and.returnValue(new Subject<any>());
      const messageStore = TestBed.inject(MessageStore);
      const request = {
        messageText: 'message',
        version: 1,
        priority: "LOW",
        dateToUtc: 'date',
        id: 'id',
        dateFromUtc: 'dateUtc',
        active: false
      } as SystemMessage;
      patchState(unprotected(messageStore), {
        isLoading: false,
      });

      // when
      messageStore.saveSystemMessage(request);

      // then
      expect(messageStore.isLoading()).toBeTrue();
    });

    it('should set editedSystemMessage when backend return saved record', () => {
      // given
      const apiService = TestBed.inject(ApiService);
      const savedMessage = {
        messageText: 'message',
        version: 1,
        priority: "LOW",
        dateToUtc: 'date',
        id: undefined,
        dateFromUtc: 'dateUtc',
        active: false
      } as SystemMessage;
      spyOn(apiService, 'saveSystemMessage').and.returnValue(of(savedMessage) as any);
      const messageStore = TestBed.inject(MessageStore);
      const request = {
        messageText: 'message',
        version: 1,
        priority: "LOW",
        dateToUtc: 'date',
        id: undefined,
        dateFromUtc: 'dateUtc',
        active: false
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
      expect(apiService.saveSystemMessage).toHaveBeenCalledOnceWith(request);
    });

    it('should set editedSystemMessage when backend return updated record', () => {
      // given
      const apiService = TestBed.inject(ApiService);
      const savedMessage = {
        messageText: 'message',
        version: 1,
        priority: "LOW",
        dateToUtc: 'date',
        id: '1',
        dateFromUtc: 'dateUtc',
        active: false
      } as SystemMessage;
      spyOn(apiService, 'updateSystemMessage').and.returnValue(of(savedMessage) as any);
      const messageStore = TestBed.inject(MessageStore);
      const request = {
        messageText: 'message',
        version: 1,
        priority: "LOW",
        dateToUtc: 'date',
        id: '1',
        dateFromUtc: 'dateUtc',
        active: false
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
      expect(apiService.updateSystemMessage).toHaveBeenCalledOnceWith(request);
    });

    it('should call messageService.add with error message when backend returns error', fakeAsync(() => {
      // given
      const translateService = TestBed.inject(TranslateService);
      spyOn(translateService, 'instant').and.returnValue('error');
      const messageService = TestBed.inject(MessageService);
      spyOn(messageService, 'add');
      const apiService = TestBed.inject(ApiService);
      spyOn(apiService, 'saveSystemMessage').and.returnValue(
        throwError(() => new HttpErrorResponse({}))
      );
      spyOn(apiService, 'updateSystemMessage').and.returnValue(
        throwError(() => new HttpErrorResponse({}))
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
          }
        ],
        isLoading: false,
      });

      // when
      messageStore.saveSystemMessage(request);

      // then
      expect(messageService.add).toHaveBeenCalledWith({
        severity: 'error',
        detail: 'errorHttp failure response for (unknown url): undefined undefined'
      });
      expect(translateService.instant).toHaveBeenCalledWith('ERRORS.SEND');
      expect(messageStore.systemMessages()).toEqual([]);
      expect(messageStore.editedSystemMessage()).toEqual(undefined);
    }));
  })
})
