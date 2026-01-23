import { Component, effect, inject, OnInit } from '@angular/core';
import { TranslatePipe, TranslateService } from '@ngx-translate/core';
import { CurrencyStatus, FooterComponent } from 'shared-modules';
import { MenuComponent } from '../../menu/menu.component';
import { PropertyStore } from '../../properties/properties.signal-store';
import { Toast } from 'primeng/toast';
import { UtilStore } from '../utils.signal-store';
import { Pair } from '../../api/model/pair';

@Component({
  selector: 'app-dashboard',
  imports: [
    TranslatePipe,
    FooterComponent,
    MenuComponent,
    Toast,
    CurrencyStatus,
  ],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.scss',
})
export class DashboardComponent implements OnInit {
  protected readonly store = inject(UtilStore);
  protected readonly storeProperty = inject(PropertyStore);
  protected readonly Pair = Pair;
  private translateService: TranslateService = inject(TranslateService);

  constructor() {
    this.store.loadBuildInfo();
    effect(() => {
      let userProperty = this.storeProperty.userProperty();
      if (userProperty && userProperty.language != undefined) {
        this.translateService.use(userProperty.language).pipe().subscribe();
      }
    });
  }

  ngOnInit() {
    this.storeProperty.getUserProperty();
  }
}
