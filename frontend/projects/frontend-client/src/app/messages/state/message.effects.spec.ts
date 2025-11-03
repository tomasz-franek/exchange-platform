import { Actions } from '@ngrx/effects';

import { TestBed } from '@angular/core/testing';
import { provideMockActions } from '@ngrx/effects/testing';

import { cold, hot } from 'jasmine-marbles';
import { ApiService } from '../../../services/api/api.service';
import { HttpErrorResponse } from '@angular/common/http';
import { of, throwError } from 'rxjs';
import { MessageEffects } from './message.effects';
import {
  loadMessageListAction,
  loadMessageListActionSuccess,
} from './message.actions';
import { SystemMessage } from '../../api/model/systemMessage';
import { MessagePriority } from '../../api/model/messagePriority';

describe('MessageEffects', () => {
  let effects: MessageEffects;
  let actions$: Actions;
  let apiService: jasmine.SpyObj<ApiService>;

  beforeEach(() => {
    const apiServiceSpy = jasmine.createSpyObj('ApiService', [
      'loadSystemMessageList',
    ]);
    TestBed.configureTestingModule({
      providers: [
        MessageEffects,
        provideMockActions(() => actions$),
        { provide: ApiService, useValue: apiServiceSpy },
      ],
    });

    effects = TestBed.inject(MessageEffects);
    apiService = TestBed.inject(ApiService) as jasmine.SpyObj<ApiService>;
  });

  it('should return loadMessageListActionSuccess on successful systemMessages', () => {
    const systemMessageList: SystemMessage[] = [
      { id: '1', messageText: 'a', priority: MessagePriority.High },
      { id: '2', messageText: 'b', priority: MessagePriority.High },
    ];

    const action = loadMessageListAction();
    const outcome = loadMessageListActionSuccess({ systemMessageList });

    actions$ = hot('-a', { a: action });
    apiService.loadSystemMessageList.and.returnValue(
      of(systemMessageList) as any,
    );
    const expected = cold('-c', { c: outcome });
    expect(effects.loadSystemMessageList$).toBeObservable(expected);
  });

  it('should return loadMessageListActionFailure on failed loadSystemMessageList', () => {
    const errorResponse = new HttpErrorResponse({});
    apiService.loadSystemMessageList.and.returnValue(
      throwError(() => errorResponse),
    );
    actions$ = of(loadMessageListAction());

    effects.loadSystemMessageList$.subscribe((action) => {
      expect(action).toEqual({
        type: '[Message] Load Message List Action Failure',
        errorResponse,
      });
      expect(apiService.loadSystemMessageList).toHaveBeenCalled();
    });
  });
});
