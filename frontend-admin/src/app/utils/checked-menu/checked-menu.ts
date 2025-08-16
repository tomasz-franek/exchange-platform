import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-checked-menu',
  templateUrl: './checked-menu.html',
  styleUrl: './checked-menu.css',
})
export class CheckedMenu {
  @Input() checkedInput: string | undefined;
}
