package org.exchange.app.backend.common.pdfs;

import static org.assertj.core.api.Assertions.assertThat;
import static org.junit.jupiter.api.Assertions.assertThrows;

import com.lowagie.text.DocumentException;
import java.io.File;
import java.io.FileOutputStream;
import java.io.IOException;
import java.time.Clock;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;
import org.exchange.app.backend.common.CoreTestConfiguration;
import org.exchange.app.backend.common.exceptions.PdfGenerationException;
import org.exchange.app.backend.common.utils.ExchangeDateUtils;
import org.exchange.app.common.api.model.Address;
import org.exchange.app.common.api.model.Direction;
import org.exchange.app.common.api.model.ExchangeEvent;
import org.exchange.app.common.api.model.Pair;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;

@SpringBootTest(classes = {CoreTestConfiguration.class})
class ExchangeReportPdfTest {

  @Autowired
  private Clock clock;

  @Test
  void generatePdf_should_generateDocumentPdfOnFileSystem_when_methodCalledWithExchangeData()
      throws DocumentException, IOException {
    ExchangeDataResult exchangeDataResult = new ExchangeDataResult();
    exchangeDataResult.setExchangeEvent(
        new ExchangeEvent(1L, Pair.EUR_GBP, 500_0000L, Direction.SELL, 1_0803L,
            ExchangeDateUtils.currentLocalDateTime()));
    exchangeDataResult.setExchangePdfRows(new ArrayList<>());
    exchangeDataResult.getExchangePdfRows()
        .add(new ExchangePdfRow(340_0000L, 283_2100L, 1_0803L));
    exchangeDataResult.getExchangePdfRows()
        .add(new ExchangePdfRow(45_8600L, 283_2100L, 1_0795L));
    Address systemAddress = new Address();
    systemAddress.setCountryCode("PL");
    systemAddress.setZipCode("AX 12-34");
    systemAddress.setName("System Company Name Limited");
    systemAddress.setVatID("123456789 VatID");
    systemAddress.setTaxID("123456789 TaxID");
    systemAddress.setStreet("Oregon Str. 12");
    systemAddress.setCity("New York");
    Address addressData = new Address();
    addressData.setCountryCode("PL");
    addressData.setZipCode("AB 123");
    addressData.setName("Client Factory Limited");
    addressData.setVatID("987654321 VatID");
    addressData.setTaxID("987654321 TaxID");
    addressData.setStreet("Downtown 12DX/3");
    addressData.setCity("Fendry");
    exchangeDataResult.setRecipientAddress(addressData);
    exchangeDataResult.setSystemAddress(systemAddress);
    exchangeDataResult.setFee(3400L);
    String filePath = File.createTempFile("testExchangeReport-", ".pdf").getPath();
    try (FileOutputStream fos = new FileOutputStream(filePath)) {
      ExchangeReportPdf.generatePdf(exchangeDataResult).writeTo(fos);
    } catch (IOException ioe) {
      ioe.printStackTrace();
    }
    File file = new File(filePath);
    assertThat(file.exists() && file.isFile()).isTrue();
    file.delete();
  }

  @Test
  public void prepareNotes_should_generateNoteSectionHtmlPart_when_calledWithClock() {
    assertThat(ExchangeReportPdf.prepareNotes(clock)).isEqualTo("""
        <notes>
          <h1><span>Additional Notes</span></h1>
          <div>
            <p>Generated date: 2025-09-02 16:35:24 UTC</p>
          </div>
        </notes>
        """);
  }

  @Test
  public void prepareAddress_should_generateAddressHtmlPart_when_calledWithAddressDataAndHeader() {
    String header = "TestHeader";
    Address address = new Address(UUID.randomUUID(), UUID.randomUUID(), "Name", "CountryCode",
        "Street 12", "ZipCode", "City", "TaxId", "VatId", "Phone", 12);
    assertThat(ExchangeReportPdf.prepareAddress(header, address)).isEqualTo("""
        <address>
          <p><b>TestHeader</b></p>
          <p>Name: Name</p>
          <p>Street: Street 12</p>
          <p>City: City ZipCode</p>
          <p>Tax ID#: TaxId</p>
          <p>Vat ID#: VatId</p>
        </address>
        """);
  }

