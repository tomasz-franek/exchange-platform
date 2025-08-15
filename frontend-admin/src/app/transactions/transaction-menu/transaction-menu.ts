import {Component, Input} from '@angular/core';
import {TranslatePipe} from "@ngx-translate/core";
import {RouterLink} from "@angular/router";
import {FormsModule} from '@angular/forms';

@Component({
  selector: 'app-transaction-menu',
  templateUrl: './transaction-menu.html',
  imports: [
    TranslatePipe,
    RouterLink,
    FormsModule
  ],
  styleUrl: './transaction-menu.css'
})
export class TransactionMenu {
  @Input() checkedInput: string | undefined;
}
