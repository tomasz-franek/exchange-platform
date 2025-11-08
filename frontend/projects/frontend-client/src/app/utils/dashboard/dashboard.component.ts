import { Component, inject, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import {
  PropertyState,
  selectUserProperty,
} from '../../properties/state/properties.selectors';
import { TranslatePipe, TranslateService } from '@ngx-translate/core';
import { getUserPropertyAction } from '../../properties/state/properties.actions';
import { UserProperty } from '../../api/model/userProperty';
import {FooterComponent} from '../../../../../shared-modules/src/lib/footer/footer.component';
import { MenuComponent } from '../../menu/menu.component';
import { BsLocaleService } from 'ngx-bootstrap/datepicker';
import {
  defineLocale,
  enGbLocale,
  esLocale,
  hiLocale,
  plLocale,
  zhCnLocale,
} from 'ngx-bootstrap/chronos';
import { BuildInfo } from '../../api/model/buildInfo';
import { selectBuildInfo, UtilState } from '../state/util.selectors';
import { loadBuildInfoAction } from '../state/util.actions';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [TranslatePipe, FooterComponent, MenuComponent],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css',
})
export class DashboardComponent implements OnInit {
  protected buildInfo: BuildInfo | undefined = undefined;
  private _storeProperty$: Store<PropertyState> = inject(Store);
  private _storeUtil$: Store<UtilState> = inject(Store);
  private translateService: TranslateService = inject(TranslateService);
  protected readonly translate: TranslateService = inject(TranslateService);
  private localeService: BsLocaleService = inject(BsLocaleService);

  constructor() {
    defineLocale('pl', plLocale);
    defineLocale('en', enGbLocale);
    defineLocale('es', esLocale);
    defineLocale('hi', hiLocale);
    defineLocale('zhcn', zhCnLocale);
  }

  ngOnInit() {
    this._storeProperty$.dispatch(getUserPropertyAction());
    this._storeProperty$
      .select(selectUserProperty)
      .subscribe((userProperty: UserProperty) => {
        if (userProperty != undefined && userProperty.language != undefined) {
          this.translateService.use(userProperty.language).pipe().subscribe();
          this.localeService.use(userProperty.language.toLowerCase());
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
