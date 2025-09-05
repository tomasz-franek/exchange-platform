package org.exchange.app.backend.common.exceptions;

import java.util.UUID;
import lombok.Getter;
import org.exchange.app.backend.common.pdfs.ReportsEnum;
import org.exchange.app.backend.common.utils.ExchangeDateUtils;
import org.exchange.app.common.api.model.ErrorObjectResponse;

@Getter
public class PdfGenerationException extends RuntimeException {

  private final ErrorObjectResponse exceptionRecord;

  public PdfGenerationException(ReportsEnum report, String message) {
    this.exceptionRecord = new ErrorObjectResponse(
        ErrorCodesEnum.PDF_GENERATION_ERROR.name(),
        UUID.randomUUID(),
        String.format("Document '%s' generation problem : %s", report, message),
        ExchangeDateUtils.currentLocalDateTime());
  }
}
