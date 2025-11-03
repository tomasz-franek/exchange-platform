import { Component } from '@angular/core';
import { TranslatePipe } from '@ngx-translate/core';
import { RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CheckedMenu} from '../../../../../shared-modules/src/lib/checked-menu/checked-menu';

@Component({
  selector: 'app-account-menu',
  templateUrl: './account-menu.html',
  imports: [TranslatePipe, RouterLink, FormsModule],
  styleUrl: './account-menu.css',
})
export class AccountMenu extends CheckedMenu {}
