import {fakeAsync, TestBed} from '@angular/core/testing';
import {MockProvider} from 'ng-mocks';
import {ApiService} from '../../services/api/api.service';
import {MessageService} from 'primeng/api';
import {TranslateService} from '@ngx-translate/core';
import {of, Subject, throwError} from 'rxjs';
import {patchState} from '@ngrx/signals';
import {unprotected} from '@ngrx/signals/testing';
import {HttpErrorResponse} from '@angular/common/http';
import {MessageStore} from './messages.signal-store';
import {SystemMessage} from '../api/model/systemMessage';

describe('MessageStore', () => {
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
        systemMessages: [],
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
    }));
  })
})
