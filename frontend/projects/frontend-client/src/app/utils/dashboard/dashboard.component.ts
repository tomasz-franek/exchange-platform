import {Component, effect, inject, OnInit} from '@angular/core';
import {TranslatePipe, TranslateService} from '@ngx-translate/core';
import {FooterComponent} from '../../../../../shared-modules/src/lib/footer/footer.component';
import {MenuComponent} from '../../menu/menu.component';
import {BsLocaleService} from 'ngx-bootstrap/datepicker';
import {
  defineLocale,
  enGbLocale,
  esLocale,
  hiLocale,
  plLocale,
  zhCnLocale,
} from 'ngx-bootstrap/chronos';
import {propertyStore} from '../../properties/properties.signal-store';
import {utilStore} from '../utils.signal-store';
import {Toast} from 'primeng/toast';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [TranslatePipe, FooterComponent, MenuComponent, Toast],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.scss',
})
export class DashboardComponent implements OnInit {
  protected readonly translate: TranslateService = inject(TranslateService);
  protected readonly store = inject(propertyStore);
  protected readonly storeUtil = inject(utilStore);
  private translateService: TranslateService = inject(TranslateService);
  private localeService: BsLocaleService = inject(BsLocaleService);

  constructor() {
    defineLocale('pl', plLocale);
    defineLocale('en', enGbLocale);
    defineLocale('es', esLocale);
    defineLocale('hi', hiLocale);
    defineLocale('zhcn', zhCnLocale);
    effect(() => {
      let userProperty = this.store.userProperty();
      if (userProperty && userProperty.language != undefined) {
        this.translateService.use(userProperty.language.toLowerCase()).pipe().subscribe();
        this.localeService.use(userProperty.language.toLowerCase());
      }
    });
  }

  ngOnInit() {
    this.store.getUserProperty()
    this.storeUtil.loadBuildInfo();
  }
}
