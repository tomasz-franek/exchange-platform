import { Component, inject, OnInit } from '@angular/core';
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
  getUserPropertyById,
} from '../state/account/account.selectors';
import {
  getUserPropertyAction,
  saveUserPropertyAction,
} from '../state/account/account.actions';
import { UserProperty } from '../api/model/userProperty';
import { DictionaryLocale, DictionaryTimezone } from '../api';
import { Observable } from 'rxjs';
import {
  DictionaryState,
  selectLocaleList,
  selectTimezoneList,
} from '../state/dictionary/dictionary.selectors';
import {
  loadLocaleListAction,
  loadTimezoneListAction,
} from '../state/dictionary/dictionary.actions';

@Component({
  selector: 'app-user-properties',
  imports: [ReactiveFormsModule, NgForOf, TranslatePipe, AsyncPipe],
  templateUrl: './user-property.component.html',
  styleUrl: './user-property.component.css',
})
export class UserPropertyComponent implements OnInit {
  protected readonly formGroup: FormGroup;
  protected _locales$!: Observable<DictionaryLocale[]>;
  protected _timezones$!: Observable<DictionaryTimezone[]>;
  private _storeAccount$: Store<AccountState> = inject(Store);
  private _storeDictionary$: Store<DictionaryState> = inject(Store);

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
    this._timezones$ = this._storeDictionary$.select(selectTimezoneList);
    this._locales$ = this._storeDictionary$.select(selectLocaleList);
    this._storeDictionary$.dispatch(loadTimezoneListAction());
    this._storeDictionary$.dispatch(loadLocaleListAction());
    const userId = this.routerId;
    if (userId === null) {
      this.formGroup.patchValue({
        language: new FormControl(null, [Validators.required]),
        timezone: new FormControl(null, [Validators.required]),
      });
    } else {
      this._storeAccount$.dispatch(getUserPropertyAction());
      this._storeAccount$
        .select(getUserPropertyById)
        .subscribe((userProperty) => {
          this.formGroup.patchValue({
            language: new FormControl(userProperty.language, [
              Validators.required,
            ]),
            timezone: new FormControl(userProperty.timezone, [
              Validators.required,
            ]),
            userId: new FormControl(userId, [Validators.required]),
          });
        });
    }
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

    this._storeAccount$.dispatch(
      saveUserPropertyAction({
        userProperty,
      }),
    );
  }
}
