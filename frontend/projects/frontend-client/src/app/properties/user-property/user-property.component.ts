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
import { UserProperty } from '../../api/model/userProperty';
import {
  PropertyState,
  selectLocaleList,
  selectTimezoneList,
  selectUserProperty,
} from '../state/properties.selectors';
import {
  getUserPropertyAction,
  loadLocaleListAction,
  loadTimezoneListAction,
  saveUserPropertyAction,
} from '../state/properties.actions';
import { PropertyMenu } from '../property-menu/property-menu';
import { MenuComponent } from '../../menu/menu.component';

@Component({
  selector: 'app-properties',
  imports: [ReactiveFormsModule, TranslatePipe, PropertyMenu, MenuComponent],
  templateUrl: './user-property.component.html',
  styleUrl: './user-property.component.css',
})
export class UserPropertyComponent implements OnInit {
  protected readonly formGroup: FormGroup;
  protected _locales$: string[] = [];
  protected _timezones$: string[] = [];
  protected _languages$: { id: string; name: string }[] = [
    { id: 'en', name: 'English' },
    { id: 'pl', name: 'Polski' },
    { id: 'es', name: 'Español' },
    { id: 'hi', name: 'Hindi' },
    { id: 'zhcn', name: 'Chinese' },
  ];
  private _storeProperty$: Store<PropertyState> = inject(Store);
  private formBuilder: FormBuilder = inject(FormBuilder);
  private translate: TranslateService = inject(TranslateService);
  private route: ActivatedRoute = inject(ActivatedRoute);

  constructor() {
    this.formGroup = this.formBuilder.group({
      locale: new FormControl(null, [Validators.required]),
      timezone: new FormControl(null, [Validators.required]),
      language: new FormControl(null, [Validators.required]),
      version: new FormControl(0, [Validators.required]),
    });
  }

  ngOnInit() {
    this._storeProperty$.select(selectTimezoneList).subscribe((data) => {
      this._timezones$ = data;
    });
    this._storeProperty$.select(selectLocaleList).subscribe((data) => {
      this._locales$ = data;
    });
    this._storeProperty$.dispatch(loadTimezoneListAction());
    this._storeProperty$.dispatch(loadLocaleListAction());

    this._storeProperty$
      .select(selectUserProperty)
      .subscribe((userProperty) => {
        this.formGroup.patchValue({
          language: userProperty.language,
          locale: userProperty.locale,
          timezone: userProperty.timezone,
          version: userProperty.version != undefined ? userProperty.version : 0,
        });
      });
    this._storeProperty$.dispatch(getUserPropertyAction());
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
    this._storeProperty$.dispatch(saveUserPropertyAction({ userProperty }));
  }
}
