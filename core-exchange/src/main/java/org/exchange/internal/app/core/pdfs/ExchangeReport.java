package org.exchange.internal.app.core.pdfs;


import org.exchange.app.backend.common.pdfs.PdfFlyingSaucer;
import org.springframework.stereotype.Service;

@Service
public class ExchangeReport {

	public void generateExchangeReport(final String fileName, ExchangeDataResult exchangeResult) {

		PdfFlyingSaucer.generatePdf(fileName);
  }

}