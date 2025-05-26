import { TicketState } from './tickets/ticket.selector';
import { AccountState } from './accounts/account.selector';

export interface State {
  tickets: TicketState;
  accounts: AccountState;
}
