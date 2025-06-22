import { Component, inject, OnDestroy, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { AsyncPipe, NgForOf } from '@angular/common';
import { TranslatePipe } from '@ngx-translate/core';
import { ActivatedRoute } from '@angular/router';
import { Store } from '@ngrx/store';
import {
  AccountState,
  getUserProperty,
} from '../state/account/account.selectors';
import {
  getUserPropertyAction,
  saveUserPropertyAction,
} from '../state/account/account.actions';
import { UserProperty } from '../api/model/userProperty';
import { Observable, Subject, takeUntil } from 'rxjs';
import {
  DictionaryState,
  selectLocaleList,
  selectTimezoneList,
} from '../state/dictionary/dictionary.selectors';
import {
  loadLocaleListAction,
  loadTimezoneListAction,
} from '../state/dictionary/dictionary.actions';
import { DictionaryLocale } from '../api/model/dictionaryLocale';
import { DictionaryTimezone } from '../api/model/dictionaryTimezone';

@Component({
  selector: 'app-user-properties',
  imports: [ReactiveFormsModule, NgForOf, TranslatePipe, AsyncPipe],
  templateUrl: './user-property.component.html',
  styleUrl: './user-property.component.css',
})
export class UserPropertyComponent implements OnInit, OnDestroy {
  protected readonly formGroup: FormGroup;
  protected _locales$!: Observable<DictionaryLocale[]>;
  protected _timezones$!: Observable<DictionaryTimezone[]>;
  private _storeAccount$: Store<AccountState> = inject(Store);
  private _storeDictionary$: Store<DictionaryState> = inject(Store);
  private readonly _destroy$: Subject<void> = new Subject<void>();

  constructor(
    formBuilder: FormBuilder,
    private route: ActivatedRoute,
  ) {
    this.formGroup = formBuilder.group({
      language: new FormControl(null, [Validators.required]),
      timezone: new FormControl(null, [Validators.required]),
    });
  }

  ngOnInit() {
    this._timezones$ = this._storeDictionary$
      .select(selectTimezoneList)
      .pipe(takeUntil(this._destroy$));
    this._locales$ = this._storeDictionary$
      .select(selectLocaleList)
      .pipe(takeUntil(this._destroy$));
    this._storeDictionary$.dispatch(loadTimezoneListAction());
    this._storeDictionary$.dispatch(loadLocaleListAction());

    this._storeAccount$
      .select(getUserProperty)
      .pipe(takeUntil(this._destroy$))
      .subscribe((userProperty) => {
        this.formGroup.patchValue({
          language: userProperty.language,
          timezone: userProperty.timezone,
        });
      });
    this._storeAccount$.dispatch(getUserPropertyAction());
  }

  ngOnDestroy(): void {
    this._destroy$.next();
    this._destroy$.complete();
  }

  get routerId(): string | null {
    return this.route.snapshot.paramMap.get('id');
  }

  saveUserProperty(): void {
    const userProperty = {
      language: this.formGroup.get('language')?.value,
      timezone: this.formGroup.get('timezone')?.value,
      version: 0,
    } as UserProperty;

    this._storeAccount$.dispatch(saveUserPropertyAction({ userProperty }));
  }
}
