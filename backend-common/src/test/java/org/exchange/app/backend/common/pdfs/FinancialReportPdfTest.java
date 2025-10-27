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
import org.exchange.app.common.api.model.Currency;
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
        new FinancialPdfRow(now.minusMinutes(10), EventType.EXCHANGE, 100_0000L, Currency.EUR));
    rows.add(
        new FinancialPdfRow(now.minusMinutes(4), EventType.FEE, -1000L, Currency.EUR));
    String filePath = File.createTempFile("testFinancialReport-", ".pdf").getPath();
    FinancialReportRequest reportRequest = new FinancialReportRequest(
        now.getYear(), now.getMonth().getValue(), null, Currency.EUR);
    try (FileOutputStream fos = new FileOutputStream(filePath)) {
      FinancialReportPdf.generatePdf(rows, reportRequest, 0L, Currency.EUR).writeTo(fos);
    } catch (IOException ioe) {
      ioe.printStackTrace();
    }
    File file = new File(filePath);
    assertThat(file.exists() && file.isFile()).isTrue();
    assertThat(file.delete()).isTrue();
  }

  @Test
  void generatePdf_should_generateDocumentPdfForMoreThanOnePage_when_withLongListOfFinancialRows()
      throws DocumentException, IOException {
    List<FinancialPdfRow> rows = new ArrayList<>();
    LocalDateTime now = ExchangeDateUtils.currentLocalDateTime();
    for (int i = 0; i < 200; i++) {
      rows.add(
          new FinancialPdfRow(now.minusMinutes(10), EventType.EXCHANGE, 100_0000L + i,
              Currency.EUR));
      rows.add(
          new FinancialPdfRow(now.minusMinutes(4), EventType.FEE, -1000L + 1, Currency.EUR));
    }
    String filePath = File.createTempFile("testFinancialReport-", ".pdf").getPath();
    FinancialReportRequest reportRequest = new FinancialReportRequest(
        now.getYear(), now.getMonth().getValue(), null, Currency.EUR);
    try (FileOutputStream fos = new FileOutputStream(filePath)) {
      FinancialReportPdf.generatePdf(rows, reportRequest, 0L, Currency.EUR).writeTo(fos);
    } catch (IOException ioe) {
      ioe.printStackTrace();
    }
    File file = new File(filePath);
    assertThat(file.exists() && file.isFile()).isTrue();
    assertThat(file.delete()).isTrue();
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
        () -> FinancialReportPdf.prepareTable(null, 0L, Currency.EUR));

    assertThat(exception.getExceptionRecord().getMessage()).isEqualTo(
        "Document 'ExchangeReport' generation problem : Null data records");
  }

  @Test
  void prepareTable_should_generateEmptyRowsInHtmlSection_when_calledWithEmptyFinancialPdfRows() {
    assertThat(FinancialReportPdf.prepareTable(new ArrayList<>(), 0L, Currency.EUR)).isEqualTo("""
        <tr>
        <td></td>
        <td class="align-right">Starting Balance</td>
        <td class="align-right"></td>
        <td class="align-right">0.00 EUR</td>
        </tr>
        <tr>
        <td></td>
        <td class="align-right">Closing Balance</td>
        <td class="align-right"></td>
        <td class="align-right">0.00 EUR</td>
        </tr>
        """);
  }

  @Test
  void prepareTable_should_generateException_when_nullInitialAmount() {
    PdfGenerationException exception = assertThrows(PdfGenerationException.class,
        () -> FinancialReportPdf.prepareTable(new ArrayList<>(), null, Currency.EUR));

    assertThat(exception.getExceptionRecord().getMessage()).isEqualTo(
        "Document 'ExchangeReport' generation problem : Null initial balance");
  }

  @Test
  void prepareTable_should_generateEmptyRowsInHtmlSection_when_zeroInitialAmount() {
    assertThat(FinancialReportPdf.prepareTable(new ArrayList<>(), 0L, Currency.EUR)).isEqualTo("""
        <tr>
        <td></td>
        <td class="align-right">Starting Balance</td>
        <td class="align-right"></td>
        <td class="align-right">0.00 EUR</td>
        </tr>
        <tr>
        <td></td>
        <td class="align-right">Closing Balance</td>
        <td class="align-right"></td>
        <td class="align-right">0.00 EUR</td>
        </tr>
        """);
  }

  @Test
  void prepareTable_should_generateTableRowsInHtmlSection_when_calledWithPreparedFinancialPdfRowsAndZeroInitialAmount() {
    List<FinancialPdfRow> financialPdfRows = new ArrayList<>();
    financialPdfRows.add(
        new FinancialPdfRow(CoreTestConfiguration.localDateTime, EventType.EXCHANGE, 100000L,
            Currency.EUR));
    financialPdfRows.add(
        new FinancialPdfRow(CoreTestConfiguration.localDateTime, EventType.FEE, -100L,
            Currency.EUR));
    assertThat(FinancialReportPdf.prepareTable(financialPdfRows, 0L, Currency.EUR)).isEqualTo("""
        <tr>
        <td></td>
        <td class="align-right">Starting Balance</td>
        <td class="align-right"></td>
        <td class="align-right">0.00 EUR</td>
        </tr>
        <tr>
        <td>2025-09-02 16:35:24</td>
        <td class="align-right">EXCHANGE</td>
        <td class="align-right">10.00 EUR</td>
        <td class="align-right">10.00 EUR</td>
        </tr>
        <tr>
        <td>2025-09-02 16:35:24</td>
        <td class="align-right">FEE</td>
        <td class="align-right">-0.01 EUR</td>
        <td class="align-right">9.99 EUR</td>
        </tr>
        <tr>
        <td></td>
        <td class="align-right">Closing Balance</td>
        <td class="align-right"></td>
        <td class="align-right">9.99 EUR</td>
        </tr>
        """);
  }

  @Test
  void prepareTable_should_generateTableRowsInHtmlSection_when_calledWithPreparedFinancialPdfRowsAndInitialAmountSomeValue() {
    List<FinancialPdfRow> financialPdfRows = new ArrayList<>();
    financialPdfRows.add(
        new FinancialPdfRow(CoreTestConfiguration.localDateTime, EventType.EXCHANGE, 100000L,
            Currency.EUR));
    financialPdfRows.add(
        new FinancialPdfRow(CoreTestConfiguration.localDateTime, EventType.FEE, -100L,
            Currency.EUR));
    assertThat(FinancialReportPdf.prepareTable(financialPdfRows, 34_0000L, Currency.EUR)).isEqualTo(
        """
            <tr>
            <td></td>
            <td class="align-right">Starting Balance</td>
            <td class="align-right"></td>
            <td class="align-right">34.00 EUR</td>
            </tr>
            <tr>
            <td>2025-09-02 16:35:24</td>
            <td class="align-right">EXCHANGE</td>
            <td class="align-right">10.00 EUR</td>
            <td class="align-right">44.00 EUR</td>
            </tr>
            <tr>
            <td>2025-09-02 16:35:24</td>
            <td class="align-right">FEE</td>
            <td class="align-right">-0.01 EUR</td>
            <td class="align-right">43.99 EUR</td>
            </tr>
            <tr>
            <td></td>
            <td class="align-right">Closing Balance</td>
            <td class="align-right"></td>
            <td class="align-right">43.99 EUR</td>
            </tr>
            """);
  }
}