package org.exchange.app.backend.common.pdfs;

import com.lowagie.text.DocumentException;
import java.io.ByteArrayOutputStream;
import java.time.Clock;
import java.time.Instant;
import java.time.ZoneOffset;
import java.util.List;
import org.exchange.app.backend.common.exceptions.PdfGenerationException;
import org.exchange.app.backend.common.utils.NormalizeUtils;
import org.exchange.app.common.api.model.Currency;
import org.exchange.app.external.api.model.FinancialReportRequest;
import org.xhtmlrenderer.pdf.ITextRenderer;

public class FinancialReportPdf {

  public static final String TD_END = "</td>\n";
  public static final String TR_END = "</tr>\n";
  public static final String TD_CLASS_ALIGN_RIGHT = "<td class=\"align-right\">";
  public static final String TR_START = "<tr>\n";

  private FinancialReportPdf() {
  }

  private static final String HTML_HEAD =
      """
          <html>
            <head>
              <title>Financial report</title>
              <style>
                /* table items */
                table.exchange { clear: both; width: 100%; }
                table.exchange th { font-weight: bold; text-align: center; }
                table.exchange th:nth-child(1) { width: 40%; }
                table.exchange th:nth-child(2) { width: 20%; }
                table.exchange th:nth-child(3) { width: 20%; }
                table.exchange th:nth-child(4) { width: 20%; }
                .align-right{
                text-align: right;
                }
                /* page header */
                @page{
                  @bottom-left {
                    content: element(footer);
                    vertical-align: top;
                    padding-top: 10px;
                  }
                  @top-right {
                    content: element(header);
                    vertical-align: bottom;
                    padding-bottom: 10px;
                  }
                  size: A4 portrait;
                  margin-top:1.5cm;
                  margin-left:2cm;
                  margin-right:2cm;
                  margin-bottom:1.5cm;
                }
                div.header {
                  display: block;
                  position: running(header);
                  border-bottom: 1px solid black;
                }
                div.footer {
                  margin-top: 0cm;
                  display: block;
                  position: running(footer);
                  border-top: 1px solid black;
                }
                div.content {
                  display: block;
                  width: 16.4cm;
                  text-align: justify;
                }
                #pagenumber:before {
                 content: counter(page);
                }
                #pagecount:before {
                  content: counter(pages);
                }
              table, th, td {
                border: 1px solid black;
                border-collapse: collapse;
              }
              tr {
                page-break-inside: avoid;
                page-break-after: auto;
              }
              </style>
            </head>
          """;
  private static final String HTML_CONTENT =
      """
          <body>
          <div class="content" >
            <div class="header">Financial report %d - %02d</div>
          
            <div class="footer" >
                <p>Page <span id="pagenumber"></span> of <span id="pagecount"></span></p>/
            </div>
            <table class="exchange">
              <thead>
              <tr>
                <th><span>Date</span></th>
                <th><span>Operation</span></th>
                <th><span>Amount</span></th>
                <th><span>Balance</span></th>
              </tr>
              </thead>
              <tbody>
              %s
              </tbody>
            </table>
            %s
          </div>
          </body>
          </html>
          """;


  private static final String NOTES = """
      <div>
        <p>Generated date: %s UTC</p>
      </div>
      """;


  public static ByteArrayOutputStream generatePdf(List<FinancialPdfRow> list,
      FinancialReportRequest request, Long initialBalance, Currency currency)
      throws DocumentException {
    ITextRenderer renderer = new ITextRenderer();
    String documentHtml = HTML_HEAD + String.format(
        HTML_CONTENT,
        request.getYear(),
        request.getMonth(),
        prepareTable(list, initialBalance, currency),
        prepareNotes(Clock.system(ZoneOffset.UTC))
    );

    renderer.setDocumentFromString(documentHtml);
    renderer.layout();
    ByteArrayOutputStream bos = new ByteArrayOutputStream();
    renderer.createPDF(bos);
    return bos;
  }


  public static String prepareNotes(Clock clock) {
    String stringDateTime = Instant.now(clock).toString().substring(0, 19).replace("T", " ");
    return String.format(NOTES, stringDateTime);
  }

  public static String prepareTable(List<FinancialPdfRow> financialPdfRows,
      Long initialBalance, Currency currency) {

    if (financialPdfRows == null) {
      throw new PdfGenerationException(ReportsEnum.ExchangeReport, "Null data records");
    }
    if (initialBalance == null) {
      throw new PdfGenerationException(ReportsEnum.ExchangeReport, "Null initial balance");
    }
    long currentAmount = initialBalance;
    StringBuilder builder = new StringBuilder();

    builder.append(TR_START);
    builder.append("<td></td>\n");
    builder.append("<td class=\"align-right\">Starting Balance</td>\n");
    builder.append("<td class=\"align-right\"></td>\n");
    builder.append(TD_CLASS_ALIGN_RIGHT);
    builder.append(NormalizeUtils.normalizeValueToMoney(currentAmount));
    builder.append(" ");
    builder.append(currency);
    builder.append(TD_END);
    builder.append(TR_END);

    for (FinancialPdfRow row : financialPdfRows) {
      currentAmount += row.amount();
      builder.append(TR_START);
      builder.append("<td>");
      builder.append(row.date().toString().substring(0, 19).replace('T', ' '));
      builder.append(TD_END);
      builder.append(TD_CLASS_ALIGN_RIGHT);
      builder.append(row.eventType().toString());
      builder.append(TD_END);
      builder.append(TD_CLASS_ALIGN_RIGHT);
      builder.append(NormalizeUtils.normalizeValueToMoney(row.amount()));
      builder.append(" ");
      builder.append(currency);
      builder.append(TD_END);
      builder.append(TD_CLASS_ALIGN_RIGHT);
      builder.append(NormalizeUtils.normalizeValueToMoney(currentAmount));
      builder.append(" ");
      builder.append(currency);
      builder.append(TD_END);
      builder.append(TR_END);
    }
    builder.append(TR_START);
    builder.append("<td></td>\n");
    builder.append("<td class=\"align-right\">Closing Balance</td>\n");
    builder.append(TD_CLASS_ALIGN_RIGHT);
    builder.append(TD_END);
    builder.append(TD_CLASS_ALIGN_RIGHT);
    builder.append(NormalizeUtils.normalizeValueToMoney(currentAmount));
    builder.append(" ");
    builder.append(currency);
    builder.append(TD_END);
    builder.append(TR_END);
    return builder.toString();
  }

}
