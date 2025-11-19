import {Component, effect, inject, OnInit} from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import {TranslatePipe, TranslateService} from '@ngx-translate/core';
import {ActivatedRoute} from '@angular/router';
import {UserProperty} from '../../api/model/userProperty';
import {PropertyMenu} from '../property-menu/property-menu';
import {MenuComponent} from '../../menu/menu.component';
import {Button} from 'primeng/button';
import {Select} from 'primeng/select';
import {propertyStore} from '../properties.signal-store';

@Component({
  selector: 'app-properties',
  imports: [ReactiveFormsModule, TranslatePipe, PropertyMenu, MenuComponent, Button, Select],
  templateUrl: './user-property.component.html',
  styleUrl: './user-property.component.scss',
})
export class UserPropertyComponent implements OnInit {
  protected readonly formGroup: FormGroup;
  protected _languages$: { id: string; name: string }[] = [
    {id: 'en', name: 'English'},
    {id: 'pl', name: 'Polski'},
    {id: 'es', name: 'Español'},
    {id: 'hi', name: 'Hindi'},
    {id: 'zhcn', name: 'Chinese'},
  ];
  protected readonly store = inject(propertyStore);
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
    effect(() => {
      let userProperty = this.store.userProperty();
      if (userProperty) {
        this.formGroup.patchValue({
          locale: userProperty.locale,
          timezone: userProperty.timezone,
          language: this._languages$.find((e) => e.id = userProperty.language),
          version: userProperty.version
        });
      }
    })
  }

  get routerId(): string | null {
    return this.route.snapshot.paramMap.get('id');
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
      language: language.id,
      locale,
      timezone,
      version,
    } as UserProperty;
    console.log(language);
    this.translate.use(language.id).pipe().subscribe();
    this.store.saveUserProperty(userProperty);
  }
}
