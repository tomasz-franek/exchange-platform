import {Component, inject, Input} from '@angular/core';
import {TranslateService} from '@ngx-translate/core';
import {MenuItem} from 'primeng/api';

@Component({
  selector: 'app-checked-menu',
  templateUrl: './checked-menu.html',
  styleUrl: './checked-menu.scss',
})
export class CheckedMenu {
  @Input() checkedInput: string | undefined;
  protected readonly translateService: TranslateService = inject(TranslateService);
  protected items: MenuItem[] | undefined;
}
