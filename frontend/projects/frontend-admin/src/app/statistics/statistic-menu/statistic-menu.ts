import { Component } from '@angular/core';
import { TranslatePipe } from '@ngx-translate/core';
import { RouterLink } from '@angular/router';
import { CheckedMenu} from '../../../../../shared-modules/src/lib/checked-menu/checked-menu';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-statistic-menu',
  templateUrl: './statistic-menu.html',
  imports: [TranslatePipe, RouterLink, FormsModule],
  styleUrl: './statistic-menu.css',
})
export class StatisticMenu extends CheckedMenu {}
