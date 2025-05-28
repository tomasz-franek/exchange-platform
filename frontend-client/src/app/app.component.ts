import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { AccountListComponent } from './account-list/account-list.component';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrl: './app.component.css',
  imports: [RouterOutlet, AccountListComponent],
})
export class AppComponent {
  title = 'frontend-client';
}
