import { Component, inject, OnInit } from '@angular/core';
import { TranslatePipe, TranslateService } from '@ngx-translate/core';
import { FooterComponent } from '../../../../../shared-modules/src/lib/footer/footer.component';
import { MenuComponent } from '../../menu/menu.component';
import { PropertyStore } from '../../properties/properties.signal-store';
import { UtilStore } from '../utils.signal-store';
import { Toast } from 'primeng/toast';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [TranslatePipe, FooterComponent, MenuComponent, Toast],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.scss',
})
export class DashboardComponent implements OnInit {
  protected readonly translate: TranslateService = inject(TranslateService);
  protected readonly store = inject(PropertyStore);
  protected readonly storeUtil = inject(UtilStore);

  constructor() {}

  ngOnInit() {
    this.store.getUserProperty();
    this.storeUtil.loadBuildInfo();
  }
}
