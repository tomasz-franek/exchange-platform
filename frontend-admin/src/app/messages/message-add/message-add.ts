import {Component, inject} from '@angular/core';
import {FormBuilder, FormControl, FormGroup, ReactiveFormsModule, Validators} from '@angular/forms';
import {TranslatePipe} from '@ngx-translate/core';
import {MessageMenu} from '../message-menu/message-menu';
import {CheckedMenu} from '../../utils/checked-menu/checked-menu';
import {Store} from '@ngrx/store';
import {MessageState} from '../state/message.selectors';
import {MenuComponent} from '../../menu/menu.component';

@Component({
  selector: 'app-message-add',
  templateUrl: './message-add.html',
  imports: [
    TranslatePipe,
    MessageMenu,
    MenuComponent,
    ReactiveFormsModule
  ],
  styleUrl: './message-add.css'
})
export class MessageAdd extends CheckedMenu {
  protected readonly formBuilder = inject(FormBuilder);
  protected formGroup: FormGroup;
  private readonly _storeMessages$: Store<MessageState> = inject(Store);

  constructor() {
    super();
    this.formGroup = this.formBuilder.group({
      text: new FormControl(null, [Validators.required]),
    })
  }
}
