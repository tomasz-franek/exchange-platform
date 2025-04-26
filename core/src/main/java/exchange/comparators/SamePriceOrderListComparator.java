package exchange.comparators;

import exchange.app.api.model.Direction;
import exchange.data.SamePriceOrderList;

import java.util.Comparator;

import static exchange.app.api.model.Direction.BUY;

public class SamePriceOrderListComparator implements Comparator<SamePriceOrderList> {

    private final Direction direction;

    public SamePriceOrderListComparator(final Direction direction) {
        this.direction = direction;
    }

    @Override
    public int compare(final SamePriceOrderList arg0, final SamePriceOrderList arg1) {
        if (BUY.equals(direction)) {
            return arg1.getRatio().compareTo(arg0.getRatio());
        } else {
            return arg0.getRatio().compareTo(arg1.getRatio());
        }
    }
}
