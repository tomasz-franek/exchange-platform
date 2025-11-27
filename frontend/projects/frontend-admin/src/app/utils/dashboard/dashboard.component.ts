import {Component, effect, inject, OnInit} from '@angular/core';
import {TranslatePipe, TranslateService} from '@ngx-translate/core';
import {FooterComponent} from '../../../../../shared-modules/src/lib/footer/footer.component';
import {MenuComponent} from '../../menu/menu.component';
import {PropertyStore} from '../../properties/properties.signal-store';
import {Toast} from 'primeng/toast';

@Component({
  selector: 'app-dashboard',
  imports: [TranslatePipe, FooterComponent, MenuComponent, Toast],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.scss',
})
export class DashboardComponent implements OnInit {
  protected readonly store = inject(UtilStore);
  protected readonly storeProperty = inject(PropertyStore);
  private translateService: TranslateService = inject(TranslateService);

  constructor() {
    this.store.loadBuildInfo();
    effect(() => {
      let userProperty = this.storeProperty.userProperty();
      if (userProperty && userProperty.language != undefined) {
        this.translateService.use(userProperty.language).pipe().subscribe();
      }
    })
  }

  ngOnInit() {
    this.storeProperty.getUserProperty();


  }
}
