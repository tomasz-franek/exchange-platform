import {Component, effect, inject, OnInit} from '@angular/core';
import {PropertyMenu} from '../property-menu/property-menu';
import {TranslatePipe, TranslateService} from '@ngx-translate/core';
import {FormBuilder, FormControl, FormGroup, ReactiveFormsModule, Validators} from '@angular/forms';
import {UserProperty} from '../../api/model/userProperty';
import {MenuComponent} from '../../menu/menu.component';
import {Select} from 'primeng/select';
import {Button} from 'primeng/button';
import {PropertyStore} from '../properties.signal-store';

@Component({
  selector: 'app-property-settings',
  templateUrl: './property-settings.html',
  styleUrl: './property-settings.scss',
  imports: [
    PropertyMenu,
    TranslatePipe,
    ReactiveFormsModule,
    MenuComponent,
    Select,
    Button
  ]
})
export class PropertySettingsComponent implements OnInit {
  protected readonly formGroup: FormGroup;
  protected _languages$: any = [
    {id: 'en', name: 'English'},
    {id: 'pl', name: 'Polski'},
    {id: 'es', name: 'Español'},
    {id: 'hi', name: 'Hindi'},
    {id: 'zhcn', name: 'Chinese'},
  ];
  protected readonly store = inject(PropertyStore);
  private readonly formBuilder: FormBuilder = inject(FormBuilder);
  private readonly translate: TranslateService = inject(TranslateService);

  constructor() {
    this.formGroup = this.formBuilder.group({
      locale: new FormControl(null, [Validators.required]),
      timezone: new FormControl(null, [Validators.required]),
      language: new FormControl(null, [Validators.required]),
      version: new FormControl(0, [Validators.required]),
    });
    effect(() => {
      let userProperty = this.store.userProperty();
      if (userProperty) {
        this.formGroup.patchValue({
          locale: userProperty.locale,
          timezone: userProperty.timezone,
          language: userProperty.language,
          version: userProperty.version
        });
      }
    })
  }

  ngOnInit() {
    this.store.loadTimezoneList();
    this.store.loadUnicodeLocalesList();
    this.store.getUserProperty();
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
    this.store.saveUserProperty(userProperty);
  }
}
