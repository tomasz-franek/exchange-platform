import { Component, inject, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { MenuComponent } from './utils/menu/menu.component';
import { TranslateService } from '@ngx-translate/core';
import { Store } from '@ngrx/store';
import {
  AccountState,
  getUserProperty,
} from './accounts/state/account.selectors';
import { FooterComponent } from './utils/footer/footer.component';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrl: './app.component.css',
  imports: [RouterOutlet, MenuComponent, FooterComponent],
  standalone: true,
})
export class AppComponent implements OnInit {
  protected readonly translate: TranslateService = inject(TranslateService);
  private _storeAccount$: Store<AccountState> = inject(Store);
  title = 'frontend-client';

  ngOnInit() {
    this._storeAccount$.select(getUserProperty).subscribe((userProperty) => {
      this.translate.use(userProperty.language).pipe().subscribe();
    });
  }
}
