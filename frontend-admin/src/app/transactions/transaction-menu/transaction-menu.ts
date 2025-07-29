import {Component} from '@angular/core';
import {TranslatePipe} from "@ngx-translate/core";
import {RouterLink} from "@angular/router";

@Component({
  selector: 'app-transaction-menu',
  templateUrl: './transaction-menu.html',
  imports: [
    TranslatePipe,
    RouterLink
  ],
  styleUrl: './transaction-menu.css'
})
export class TransactionMenu {

}
