package org.exchange.app.backend.common.pdfs;

import java.io.ByteArrayOutputStream;
import java.time.Clock;
import java.time.Instant;
import java.time.ZoneOffset;
import lombok.extern.log4j.Log4j2;
import org.exchange.app.backend.common.exceptions.PdfGenerationException;
import org.exchange.app.backend.common.utils.CurrencyUtils;
import org.exchange.app.backend.common.utils.NormalizeUtils;
import org.exchange.app.common.api.model.Address;
import org.exchange.app.common.api.model.Direction;
import org.exchange.app.common.api.model.ExchangeEvent;
import org.xhtmlrenderer.pdf.ITextRenderer;

@Log4j2
public class ExchangeReportPdf {

  private static final String htmlHead =
      """
          <html>
            <head>
              <title>Invoice</title>
              <style>
                {
                  border: 0;
                  box-sizing: content-box;
                  color: inherit;
                  font-family: inherit;
                  font-size: inherit;
                  font-style: inherit;
                  font-weight: inherit;
                  line-height: inherit;
                  list-style: none;
                  margin: 0;
                  padding: 0;
                  text-decoration: none;
                  vertical-align: top;
                }
                /* heading */
                h1 { font: bold 100% sans-serif; letter-spacing: 0.5em; text-align: center; text-transform: uppercase; }
                /* table */
                table { font-size: 75%; table-layout: fixed; width: 100%; }
                table { border-collapse: separate; border-spacing: 2px; }
                th, td { border-width: 1px; padding: 0.5em; position: relative; text-align: left; }
                th, td { border-radius: 0.25em; border-style: solid; }
                th { background: #EEE; border-color: #BBB; }
                td { border-color: #DDD; }
                /* page */
                .html { font: 16px/1 'Open Sans', sans-serif; overflow: auto; padding: 0.5in; }
                .html { background: #999; cursor: default; }
                .body { box-sizing: border-box; height: 11in; margin: 0 auto; overflow: hidden; padding: 0.5in; width: 8.5in; }
                .body { background: #FFF; border-radius: 1px; box-shadow: 0 0 1in -0.25in rgba(0, 0, 0, 0.5); }
                /* header */
                .header { margin: 0 0 3em; }
                header:after { clear: both; content: ""; display: table; }
                header h1 { background: #999; border-radius: 0.25em; color: #FFF; margin: 0 0 1em; padding: 0.5em 0; }
                header address { float: left; font-size: 100%; font-style: normal; line-height: 1.25; margin: 0 1em 1em 0; }
                header address p { margin: 0 0 0.25em; }
                header span, header img { display: block; float: right; }
                header span { margin: 0 0 1em 1em; max-height: 25%; max-width: 60%; position: relative; }
                header img { max-height: 100%; max-width: 100%; }
                /* article */
                article, article address, table.detail-table, table.inventory { margin: 0 0 3em; }
                article:after { clear: both; content: ""; display: table; }
                article h1 { clip: rect(0 0 0 0); position: absolute; }
                article address { float: left; font-size: 100%; font-weight: bold; }
                /* table detail-table  balance */
                table.detail-table, table.balance { float: right; width: 46%; }
                table.detail-table:after, table.balance:after { clear: both; content: ""; display: table; }
                /* table detail-table */
                table.detail-table th { width: 60%; }
                table.detail-table td { text-align: right; width: 40%; }
                /* table items */
                table.exchange { clear: both; width: 100%; }
                table.exchange th { font-weight: bold; text-align: center; }
                table.exchange th:nth-child(1) { width: 45.1%; }
                table.exchange th:nth-child(2) { width: 18.3%; }
                table.exchange th:nth-child(3) { text-align: right; width: 18.3%; }
                table.exchange th:nth-child(4) { text-align: right; width: 18.3%; }
                /* table balance */
                .table.balance th, table.balance td { width: 40%; }
                .table.balance td { text-align: right; }
                /* notes */
                notes h1 { border: none; border-width: 0 0 1px; margin: 0 0 1em; }
                notes h1 { border-color: #999; border-bottom-style: solid; }
                .add { margin: -2.5em 0 0; }
                .add:hover { background: #00ADEE; }
                .cut { opacity: 0; position: absolute; top: 0; left: -1.5em; }
                .cut { -webkit-transition: opacity 100ms ease-in; }
                tr:hover .cut { opacity: 1; }
                @media print {
                  * { -webkit-print-color-adjust: exact; }
                  html { background: none; padding: 0; }
                  body { box-shadow: none; margin: 0; }
                  span:empty { display: none; }
                  .add, .cut { display: none; }
                }
                .align-right{
                  text-align: right;
                }
          
                @page { margin: 0; }
              </style>
            </head>
          """;
  private final static String invoiceHtmlContent =
      """
          <body>
          <header>
            <h1>Money exchange document</h1>
            <table>
              <thead></thead>
              <tbody>
                <tr>
                  <td>%s</td>
                  <td>%s</td>
                </tr>
              </tbody>
            </table>
          </header>
          <article>
            %s
            <table class="exchange">
              <thead>
              <tr>
                <th><span>Description</span></th>
                <th><span>Money Amount</span></th>
                <th><span>Ratio</span></th>
                <th><span>Exchange Amount</span></th>
              </tr>
              </thead>
              <tbody>
              %s
              </tbody>
            </table>
            %s
          </article>
          %s
          </body>
          </html>
          """;
  private static final String address = """
      <address>
        <p><b>%s</b></p>
        <p>Name: %s</p>
        <p>Street: %s</p>
        <p>City: %s %s</p>
        <p>Tax ID#: %s</p>
        <p>Vat ID#: %s</p>
      </address>
      """;
  private static final String notes = """
      <notes>
        <h1><span>Additional Notes</span></h1>
        <div>
          <p>Generated date: %s UTC</p>
        </div>
      </notes>
      """;
  private static final String detailTable = """
      <table class="detail-table">
        <tr>
          <th><span>Exchange ID #</span></th>
          <td><span>%d</span></td>
        </tr>
        <tr>
          <th><span>Exchange Date</span></th>
          <td><span>%s UTC</span></td>
        </tr>
      </table>
      """;


