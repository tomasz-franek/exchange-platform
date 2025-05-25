import { Component, inject } from '@angular/core';
import { Store } from '@ngrx/store';
import { TranslatePipe } from '@ngx-translate/core';
import { AccountEditComponent } from './account-edit/account-edit.component';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrl: './app.component.css',
  imports: [TranslatePipe, AccountEditComponent],
})
export class AppComponent {
  title = 'frontend-client';
  private _store$: Store = inject(Store);
}
