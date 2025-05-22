import { TicketState } from './tickets/ticket.selectors';
import { AccountState } from './accounts/account.selectors';

export interface State {
  tickets: TicketState;
  accounts: AccountState;
}
