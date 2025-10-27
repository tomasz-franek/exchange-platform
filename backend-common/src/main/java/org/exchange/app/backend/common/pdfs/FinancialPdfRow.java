package org.exchange.app.backend.common.pdfs;

import java.time.LocalDateTime;
import org.exchange.app.common.api.model.Currency;
import org.exchange.app.common.api.model.EventType;

public record FinancialPdfRow(LocalDateTime date,
                              EventType eventType,
                              Long amount,
                              Currency currency) {

}
