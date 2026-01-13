import type { MockedObject } from "vitest";
import { fakeAsync, TestBed } from '@angular/core/testing';
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
    let apiService: MockedObject<ApiService>;
    let messageService: MockedObject<MessageService>;
    let translateService: MockedObject<TranslateService>;

    beforeEach(async () => {
        const translateServiceSpy = {
            instant: vi.fn().mockName("TranslateService.instant")
        };
        const apiServiceSpy = {
            loadSystemMessageList: vi.fn().mockName("ApiService.loadSystemMessageList")
        };
        const messageServiceSpy = {
            add: vi.fn().mockName("MessageService.add")
        };

        TestBed.configureTestingModule({
            providers: [
                { provide: TranslateService, useValue: translateServiceSpy },
                { provide: MessageService, useValue: messageServiceSpy },
                { provide: ApiService, useValue: apiServiceSpy },
            ],
        });

        apiService = TestBed.inject(ApiService) as MockedObject<ApiService>;
        messageService = TestBed.inject(MessageService) as MockedObject<MessageService>;
        translateService = TestBed.inject(TranslateService) as MockedObject<TranslateService>;
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
            apiService.loadSystemMessageList.mockReturnValue(of(systemMessages) as any);
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
            translateService.instant.mockReturnValue('error');
            apiService.loadSystemMessageList.mockReturnValue(throwError(() => new HttpErrorResponse({})));
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
                detail: 'errorHttp failure response for (unknown url): undefined undefined',
            });
            expect(translateService.instant).toHaveBeenCalledWith('ERRORS.LOAD');
        }));
    });
});