  @Test
  public void prepareAddress_should_generateAddressHtmlPart_when_calledWithEmptyHeader() {
    String header = "";
    Address address = new Address(UUID.randomUUID(), UUID.randomUUID(), "Name", "CountryCode",
        "Street 12", "ZipCode", "City", "TaxId", "VatId", "Phone", 12);
    assertThat(ExchangeReportPdf.prepareAddress(header, address)).isEqualTo("""
        <address>
          <p><b></b></p>
          <p>Name: Name</p>
          <p>Street: Street 12</p>
          <p>City: City ZipCode</p>
          <p>Tax ID#: TaxId</p>
          <p>Vat ID#: VatId</p>
        </address>
        """);
  }

  @Test
  public void prepareAddress_should_generateAddressHtmlPart_when_calledWithNullHeader() {
    Address address = new Address(UUID.randomUUID(), UUID.randomUUID(), "Name", "CountryCode",
        "Street 12", "ZipCode", "City", "TaxId", "VatId", "Phone", 12);
    assertThat(ExchangeReportPdf.prepareAddress(null, address)).isEqualTo("""
        <address>
          <p><b></b></p>
          <p>Name: Name</p>
          <p>Street: Street 12</p>
          <p>City: City ZipCode</p>
          <p>Tax ID#: TaxId</p>
          <p>Vat ID#: VatId</p>
        </address>
        """);
  }

  @Test
  public void prepareAddress_should_generateAddressHtmlPart_when_calledWithEmptyAddressData() {
    String header = "Header";
    Address address = new Address();
    assertThat(ExchangeReportPdf.prepareAddress(header, address)).isEqualTo("""
        <address>
          <p><b>Header</b></p>
          <p>Name: </p>
          <p>Street: </p>
          <p>City:  </p>
          <p>Tax ID#: </p>
          <p>Vat ID#: </p>
        </address>
        """);
  }

  @Test
  public void prepareAddress_should_generatePdfGenerationException_when_calledWithNullAddressData() {
    PdfGenerationException exception = assertThrows(PdfGenerationException.class,
        () -> ExchangeReportPdf.prepareAddress("Header", null));

    assertThat(exception.getExceptionRecord().getMessage()).isEqualTo(
        "Document 'ExchangeReport' generation problem : Empty address data");
  }

  @Test
  public void prepareRowExchange_should_generatePdfGenerationException_when_calledWithNullExchangeDataResult() {
    PdfGenerationException exception = assertThrows(PdfGenerationException.class,
        () -> ExchangeReportPdf.prepareRowExchange(null));

    assertThat(exception.getExceptionRecord().getMessage()).isEqualTo(
        "Document 'ExchangeReport' generation problem : Null data records");
  }

  @Test
  public void prepareRowExchange_should_generatePdfGenerationException_when_calledWithEmptyExchangeDataResult() {
    PdfGenerationException exception = assertThrows(PdfGenerationException.class,
        () -> ExchangeReportPdf.prepareRowExchange(new ExchangeDataResult()));

    assertThat(exception.getExceptionRecord().getMessage()).isEqualTo(
        "Document 'ExchangeReport' generation problem : Problem with preparing exchange details");
  }

  @Test
  public void prepareRowExchange_should_generateEmptyExchangeDataHtmlPart_when_calledWithoutExchangeCoreTicketList() {
    ExchangeDataResult exchangeDataResult = new ExchangeDataResult();
    exchangeDataResult.setExchangeEvent(
        new ExchangeEvent(1L, Pair.EUR_CHF, 100_2300L, Direction.BUY, 3_0010L,
            ExchangeDateUtils.currentLocalDateTime()));
    assertThat(ExchangeReportPdf.prepareRowExchange(exchangeDataResult)).isEqualTo("");
  }

  @Test
  public void prepareRowExchange_should_generatePreparedExchangeDataHtmlPart_when_calledWithExchangeCoreTicketList() {
    ExchangeDataResult exchangeDataResult = new ExchangeDataResult();
    List<ExchangePdfRow> tickets = new ArrayList<>();
    tickets.add(new ExchangePdfRow(20_0000L, 10_0000L, 3_0021L));
    exchangeDataResult.setExchangePdfRows(tickets);
    exchangeDataResult.setExchangeEvent(
        new ExchangeEvent(1L, Pair.EUR_CHF, 100_2300L, Direction.BUY, 3_0010L,
            ExchangeDateUtils.currentLocalDateTime()));
    assertThat(ExchangeReportPdf.prepareRowExchange(exchangeDataResult)).isEqualTo("""
        <tr>
        <td><span>Money exchange Sell CHF Buy EUR</span></td>
        <td class="align-right"><span>10.00 CHF</span></td>
        <td class="align-right"><span>3.0021</span></td>
        <td class="align-right"><span>20.00 EUR</span></td>
        </tr>
        """);
  }

