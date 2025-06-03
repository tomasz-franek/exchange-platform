import { TicketState } from './ticket/ticket.selectors';
import { AccountState } from './account/account.selectors';

export interface State {
  tickets: TicketState;
  accounts: AccountState;
}
