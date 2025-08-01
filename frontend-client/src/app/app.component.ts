import { Component, inject, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { MenuComponent } from './menu/menu.component';
import { TranslateService } from '@ngx-translate/core';
import { Store } from '@ngrx/store';
import { FooterComponent } from './utils/footer/footer.component';
import { PropertyState, selectUserProperty } from './properties/state/properties.selectors';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrl: './app.component.css',
  imports: [RouterOutlet, MenuComponent, FooterComponent],
  standalone: true
})
export class AppComponent implements OnInit {
  protected readonly translate: TranslateService = inject(TranslateService);
  private _storeProperty$: Store<PropertyState> = inject(Store);
  title = 'frontend-client';

  ngOnInit() {
    this._storeProperty$.select(selectUserProperty).subscribe((userProperty) => {
      this.translate.use(userProperty.language).pipe().subscribe();
    });
  }
}