  private static final String tableBalance = """
      <table class="balance">
        <tr>
          <th><span>Exchanged Amount</span></th>
          <td class="align-right"><span>%s %s</span></td>
        </tr>
        <tr>
          <th><span>Amount Fee</span></th>
          <td class="align-right"><span>%s %s</span></td>
        </tr>
        <tr>
          <th><span>Total : Exchanged Amount - Fee</span></th>
          <td class="align-right"><span>%s %s</span></td>
        </tr>
      </table>
      """;

  public static ByteArrayOutputStream generatePdf(ExchangeDataResult exchangeDataResult) {
    ITextRenderer renderer = new ITextRenderer();
    if (exchangeDataResult == null) {
      throw new PdfGenerationException(ReportsEnum.ExchangeReport, "Empty exchange data");
    }
    String documentHtml = htmlHead + String.format(
        invoiceHtmlContent,
        prepareAddress("Sender", exchangeDataResult.getSystemAddress()),
        prepareAddress("Recipient", exchangeDataResult.getRecipientAddress()),
        prepareDetailTable(exchangeDataResult),
        prepareRowExchange(exchangeDataResult),
        prepareTableBalance(exchangeDataResult),
        prepareNotes(Clock.system(ZoneOffset.UTC))
    );
    renderer.setDocumentFromString(documentHtml);
    renderer.layout();
    ByteArrayOutputStream bos = new ByteArrayOutputStream();
    renderer.createPDF(bos);
    return bos;
  }

  public static String prepareDetailTable(ExchangeDataResult exchangeDataResult) {
    if (exchangeDataResult == null) {
      throw new PdfGenerationException(ReportsEnum.ExchangeReport, "Null data records");
    }
    try {
      String date = exchangeDataResult.getExchangeEvent().getDateUtc().toString().substring(0, 19);
      return String.format(detailTable,
          exchangeDataResult.getExchangeEvent().getId(), date.replace("T", " "));
    } catch (Exception e) {
      log.error(e);
      throw new PdfGenerationException(ReportsEnum.ExchangeReport,
          "Problem with preparing detail table");
    }
  }

