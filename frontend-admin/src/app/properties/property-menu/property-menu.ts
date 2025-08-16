import { Component } from '@angular/core';
import { TranslatePipe } from '@ngx-translate/core';
import { RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CheckedMenu } from '../../utils/checked-menu/checked-menu';

@Component({
  selector: 'app-property-menu',
  templateUrl: './property-menu.html',
  imports: [TranslatePipe, RouterLink, FormsModule],
  styleUrl: './property-menu.css',
  standalone: true,
})
export class PropertyMenu extends CheckedMenu {}
