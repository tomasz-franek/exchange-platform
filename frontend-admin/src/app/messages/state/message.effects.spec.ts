import {Actions} from '@ngrx/effects';
import {ApiService} from '../../../services/api.service';
import {MessageEffects} from './message.effects';
import {TestBed} from '@angular/core/testing';
import {provideMockActions} from '@ngrx/effects/testing';
import {cold, hot} from 'jasmine-marbles';
import {HttpErrorResponse} from '@angular/common/http';
import {
  loadSystemMessageListAction,
  loadSystemMessageListFailure,
  loadSystemMessageListSuccess,
  saveSystemMessageAction,
  saveSystemMessageFailure,
  saveSystemMessageSuccess,
} from './message.actions';
import {SystemMessage} from '../../api/model/systemMessage';
import {MessagePriority} from '../../api/model/messagePriority';

describe('MessageEffects', () => {
  let actions$: Actions;
  let effects: MessageEffects;
  let apiService: jasmine.SpyObj<ApiService>;

  beforeEach(() => {
    const apiServiceSpy = jasmine.createSpyObj('ApiService', [
      'saveSystemMessage',
      'updateSystemMessage',
      'loadSystemMessageList',
    ]);

    TestBed.configureTestingModule({
      providers: [
        MessageEffects,
        provideMockActions(() => actions$),
        {provide: ApiService, useValue: apiServiceSpy},
      ],
    });

    effects = TestBed.inject(MessageEffects);
    apiService = TestBed.inject(ApiService) as jasmine.SpyObj<ApiService>;
  });

  describe('saveSystemMessage$', () => {
    it('should return saveSystemMessageSuccess on successful save', () => {
      const systemMessage: SystemMessage = {
        messageText: 'Hello World!',
        priority: MessagePriority.High,
        active: false,
        version: 0,
      };
      const action = saveSystemMessageAction({systemMessage});
      const systemMessageResponse: SystemMessage = {
        messageText: 'Hello World!',
        priority: MessagePriority.Medium,
        active: false,
        version: 0,
        id: 'xx',
      };
      const completion = saveSystemMessageSuccess({
        systemMessage: systemMessageResponse,
      });

      actions$ = hot('-a-', {a: action});
      const response = cold('-b|', {b: systemMessageResponse});
      apiService.saveSystemMessage.and.returnValue(response);

      const expected = cold('--c', {c: completion});
      expect(effects.saveSystemMessage$).toBeObservable(expected);
    });

    it('should return saveSystemMessageFailure on error when save', () => {
      const systemMessage: SystemMessage = {
        messageText: 'Hello World!',
        priority: MessagePriority.Medium,
        active: false,
        version: 0,
      };
      const action = saveSystemMessageAction({systemMessage});
      const errorResponse = new HttpErrorResponse({error: 'Error'});
      const completion = saveSystemMessageFailure({
        errorResponse,
      });

      actions$ = hot('-a-', {a: action});
      const response = cold('-#', {}, errorResponse);
      apiService.saveSystemMessage.and.returnValue(response);

      const expected = cold('--c', {c: completion});
      expect(effects.saveSystemMessage$).toBeObservable(expected);
    });

    it('should return saveSystemMessageSuccess on successful update', () => {
      const systemMessage: SystemMessage = {
        messageText: 'Hello World!',
        priority: MessagePriority.Medium,
        active: false,
        version: 0,
        id: 'xx',
      };
      const action = saveSystemMessageAction({systemMessage});
      const systemMessageResponse: SystemMessage = {
        messageText: 'Hello World!',
        priority: MessagePriority.Medium,
        active: false,
        version: 0,
        id: 'xx',
      };
      const completion = saveSystemMessageSuccess({
        systemMessage: systemMessageResponse,
      });

      actions$ = hot('-a-', {a: action});
      const response = cold('-b|', {b: systemMessageResponse});
      apiService.updateSystemMessage.and.returnValue(response);

      const expected = cold('--c', {c: completion});
      expect(effects.saveSystemMessage$).toBeObservable(expected);
    });

    it('should return saveSystemMessageFailure on error when update', () => {
      const systemMessage: SystemMessage = {
        messageText: 'Hello World!',
        priority: MessagePriority.Low,
        active: false,
        version: 0,
        id: 'xx',
      };
      const action = saveSystemMessageAction({systemMessage});
      const errorResponse = new HttpErrorResponse({error: 'Error'});
      const completion = saveSystemMessageFailure({errorResponse});

      actions$ = hot('-a-', {a: action});
      const response = cold('-#', {}, errorResponse);
      apiService.updateSystemMessage.and.returnValue(response);

      const expected = cold('--c', {c: completion});
      expect(effects.saveSystemMessage$).toBeObservable(expected);
    });
  });
  describe('loadSystemMessages$', () => {
    it('should return loadSystemMessageListSuccess on successful load', () => {
      const action = loadSystemMessageListAction();
      const systemMessages = [
        {
          priority: MessagePriority.High,
          active: true,
          version: 1,
          messageText: 'Hello World!',
          id: '1',
        },
        {
          priority: MessagePriority.Low,
          active: false,
          version: 1,
          messageText: 'Hello World!',
          id: '2',
        },
      ] as SystemMessage[];
      const completion = loadSystemMessageListSuccess({systemMessages});

      actions$ = hot('-a-', {a: action});
      const response = cold('-b|', {b: systemMessages});
      apiService.loadSystemMessageList.and.returnValue(response);

      const expected = cold('--c', {c: completion});
      expect(effects.loadSystemMessages$).toBeObservable(expected);
    });

    it('should return loadSystemMessageListFailure on error', () => {
      const action = loadSystemMessageListAction();
      const errorResponse = new HttpErrorResponse({error: 'Error'});
      const completion = loadSystemMessageListFailure({
        errorResponse,
      });

      actions$ = hot('-a-', {a: action});
      const response = cold('-#', {}, errorResponse);
      apiService.loadSystemMessageList.and.returnValue(response);

      const expected = cold('--c', {c: completion});
      expect(effects.loadSystemMessages$).toBeObservable(expected);
    });
  });
});
