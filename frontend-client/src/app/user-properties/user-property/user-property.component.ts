import { Component, inject, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { TranslatePipe, TranslateService } from '@ngx-translate/core';
import { ActivatedRoute } from '@angular/router';
import { Store } from '@ngrx/store';
import {
  AccountState,
  getUserProperty,
} from '../../accounts/state/account.selectors';
import {
  getUserPropertyAction,
  saveUserPropertyAction,
} from '../../accounts/state/account.actions';
import { UserProperty } from '../../api/model/userProperty';
import {
  DictionaryState,
  selectLocaleList,
  selectTimezoneList,
} from '../../state/dictionary/dictionary.selectors';
import {
  loadLocaleListAction,
  loadTimezoneListAction,
} from '../../state/dictionary/dictionary.actions';

@Component({
  selector: 'app-user-properties',
  imports: [ReactiveFormsModule, TranslatePipe],
  templateUrl: './user-property.component.html',
  styleUrl: './user-property.component.css',
})
export class UserPropertyComponent implements OnInit {
  protected readonly formGroup: FormGroup;
  protected _locales$: string[] = [];
  protected _timezones$: string[] = [];
  protected _languages$: any = [
    { id: 'en', name: 'English' },
    { id: 'pl', name: 'Polski' },
  ];
  private _storeAccount$: Store<AccountState> = inject(Store);
  private _storeDictionary$: Store<DictionaryState> = inject(Store);
  private formBuilder: FormBuilder = inject(FormBuilder);
  private translate: TranslateService = inject(TranslateService);
  private route: ActivatedRoute = inject(ActivatedRoute);

  constructor() {
    this.formGroup = this.formBuilder.group({
      locale: new FormControl(null, [Validators.required]),
      timezone: new FormControl(null, [Validators.required]),
      language: new FormControl(null, [Validators.required]),
      version: new FormControl(null, [Validators.required]),
    });
  }

  ngOnInit() {
    this._storeDictionary$.select(selectTimezoneList).subscribe((data) => {
      this._timezones$ = data;
    });
    this._storeDictionary$.select(selectLocaleList).subscribe((data) => {
      this._locales$ = data;
    });
    this._storeDictionary$.dispatch(loadTimezoneListAction());
    this._storeDictionary$.dispatch(loadLocaleListAction());

    this._storeAccount$.select(getUserProperty).subscribe((userProperty) => {
      this.formGroup.patchValue({
        language: userProperty.language,
        locale: userProperty.locale,
        timezone: userProperty.timezone,
        version: userProperty.version,
      });
    });
    this._storeAccount$.dispatch(getUserPropertyAction());
  }

  get routerId(): string | null {
    return this.route.snapshot.paramMap.get('id');
  }

  saveUserProperty(): void {
    const language = this.formGroup.get('language')?.value;
    const locale = this.formGroup.get('locale')?.value;
    const timezone = this.formGroup.get('timezone')?.value;
    const version = this.formGroup.get('version')?.value;
    const userProperty = {
      language,
      locale,
      timezone,
      version,
    } as UserProperty;
    this.translate.use(language).pipe().subscribe();
    this._storeAccount$.dispatch(saveUserPropertyAction({ userProperty }));
  }
}
