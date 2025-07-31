import { Component, Input } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { TranslatePipe } from '@ngx-translate/core';

@Component({
  selector: 'app-property-menu',
  imports: [TranslatePipe, RouterLink, FormsModule],
  templateUrl: './property-menu.html',
  styleUrl: './property-menu.css',
})
export class PropertyMenu {
  @Input() checkedInput: string | undefined;
}
