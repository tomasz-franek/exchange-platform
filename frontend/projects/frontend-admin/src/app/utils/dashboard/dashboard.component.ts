import {Component, inject, OnInit} from '@angular/core';
import {Store} from '@ngrx/store';
import {PropertyState, selectUserProperty} from '../../properties/state/properties.selectors';
import {TranslatePipe, TranslateService} from '@ngx-translate/core';
import {getUserPropertyAction} from '../../properties/state/properties.actions';
import {UserProperty} from '../../api/model/userProperty';
import {FooterComponent} from '../../../../../shared-modules/src/lib/footer/footer.component';
import {MenuComponent} from '../../menu/menu.component';
import {BsLocaleService} from 'ngx-bootstrap/datepicker';
import {defineLocale, enGbLocale, esLocale, hiLocale, plLocale} from 'ngx-bootstrap/chronos';
import {selectBuildInfo, UtilState} from '../state/util.selectors';
import {BuildInfo} from '../../api/model/buildInfo';
import {loadBuildInfoAction} from '../state/util.actions';

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
  private _storeUtil$: Store<UtilState> = inject(Store);
  protected buildInfo: BuildInfo | undefined = undefined;

  constructor(private storeProperty$: Store<PropertyState>) {
    defineLocale('pl', plLocale);
    defineLocale('en', enGbLocale);
    defineLocale('es', esLocale);
    defineLocale('hi', hiLocale)
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
    this._storeUtil$
    .select(selectBuildInfo)
    .subscribe((data: BuildInfo | undefined) => {
      this.buildInfo = data;
    });
    this._storeUtil$.dispatch(loadBuildInfoAction());
  }
}