  public static String prepareTableBalance(ExchangeDataResult exchangeDataResult) {
    if (exchangeDataResult == null) {
      throw new PdfGenerationException(ReportsEnum.ExchangeReport, "Null data records");
    }
    try {
      ExchangeEvent exchangeEvent = exchangeDataResult.getExchangeEvent();
      boolean buy = Direction.BUY.equals(exchangeEvent.getDirection());
      long sum = exchangeDataResult.getExchangeCoreTicketList().stream()
          .mapToLong(buy ? ExchangePdfRow::getBuyAmount : ExchangePdfRow::getSellAmount).sum();
      String reverseCurrency = CurrencyUtils.pairReverseCurrencyString(exchangeEvent);
      return String.format(tableBalance,
          NormalizeUtils.normalizeValueToMoney(sum),
          reverseCurrency,
          NormalizeUtils.normalizeValueToMoney(exchangeDataResult.getFee()),
          reverseCurrency,
          NormalizeUtils.normalizeValueToMoney(sum + exchangeDataResult.getFee()),
          reverseCurrency
      );
    } catch (Exception e) {
      log.error(e);
      throw new PdfGenerationException(ReportsEnum.ExchangeReport,
          "Problem with preparing table balance");
    }
  }

  public static String prepareAddress(String header, Address addressData) {
    if (addressData == null) {
      throw new PdfGenerationException(ReportsEnum.ExchangeReport, "Empty address data");
    }
    return String.format(address,
        header != null ? header : "",
        addressData.getName() != null ? addressData.getName() : "",
        addressData.getStreet() != null ? addressData.getStreet() : "",
        addressData.getCity() != null ? addressData.getCity() : "",
        addressData.getZipCode() != null ? addressData.getZipCode() : "",
        addressData.getTaxID() != null ? addressData.getTaxID() : "",
        addressData.getVatID() != null ? addressData.getVatID() : "");
  }

  public static String prepareNotes(Clock clock) {
    String stringDateTime = Instant.now(clock).toString().substring(0, 19).replace("T", " ");
    return String.format(notes, stringDateTime);
  }

  public static String prepareRowExchange(ExchangeDataResult exchangeDataResult) {
    if (exchangeDataResult == null) {
      throw new PdfGenerationException(ReportsEnum.ExchangeReport, "Null data records");
    }
    try {
      StringBuilder builder = new StringBuilder();
      ExchangeEvent exchangeEvent = exchangeDataResult.getExchangeEvent();
      String reverseCurrency = CurrencyUtils.pairReverseCurrencyString(exchangeEvent);
      String originalCurrency = CurrencyUtils.pairToCurrency(exchangeEvent);
      boolean buy = Direction.BUY.equals(exchangeEvent.getDirection());

      exchangeDataResult.getExchangeCoreTicketList().forEach(e -> {
        builder.append("<tr>\n");
        builder.append("<td><span>Money exchange Sell ");
        builder.append(originalCurrency);
        builder.append(" Buy ");
        builder.append(reverseCurrency);
        builder.append("</span></td>\n");
        builder.append("<td class=\"align-right\"><span>");
        builder.append(
            NormalizeUtils.normalizeValueToMoney(buy ? e.getSellAmount() : e.getBuyAmount()));
        builder.append(" ");
        builder.append(originalCurrency);
        builder.append("</span></td>\n");
        builder.append("<td class=\"align-right\"><span>");
        builder.append(NormalizeUtils.normalizeValueToRatio(e.getRatio()));
        builder.append("</span></td>\n");
        builder.append("<td class=\"align-right\"><span>");
        builder.append(
            NormalizeUtils.normalizeValueToMoney(buy ? e.getBuyAmount() : e.getSellAmount()));
        builder.append(" ");
        builder.append(reverseCurrency);
        builder.append("</span></td>\n");
        builder.append("</tr>\n");
      });
      return builder.toString();
    } catch (Exception e) {
      log.error(e);
      throw new PdfGenerationException(ReportsEnum.ExchangeReport,
          "Problem with preparing exchange details");
    }
  }
}
