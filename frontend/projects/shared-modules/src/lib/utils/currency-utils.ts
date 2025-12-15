import { PairUtils } from './pair-utils';
import { UserTicket } from '../api/model/userTicket';

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
