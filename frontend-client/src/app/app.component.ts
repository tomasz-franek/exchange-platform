import { Component, inject } from '@angular/core';
import { Store } from '@ngrx/store';
import { AccountEditComponent } from './account-edit/account-edit.component';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrl: './app.component.css',
  imports: [AccountEditComponent],
})
export class AppComponent {
  title = 'frontend-client';
  private _store$: Store = inject(Store);
}
