import { Component, inject, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { TranslatePipe } from '@ngx-translate/core';
import { Store } from '@ngrx/store';
import { MessageState, selectSystemMessages } from '../state/message.selectors';
import { SystemMessage } from '../../api/model/systemMessage';

@Component({
  selector: 'app-message-filter',
  templateUrl: './message-filter.html',
  styleUrl: './message-filter.css',
  imports: [FormsModule, ReactiveFormsModule, TranslatePipe],
})
export class MessageFilter implements OnInit {
  protected readonly formGroup: FormGroup;
  protected _messages$: SystemMessage[] = [];
  private readonly formBuilder: FormBuilder = inject(FormBuilder);
  private readonly _storeMessages$: Store<MessageState> = inject(Store);

  constructor() {
    this.formGroup = this.formBuilder.group({
      priority: [null, Validators.required],
    });
  }

  ngOnInit() {
    this._storeMessages$.select(selectSystemMessages).subscribe((messages) => {
      this._messages$ = messages;
    });
  }
}
