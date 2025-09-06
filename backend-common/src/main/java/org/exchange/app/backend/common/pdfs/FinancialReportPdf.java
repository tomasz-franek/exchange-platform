package org.exchange.app.backend.common.pdfs;

import com.lowagie.text.DocumentException;
import java.io.ByteArrayOutputStream;
import java.time.Clock;
import java.time.Instant;
import java.time.ZoneOffset;
import java.util.List;
import org.exchange.app.backend.common.exceptions.PdfGenerationException;
import org.exchange.app.backend.common.utils.NormalizeUtils;
import org.exchange.app.external.api.model.FinancialReportRequest;
import org.xhtmlrenderer.pdf.ITextRenderer;

public class FinancialReportPdf {

  private static final String htmlHead =
      """
          <html>
          			<head>
          			  <title>Financial report</title>
          			  <style>
          			  /* table items */
          			    table.exchange { clear: both; width: 100%; }
          			    table.exchange th { font-weight: bold; text-align: center; }
          			    table.exchange th:nth-child(1) { width: 40%; }
          			    table.exchange th:nth-child(2) { width: 30%; }
          			    table.exchange th:nth-child(3) { width: 30%; }
          			    .align-right{
          			      text-align: right;
          			    }
          			  </style>
          			</head>
          """;
  private final static String htmlContent =
      """
          <body>
          <header>
          	<h1>Financial report %d - %d</h1>
          </header>
          	<table class="exchange">
          		<thead>
          		<tr>
          			<th><span>Date</span></th>
          			<th><span>Amount</span></th>
          			<th><span>Operation</span></th>
          		</tr>
          		</thead>
          		<tbody>
          		%s
          		</tbody>
          	</table>
          %s
          </body>
          </html>
          """;


  private static final String notes = """
      <div>
        <p>Generated date: %s UTC</p>
      </div>
      """;


  public static ByteArrayOutputStream generatePdf(List<FinancialPdfRow> list,
      FinancialReportRequest request)
      throws DocumentException {
    ITextRenderer renderer = new ITextRenderer();
    String documentHtml = htmlHead + String.format(
        htmlContent,
        request.getYear(),
        request.getMonth(),
        prepareTable(list),
        prepareNotes(Clock.system(ZoneOffset.UTC))
    );

    renderer.setDocumentFromString(
        documentHtml
    );
    renderer.layout();
    ByteArrayOutputStream bos = new ByteArrayOutputStream();
    renderer.createPDF(bos);
    return bos;
  }


  public static String prepareNotes(Clock clock) {
    String stringDateTime = Instant.now(clock).toString().substring(0, 19).replace("T", " ");
    return String.format(notes, stringDateTime);
  }

  public static String prepareTable(List<FinancialPdfRow> financialPdfRows) {
    if (financialPdfRows == null) {
      throw new PdfGenerationException(ReportsEnum.ExchangeReport, "Null data records");
    }
    StringBuilder builder = new StringBuilder();

    financialPdfRows.forEach(row -> {
      builder.append("<tr>\n");
      builder.append("<td>");
      builder.append(row.date().toString().substring(0, 19).replace('T', ' '));
      builder.append("</td>\n");
      builder.append("<td class=\"align-right\">");
      builder.append(NormalizeUtils.normalizeValueToMoney(row.amount()));
      builder.append(" ");
      builder.append(row.currency());
      builder.append("</td>\n");
      builder.append("<td class=\"align-right\">");
      builder.append(row.eventType().toString());
      builder.append("</td>\n");
      builder.append("</tr>\n");
    });
    return builder.toString();
  }

}
