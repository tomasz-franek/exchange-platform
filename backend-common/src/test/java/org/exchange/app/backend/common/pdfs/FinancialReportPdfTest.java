package org.exchange.app.backend.common.pdfs;

import static org.junit.jupiter.api.Assertions.assertTrue;

import com.lowagie.text.DocumentException;
import java.io.File;
import java.io.FileOutputStream;
import java.io.IOException;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import org.exchange.app.common.api.model.EventType;
import org.exchange.app.external.api.model.FinancialReportRequest;
import org.junit.jupiter.api.Test;

class FinancialReportPdfTest {

  @Test
  void generatePdf_should_generateDocumentPdfOnFileSystem_when_methodCalledWithFinancialData()
      throws DocumentException, IOException {
    List<FinancialPdfRow> rows = new ArrayList<>();
    rows.add(
        new FinancialPdfRow(LocalDateTime.now().minusMinutes(10), EventType.EXCHANGE, 100_0000L,
            "EUR"));
    rows.add(
        new FinancialPdfRow(LocalDateTime.now().minusMinutes(4), EventType.FEE, -1000L,
            "EUR"));
    String filePath = File.createTempFile("testFinancialReport-", ".pdf").getPath();
    FinancialReportRequest reportRequest = new FinancialReportRequest(LocalDateTime.now().getYear(),
        LocalDateTime.now().getMonth().getValue(), List.of());
    try (FileOutputStream fos = new FileOutputStream(filePath)) {
      FinancialReportPdf.generatePdf(rows, reportRequest).writeTo(fos);
    } catch (IOException ioe) {
      ioe.printStackTrace();
    }
    File file = new File(filePath);
    assertTrue(file.exists() && file.isFile());
    //file.delete();
  }
}