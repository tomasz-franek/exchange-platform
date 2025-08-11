import { Component, Input } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { TranslatePipe } from '@ngx-translate/core';

@Component({
  selector: 'app-message-menu',
  imports: [
    ReactiveFormsModule,
    RouterLink,
    TranslatePipe,
    FormsModule
  ],
  templateUrl: './message-menu.component.html',
  styleUrl: './message-menu.component.css'
})
export class MessageMenuComponent {
  @Input() checkedInput: string | undefined;
}