  @Test
  public void prepareTableBalance_should_generatePdfGenerationException_when_calledWithNullExchangeDataResult() {
    PdfGenerationException exception = assertThrows(PdfGenerationException.class,
        () -> ExchangeReportPdf.prepareTableBalance(null));

    assertThat(exception.getExceptionRecord().getMessage()).isEqualTo(
        "Document 'ExchangeReport' generation problem : Null data records");
  }

  @Test
  public void prepareTableBalance_should_generatePdfGenerationException_when_calledWithEmptyExchangeDataResult() {
    PdfGenerationException exception = assertThrows(PdfGenerationException.class,
        () -> ExchangeReportPdf.prepareTableBalance(new ExchangeDataResult()));

    assertThat(exception.getExceptionRecord().getMessage()).isEqualTo(
        "Document 'ExchangeReport' generation problem : Problem with preparing table balance");
  }

  @Test
  public void prepareTableBalance_should_generatePreparedTableBalanceHtmlPart_when_calledWithExchangeCoreTicketList() {
    ExchangeDataResult exchangeDataResult = new ExchangeDataResult();
    List<ExchangePdfRow> tickets = new ArrayList<>();
    tickets.add(new ExchangePdfRow(20_0000L, 10_0000L, 3_0021L));
    exchangeDataResult.setExchangePdfRows(tickets);
    exchangeDataResult.setExchangeEvent(
        new ExchangeEvent(1L, Pair.EUR_CHF, 100_2300L, Direction.BUY, 3_0010L,
            ExchangeDateUtils.currentLocalDateTime()));
    assertThat(ExchangeReportPdf.prepareTableBalance(exchangeDataResult)).isEqualTo("""
        <table class="balance">
          <tr>
            <th><span>Exchanged Amount</span></th>
            <td class="align-right"><span>20.00 EUR</span></td>
          </tr>
          <tr>
            <th><span>Amount Fee</span></th>
            <td class="align-right"><span>0.00 EUR</span></td>
          </tr>
          <tr>
            <th><span>Total : Exchanged Amount - Fee</span></th>
            <td class="align-right"><span>20.00 EUR</span></td>
          </tr>
        </table>
        """);
  }

  @Test
  public void prepareDetailTable_should_generatePdfGenerationException_when_calledWithNullExchangeDataResult() {
    PdfGenerationException exception = assertThrows(PdfGenerationException.class,
        () -> ExchangeReportPdf.prepareDetailTable(null));

    assertThat(exception.getExceptionRecord().getMessage()).isEqualTo(
        "Document 'ExchangeReport' generation problem : Null data records");
  }

  @Test
  public void prepareDetailTable_should_generatePdfGenerationException_when_calledWithEmptyExchangeDataResult() {
    PdfGenerationException exception = assertThrows(PdfGenerationException.class,
        () -> ExchangeReportPdf.prepareDetailTable(new ExchangeDataResult()));

    assertThat(exception.getExceptionRecord().getMessage()).isEqualTo(
        "Document 'ExchangeReport' generation problem : Problem with preparing detail table");
  }

  @Test
  public void prepareDetailTable_should_generateDetailTableHtmlPart_when_calledWithExchangeCoreTicketList() {

    ExchangeDataResult exchangeDataResult = new ExchangeDataResult();
    List<ExchangePdfRow> tickets = new ArrayList<>();
    tickets.add(new ExchangePdfRow(20_0000L, 10_0000L, 3_0021L));
    exchangeDataResult.setExchangePdfRows(tickets);
    exchangeDataResult.setExchangeEvent(
        new ExchangeEvent(1L, Pair.EUR_CHF, 100_2300L, Direction.BUY, 3_0010L,
            ExchangeDateUtils.toLocalDateTime(clock.instant().getEpochSecond())));
    assertThat(ExchangeReportPdf.prepareDetailTable(exchangeDataResult)).isEqualTo("""
        <table class="detail-table">
          <tr>
            <th><span>Exchange ID #</span></th>
            <td><span>1</span></td>
          </tr>
          <tr>
            <th><span>Exchange Date</span></th>
            <td><span>2025-09-02 16:35:24 UTC</span></td>
          </tr>
        </table>
        """);


  }

}