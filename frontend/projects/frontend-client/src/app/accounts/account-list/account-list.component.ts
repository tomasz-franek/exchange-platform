import {Component, inject, OnInit} from '@angular/core';
import {TranslatePipe} from '@ngx-translate/core';
import {AmountPipe} from '../../../pipes/amount-pipe/amount.pipe';
import {AccountMenu} from '../account-menu/account-menu';
import {MenuComponent} from '../../menu/menu.component';
import {TableModule} from 'primeng/table';
import {accountsStore} from '../accounts.signal-store';

@Component({
  selector: 'app-account-list',
  imports: [TranslatePipe, AmountPipe, AccountMenu, MenuComponent, TableModule],
  templateUrl: './account-list.component.html',
  styleUrl: './account-list.component.scss',
  standalone: true
})
export class AccountListComponent implements OnInit {
  protected readonly store = inject(accountsStore);

  ngOnInit(): void {
    this.store.loadAccountBalanceList();
  }
}
