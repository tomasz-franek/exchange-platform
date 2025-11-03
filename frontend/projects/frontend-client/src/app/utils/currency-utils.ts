import { UserTicket } from '../api/model/userTicket';
import { PairUtils } from './pair-utils';

export class CurrencyUtils {
  public static ticketToCurrency(ticket: UserTicket | null): string {
    if (ticket == null) {
      return '';
    }
    if (ticket.direction == 'BUY') {
      return PairUtils.getQuoteCurrency(ticket.pair);
    } else {
      return PairUtils.getBaseCurrency(ticket.pair);
    }
  }
}
