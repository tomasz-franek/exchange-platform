import {Component, inject, OnInit} from '@angular/core';
import {Store} from '@ngrx/store';
import {PropertyState, selectUserProperty} from '../../properties/state/properties.selectors';
import {TranslatePipe, TranslateService} from '@ngx-translate/core';
import {getUserPropertyAction} from '../../properties/state/properties.actions';
import {UserProperty} from '../../api/model/userProperty';
import {FooterComponent} from '../footer/footer.component';
import {MenuComponent} from '../../menu/menu.component';
import {BsLocaleService} from 'ngx-bootstrap/datepicker';
import {defineLocale, enGbLocale, esLocale, plLocale} from 'ngx-bootstrap/chronos';

@Component({
  selector: 'app-dashboard',
  imports: [TranslatePipe, FooterComponent, MenuComponent],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css',
})
export class DashboardComponent implements OnInit {
  private _storeProperty$: Store<PropertyState> = inject(Store);
  private translateService: TranslateService = inject(TranslateService);
  private localeService: BsLocaleService = inject(BsLocaleService);

  constructor(private storeProperty$: Store<PropertyState>) {
    defineLocale('pl', plLocale);
    defineLocale('en', enGbLocale);
    defineLocale('es', esLocale);
  }

  ngOnInit() {
    this._storeProperty$.dispatch(getUserPropertyAction());
    this._storeProperty$
    .select(selectUserProperty)
    .subscribe((data: UserProperty) => {
      if (data != undefined && data.language != undefined) {
        this.translateService.use(data.language).pipe().subscribe();
        this.localeService.use(data.language.toLowerCase());
      }
    });
  }
}
