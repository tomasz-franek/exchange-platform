import {Component, effect, inject, OnInit} from '@angular/core';
import {PropertyMenu} from '../property-menu/property-menu';
import {TranslatePipe, TranslateService} from '@ngx-translate/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import {UserProperty} from '../../api/model/userProperty';
import {MenuComponent} from '../../menu/menu.component';
import {SelectModule} from 'primeng/select';
import {Button} from 'primeng/button';
import {PropertyStore} from '../properties.signal-store';
import {ToastModule} from 'primeng/toast';

@Component({
  selector: 'app-property-settings',
  templateUrl: './property-settings.html',
  styleUrl: './property-settings.scss',
  imports: [
    PropertyMenu,
    TranslatePipe,
    ReactiveFormsModule,
    MenuComponent,
    SelectModule,
    FormsModule,
    Button,
    ToastModule,
  ],
})
export class PropertySettingsComponent implements OnInit {
  public formGroup: FormGroup;
  protected _languages$: { id: string; name: string }[] = [
    { id: 'zhcn', name: 'Chinese' },
    { id: 'en', name: 'English' },
    { id: 'es', name: 'Español' },
    { id: 'fr', name: 'Français' },
    { id: 'de', name: 'German' },
    { id: 'hi', name: 'Hindi' },
    { id: 'pl', name: 'Polski' },
    { id: 'pt', name: 'Português' },
  ];
  protected readonly store = inject(PropertyStore);
  private readonly formBuilder: FormBuilder = inject(FormBuilder);
  private readonly translate: TranslateService = inject(TranslateService);

  constructor() {
    this.formGroup = this.formBuilder.group({
      locale: new FormControl(null, [Validators.required]),
      timezone: new FormControl('', [Validators.required]),
      language: new FormControl(null, [Validators.required]),
      version: new FormControl(0, [Validators.required]),
    });
    effect(() => {
      let userProperty = this.store.userProperty();
      if (
        userProperty !== undefined &&
        this.formGroup.get('version')?.value !== userProperty.version
      ) {
        this.formGroup.patchValue({
          locale: userProperty.locale,
          timezone: Number.parseInt(userProperty.timezone),
          language: userProperty.language,
          version: userProperty.version,
        });
      }
    });
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
