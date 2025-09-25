import { Component, inject, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { PropertyState, selectUserProperty } from '../../properties/state/properties.selectors';
import { TranslatePipe, TranslateService } from '@ngx-translate/core';
import { getUserPropertyAction } from '../../properties/state/properties.actions';
import { UserProperty } from '../../api/model/userProperty';
import { FooterComponent } from '../footer/footer.component';
import { MenuComponent } from '../../menu/menu.component';
import { BsLocaleService } from 'ngx-bootstrap/datepicker';
import { defineLocale, enGbLocale, plLocale } from 'ngx-bootstrap/chronos';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [TranslatePipe, FooterComponent, MenuComponent],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css'
})
export class DashboardComponent implements OnInit {
  private _storeProperty$: Store<PropertyState> = inject(Store);
  private translateService: TranslateService = inject(TranslateService);
  protected readonly translate: TranslateService = inject(TranslateService);
  private localeService: BsLocaleService = inject(BsLocaleService);

  constructor() {
    defineLocale('pl', plLocale);
    defineLocale('en', enGbLocale);
  }

  ngOnInit() {
    this._storeProperty$.dispatch(getUserPropertyAction());
    this._storeProperty$.select(selectUserProperty).subscribe((userProperty: UserProperty) => {
      if (userProperty != undefined && userProperty.language != undefined) {
        this.translateService.use(userProperty.language).pipe().subscribe();
        this.localeService.use(userProperty.language.toLowerCase());
      }
    });
  }
}
