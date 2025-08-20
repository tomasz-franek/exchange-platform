import { UserTicket } from '../api/model/userTicket';

export class CurrencyUtils {
  public static ticketToCurrency(ticket: UserTicket): string {
    if (ticket == null) {
      return '';
    }
    if (ticket.direction == 'BUY') {
      return ticket.pair.split('_')[1];
    } else {
      return ticket.pair.split('_')[0];
    }
  }
}
