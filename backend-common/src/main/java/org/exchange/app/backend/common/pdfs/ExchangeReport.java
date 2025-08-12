package org.exchange.app.backend.common.pdfs;

import java.io.ByteArrayOutputStream;
import org.springframework.stereotype.Service;

@Service
public class ExchangeReport {

  public ByteArrayOutputStream generateExchangeReport(ExchangeDataResult exchangeResult) {

    return ExchangeReportPdf.generatePdf(exchangeResult);
  }

}