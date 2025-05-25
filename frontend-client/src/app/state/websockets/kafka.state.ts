import { Action, Selector, State, StateContext } from '@ngxs/store';
import { AddMessageAction } from './kafka.actions';
import { Injectable } from '@angular/core';

export class KafkaStateModel {
  public messages: string[] = [];
}

@State<KafkaStateModel>({
  name: 'kafka',
  defaults: {
    messages: [],
  },
})
@Injectable()
export class KafkaState {
  @Selector()
  static messages(state: KafkaStateModel): string[] {
    return state.messages;
  }

  @Action(AddMessageAction)
  add(ctx: StateContext<KafkaStateModel>, action: AddMessageAction) {
    const state = ctx.getState();
    ctx.setState({ messages: [...state.messages, action.message] });
  }
}
