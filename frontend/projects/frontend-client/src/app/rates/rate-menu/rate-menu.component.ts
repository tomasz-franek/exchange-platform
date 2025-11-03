import { Component, Input } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { TranslatePipe } from '@ngx-translate/core';

@Component({
  selector: 'app-rate-menu',
  imports: [
    ReactiveFormsModule,
    RouterLink,
    TranslatePipe,
    FormsModule
  ],
  templateUrl: './rate-menu.component.html',
  styleUrl: './rate-menu.component.css'
})
export class RateMenuComponent {
  @Input() checkedInput: string | undefined;
}
