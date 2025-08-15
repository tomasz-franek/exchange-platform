import { Component } from '@angular/core';
import { MenuComponent } from '../../menu/menu.component';
import { AccountFilter } from '../account-filter/account-filter';
import { AccountListComponent } from '../account-list/account-list.component';
import { AccountMenu } from '../account-menu/account-menu';

@Component({
  selector: 'app-account-list-form',
  templateUrl: './account-list-form.html',
  styleUrl: './account-list-form.css',
  imports: [MenuComponent, AccountFilter, AccountListComponent, AccountMenu],
})
export class AccountListForm {}
