import {Component} from '@angular/core';
import {MenuComponent} from '../menu/menu.component';
import {MessageMenuComponent} from './message-menu/message-menu.component';

@Component({
  selector: 'app-message',
  templateUrl: './message.component.html',
  imports: [MenuComponent, MessageMenuComponent],
  styleUrl: './message.component.scss'
})
export class MessageComponent {

}
