import {Component, inject, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators} from '@angular/forms';
import {MenuComponent} from '../../menu/menu.component';
import {PropertyMenu} from '../property-menu/property-menu';
import {Router} from '@angular/router';
import {Store} from '@ngrx/store';
import {PropertyState} from '../state/properties.selectors';
import {loadSystemCurrencyListAction} from '../state/properties.actions';
import {TranslatePipe} from '@ngx-translate/core';

@Component({
  selector: 'app-property-currency',
  templateUrl: './property-currency.html',
  imports: [
    FormsModule,
    MenuComponent,
    PropertyMenu,
    ReactiveFormsModule,
    TranslatePipe
  ],
  styleUrl: './property-currency.css'
})
export class PropertyCurrency implements OnInit {
  protected formGroup: FormGroup;
  protected readonly formBuilder: FormBuilder = inject(FormBuilder);
  private readonly router: Router = inject(Router);
  private _storeProperty$: Store<PropertyState> = inject(Store);

  constructor() {
    this.formGroup = this.formBuilder.group({
      currency: ['', Validators.required],
    })
  }

  ngOnInit() {
    this._storeProperty$.dispatch(loadSystemCurrencyListAction())
  }
}
