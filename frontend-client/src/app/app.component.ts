import { Component, inject, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { Store } from '@ngrx/store';
import { FooterComponent } from './utils/footer/footer.component';
import {
  PropertyState,
  selectUserProperty,
} from './properties/state/properties.selectors';
import { getUserPropertyAction } from './properties/state/properties.actions';
import { selectBuildInfo, UtilState } from './utils/state/util.selectors';
import { BuildInfo } from './api/model/buildInfo';
import { loadBuildInfoAction } from './utils/state/util.actions';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrl: './app.component.css',
  imports: [RouterOutlet, FooterComponent],
  standalone: true,
})
export class AppComponent implements OnInit {
  protected readonly translate: TranslateService = inject(TranslateService);
  protected buildInfo: BuildInfo | undefined = undefined;
  private _storeProperty$: Store<PropertyState> = inject(Store);
  private _storeUtil$: Store<UtilState> = inject(Store);
  title = 'frontend-client';

  ngOnInit() {
    this._storeProperty$
      .select(selectUserProperty)
      .subscribe((userProperty) => {
        this.translate.use(userProperty.language).pipe().subscribe();
      });
    this._storeProperty$.dispatch(getUserPropertyAction());
    this._storeUtil$
      .select(selectBuildInfo)
      .subscribe((data: BuildInfo | undefined) => {
        this.buildInfo = data;
      });
    this._storeUtil$.dispatch(loadBuildInfoAction());
  }
}
