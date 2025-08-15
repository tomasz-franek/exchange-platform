import { Component } from '@angular/core';
import { TranslatePipe } from '@ngx-translate/core';

@Component({
  selector: 'app-account-list',
  templateUrl: './account-list.component.html',
  imports: [TranslatePipe],
  styleUrl: './account-list.component.css',
})
export class AccountListComponent {
  protected rows: any[] = [];
}
