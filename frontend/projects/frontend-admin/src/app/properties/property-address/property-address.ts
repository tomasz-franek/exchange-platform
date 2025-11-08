import {Component, inject, OnInit} from '@angular/core';
import {PropertyMenu} from '../property-menu/property-menu';
import {FormBuilder, FormControl, FormGroup, ReactiveFormsModule, Validators} from '@angular/forms';
import {Router} from '@angular/router';
import {PropertyState, selectUserAddress} from '../state/properties.selectors';
import {Store} from '@ngrx/store';
import {TranslatePipe} from '@ngx-translate/core';
import {Address} from '../../api/model/address';
import {getUserAddressAction, saveUserAddressAction} from '../state/properties.actions';
import {MenuComponent} from '../../menu/menu.component';
import {InputText} from 'primeng/inputtext';
import {Button} from 'primeng/button';

@Component({
  selector: 'app-property-address',
  templateUrl: './property-address.html',
  styleUrl: './property-address.css',
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
  protected formGroup: FormGroup;
  protected readonly formBuilder: FormBuilder = inject(FormBuilder);
  private readonly router: Router = inject(Router);
  private _storeProperty$: Store<PropertyState> = inject(Store);

  constructor() {
    this.formGroup = this.formBuilder.group({
      name: new FormControl(null, [Validators.required]),
      countryCode: new FormControl(null, [Validators.required]),
      version: new FormControl(0, [Validators.required]),
      phone: new FormControl(null, [Validators.required]),
      city: new FormControl(null, [Validators.required]),
      street: new FormControl(null, [Validators.required]),
      taxID: new FormControl(null, [Validators.required]),
      vatID: new FormControl(null, [Validators.required]),
      zipCode: new FormControl(null, [Validators.required]),
    })
  }

  ngOnInit() {

    this._storeProperty$.select(selectUserAddress).subscribe((address: Address) => {
      this.formGroup.patchValue({
        name: address.name,
        countryCode: address.countryCode,
        phone: address.phone,
        city: address.city,
        taxID: address.taxID,
        vatID: address.vatID,
        street: address.street,
        zipCode: address.zipCode,
        version: address.version != undefined ? address.version : 0,
      });
    });
    this._storeProperty$.dispatch(getUserAddressAction());
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
    this._storeProperty$.dispatch(saveUserAddressAction({address}));
  }
}
