import { Component } from '@angular/core';
import { TranslatePipe } from '@ngx-translate/core';
import { SystemMessage } from '../../api/model/systemMessage';

@Component({
  selector: 'app-message-list',
  templateUrl: './message-list.html',
  styleUrl: './message-list.css',
  imports: [TranslatePipe],
})
export class MessageList {
  protected rows: SystemMessage[] = [];
}
