import { TicketState } from './ticket/ticket.selector';
import { AccountState } from './account/account.selector';

export interface State {
  tickets: TicketState;
  accounts: AccountState;
}
