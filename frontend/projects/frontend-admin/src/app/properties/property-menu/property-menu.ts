import {Component} from '@angular/core';
import {TranslatePipe} from '@ngx-translate/core';
import {RouterLink} from '@angular/router';
import {FormsModule} from '@angular/forms';
import { CheckedMenu} from '../../../../../shared-modules/src/lib/checked-menu/checked-menu';

@Component({
  selector: 'app-property-menu',
  templateUrl: './property-menu.html',
  imports: [TranslatePipe, RouterLink, FormsModule],
  styleUrl: './property-menu.css',
})
export class PropertyMenu extends CheckedMenu {
}
