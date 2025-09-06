package org.exchange.app.backend.common.pdfs;

import static org.assertj.core.api.Assertions.assertThat;
import static org.junit.jupiter.api.Assertions.assertThrows;

import com.lowagie.text.DocumentException;
import java.io.File;
import java.io.FileOutputStream;
import java.io.IOException;
import java.time.Clock;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import org.exchange.app.backend.common.CoreTestConfiguration;
import org.exchange.app.backend.common.exceptions.PdfGenerationException;
import org.exchange.app.backend.common.utils.ExchangeDateUtils;
import org.exchange.app.common.api.model.EventType;
import org.exchange.app.external.api.model.FinancialReportRequest;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;

@SpringBootTest(classes = {CoreTestConfiguration.class})
class FinancialReportPdfTest {

  @Autowired
  private Clock clock;

  @Test
  void generatePdf_should_generateDocumentPdfOnFileSystem_when_methodCalledWithFinancialData()
      throws DocumentException, IOException {
    List<FinancialPdfRow> rows = new ArrayList<>();
    LocalDateTime now = ExchangeDateUtils.currentLocalDateTime();
    rows.add(
        new FinancialPdfRow(now.minusMinutes(10), EventType.EXCHANGE, 100_0000L, "EUR"));
    rows.add(
        new FinancialPdfRow(now.minusMinutes(4), EventType.FEE, -1000L, "EUR"));
    String filePath = File.createTempFile("testFinancialReport-", ".pdf").getPath();
    FinancialReportRequest reportRequest = new FinancialReportRequest(
        now.getYear(), now.getMonth().getValue(), List.of());
    try (FileOutputStream fos = new FileOutputStream(filePath)) {
      FinancialReportPdf.generatePdf(rows, reportRequest).writeTo(fos);
    } catch (IOException ioe) {
      ioe.printStackTrace();
    }
    File file = new File(filePath);
    assertThat(file.exists() && file.isFile()).isTrue();
    file.delete();
  }

  @Test
  public void prepareNotes_should_generateNoteSectionHtmlPart_when_calledWithClock() {
    assertThat(FinancialReportPdf.prepareNotes(clock)).isEqualTo("""
        <div>
          <p>Generated date: 2025-09-02 16:35:24 UTC</p>
        </div>
        """);
  }

  @Test
  void prepareTable_should_generatePdfGenerationException_when_calledWithNullFinancialPdfRows() {
    PdfGenerationException exception = assertThrows(PdfGenerationException.class,
        () -> FinancialReportPdf.prepareTable(null));

    assertThat(exception.getExceptionRecord().getMessage()).isEqualTo(
        "Document 'ExchangeReport' generation problem : Null data records");
  }

  @Test
  void prepareTable_should_generateEmptyRowsInHtmlSection_when_calledWithEmptyFinancialPdfRows() {
    assertThat(FinancialReportPdf.prepareTable(new ArrayList<>())).isEqualTo("");
  }

  @Test
  void prepareTable_should_generateTableRowsInHtmlSection_when_calledWithPreparedFinancialPdfRows() {
    List<FinancialPdfRow> financialPdfRows = new ArrayList<>();
    financialPdfRows.add(
        new FinancialPdfRow(CoreTestConfiguration.localDateTime, EventType.EXCHANGE, 100000L,
            "EUR"));
    financialPdfRows.add(
        new FinancialPdfRow(CoreTestConfiguration.localDateTime, EventType.FEE, -100L, "EUR"));
    assertThat(FinancialReportPdf.prepareTable(financialPdfRows)).isEqualTo("""
        <tr>
        <td>2025-09-02 16:35:24</td>
        <td class="align-right">10.00 EUR</td>
        <td class="align-right">EXCHANGE</td>
        </tr>
        <tr>
        <td>2025-09-02 16:35:24</td>
        <td class="align-right">-0.01 EUR</td>
        <td class="align-right">FEE</td>
        </tr>
        """);
  }
}