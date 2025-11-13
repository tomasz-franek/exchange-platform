import {Component, effect, inject, OnInit} from '@angular/core';
import {PropertyMenu} from '../property-menu/property-menu';
import {FormBuilder, FormControl, FormGroup, ReactiveFormsModule, Validators} from '@angular/forms';
import {Router} from '@angular/router';
import {TranslatePipe} from '@ngx-translate/core';
import {Address} from '../../api/model/address';
import {MenuComponent} from '../../menu/menu.component';
import {InputText} from 'primeng/inputtext';
import {Button} from 'primeng/button';
import {propertyStore} from '../properties.signal-store';

@Component({
  selector: 'app-property-address',
  templateUrl: './property-address.html',
  styleUrl: './property-address.scss',
  standalone: true,
  imports: [
    PropertyMenu,
    ReactiveFormsModule,
    TranslatePipe,
    MenuComponent,
    InputText,
    Button
  ]
})
export class PropertyAddressComponent implements OnInit {
  protected formGroup: FormGroup = new FormGroup({});
  protected readonly formBuilder: FormBuilder = inject(FormBuilder);
  protected readonly store = inject(propertyStore);
  private readonly router: Router = inject(Router);

  constructor() {
    effect(() => {
      let address = this.store.userAddress();
      if (address) {
        this.formGroup = this.formBuilder.group({
          name: new FormControl(address.name, [Validators.required]),
          countryCode: new FormControl(address.countryCode, [Validators.required]),
          version: new FormControl(address.version, [Validators.required]),
          phone: new FormControl(address.phone, [Validators.required]),
          city: new FormControl(address.city, [Validators.required]),
          street: new FormControl(address.street, [Validators.required]),
          taxID: new FormControl(address.taxID, [Validators.required]),
          vatID: new FormControl(address.vatID, [Validators.required]),
          zipCode: new FormControl(address.zipCode, [Validators.required]),
        });
      } else {
        this.formGroup = this.formBuilder.group({
          name: new FormControl(null, [Validators.required]),
          countryCode: new FormControl(null, [Validators.required]),
          version: new FormControl(null, [Validators.required]),
          phone: new FormControl(null, [Validators.required]),
          city: new FormControl(null, [Validators.required]),
          street: new FormControl(null, [Validators.required]),
          taxID: new FormControl(null, [Validators.required]),
          vatID: new FormControl(null, [Validators.required]),
          zipCode: new FormControl(null, [Validators.required]),
        });
      }
    })
    this.store.getUserAddress();
  }

  ngOnInit() {

  }

  backToDashboard() {
    this.router.navigate(['dashboard']);
  }

  saveAddress() {
    const address: Address = {
      name: this.formGroup.get('name')?.value,
      countryCode: this.formGroup.get('countryCode')?.value,
      phone: this.formGroup.get('phone')?.value,
      city: this.formGroup.get('city')?.value,
      street: this.formGroup.get('street')?.value,
      taxID: this.formGroup.get('taxID')?.value,
      vatID: this.formGroup.get('vatID')?.value,
      zipCode: this.formGroup.get('zipCode')?.value,
      version: this.formGroup.get('version')?.value
    };
    this.store.saveUserAddress(address);
  }
}
