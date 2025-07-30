import {Component, Input} from '@angular/core';
import {TranslatePipe} from "@ngx-translate/core";
import {RouterLink} from "@angular/router";
import {FormsModule} from '@angular/forms';

@Component({
  selector: 'app-account-menu',
  templateUrl: './account-menu.html',
  imports: [
    TranslatePipe,
    RouterLink,
    FormsModule
  ],
  styleUrl: './account-menu.css',
  standalone: true,
})
export class AccountMenu {
  @Input() checkedInput: string | undefined;
}
